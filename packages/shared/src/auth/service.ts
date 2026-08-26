// ============================================================
// @nexora/shared - Unified Auth Service
// Complete authentication system for all three applications
// ============================================================

import { hash, compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import { query, transaction } from '../database.js';
import { generateId } from '../utils/index.js';

// ─── Configuration ───
const JWT_SECRET = process.env.JWT_SECRET || randomBytes(64).toString('hex');
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || randomBytes(64).toString('hex');
const ACCESS_TOKEN_EXPIRY = '8h';
const REFRESH_TOKEN_EXPIRY = '7d';
const BCRYPT_ROUNDS = 12;

// ─── Types ───
export interface AuthTokenPayload {
  id: string;
  email: string;
  role: string;
  org_id: string;
  security_level: number;
  iat: number;
  exp: number;
}

export interface AuthResult {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    roles: string[];
    orgId: string;
  };
  device: {
    id: string;
    platform: string;
  };
}

export interface DeviceInfo {
  platform: 'ios' | 'android' | 'web';
  appVersion: string;
  fingerprint: string;
}

// ─── Password Helpers ───
export async function hashPassword(password: string): Promise<string> {
  return hash(password, BCRYPT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return compare(password, hash);
}

export function checkPasswordStrength(password: string): {
  score: number;
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) score++;
  else feedback.push('Password must be at least 8 characters');

  if (/[a-z]/.test(password)) score++;
  else feedback.push('Add lowercase letters');

  if (/[A-Z]/.test(password)) score++;
  else feedback.push('Add uppercase letters');

  if (/[0-9]/.test(password)) score++;
  else feedback.push('Add numbers');

  if (/[^a-zA-Z0-9]/.test(password)) score++;
  else feedback.push('Add special characters');

  return { score, feedback };
}

// ─── Token Helpers ───
export function generateAccessToken(payload: Omit<AuthTokenPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
}

export function generateRefreshToken(userId: string): string {
  return jwt.sign({ userId, type: 'refresh' }, JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
}

export async function verifyAccessToken(token: string): Promise<AuthTokenPayload | null> {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
    return payload;
  } catch {
    return null;
  }
}

export async function verifyRefreshToken(token: string): Promise<{ userId: string } | null> {
  try {
    const payload = jwt.verify(token, JWT_REFRESH_SECRET) as { userId: string; type: string };
    if (payload.type !== 'refresh') return null;
    return { userId: payload.userId };
  } catch {
    return null;
  }
}

// ─── Device Management ───
export async function registerDevice(
  userId: string,
  orgId: string,
  deviceInfo: DeviceInfo
): Promise<{ id: string; platform: string }> {
  const deviceId = generateId();

  await query(
    `INSERT INTO devices (id, user_id, organization_id, platform, app_version, fingerprint, status)
     VALUES ($1, $2, $3, $4, $5, $6, 'active')
     ON CONFLICT (id) DO UPDATE SET
       last_seen_at = NOW(),
       app_version = EXCLUDED.app_version,
       fingerprint = EXCLUDED.fingerprint`,
    [deviceId, userId, orgId, deviceInfo.platform, deviceInfo.appVersion, deviceInfo.fingerprint]
  );

  return { id: deviceId, platform: deviceInfo.platform };
}

export async function revokeDevice(deviceId: string): Promise<void> {
  await query(
    `UPDATE devices SET status = 'revoked', updated_at = NOW() WHERE id = $1`,
    [deviceId]
  );
}

export async function isDeviceTrusted(deviceId: string): Promise<boolean> {
  const result = await query<{ status: string }>(
    `SELECT status FROM devices WHERE id = $1`,
    [deviceId]
  );
  return result.rows[0]?.status === 'active';
}

// ─── Session Management ───
export async function createSession(
  userId: string,
  orgId: string,
  deviceInfo: DeviceInfo
): Promise<AuthResult> {
  // Get user details
  const userResult = await query<{ id: string; email: string; name: string }>(
    `SELECT id, email, name FROM users WHERE id = $1 AND deleted_at IS NULL`,
    [userId]
  );

  if (userResult.rowCount === 0) {
    throw new Error('User not found');
  }

  const user = userResult.rows[0];

  // Get user roles
  const roleResult = await query<{ role_codes: string[] }>(
    `SELECT role_codes FROM user_org_memberships 
     WHERE user_id = $1 AND organization_id = $2 AND is_active = true`,
    [userId, orgId]
  );

  const roles = roleResult.rows[0]?.role_codes || ['MEMBER'];

  // Get security level
  const securityResult = await query<{ security_level: number }>(
    `SELECT security_level FROM users WHERE id = $1`,
    [userId]
  );

  const securityLevel = securityResult.rows[0]?.security_level || 5;

  // Register device
  const device = await registerDevice(userId, orgId, deviceInfo);

  // Generate tokens
  const accessToken = generateAccessToken({
    id: userId,
    email: user.email,
    role: roles[0] || 'MEMBER',
    org_id: orgId,
    security_level: securityLevel,
  });

  const refreshToken = generateRefreshToken(userId);

  // Update last login
  await query(
    `UPDATE users SET last_login_at = NOW() WHERE id = $1`,
    [userId]
  );

  return {
    accessToken,
    refreshToken,
    user: {
      id: userId,
      email: user.email,
      name: user.name || '',
      roles,
      orgId,
    },
    device,
  };
}

export async function refreshSession(
  refreshToken: string,
  deviceInfo: DeviceInfo
): Promise<AuthResult> {
  const payload = await verifyRefreshToken(refreshToken);
  if (!payload) {
    throw new Error('Invalid refresh token');
  }

  // Get user's default organization
  const membershipResult = await query<{ organization_id: string }>(
    `SELECT organization_id FROM user_org_memberships 
     WHERE user_id = $1 AND is_active = true AND is_default = true
     LIMIT 1`,
    [payload.userId]
  );

  if (membershipResult.rowCount === 0) {
    throw new Error('No active organization found');
  }

  const orgId = membershipResult.rows[0].organization_id;

  return createSession(payload.userId, orgId, deviceInfo);
}

export async function revokeSession(userId: string, deviceId?: string): Promise<void> {
  if (deviceId) {
    await revokeDevice(deviceId);
  } else {
    // Revoke all devices for user
    await query(
      `UPDATE devices SET status = 'revoked', updated_at = NOW() WHERE user_id = $1`,
      [userId]
    );
  }
}

// ─── Login Flow ───
export async function login(
  email: string,
  password: string,
  deviceInfo: DeviceInfo,
  orgId?: string
): Promise<AuthResult> {
  // Get user
  const userResult = await query<{
    id: string;
    email: string;
    password_hash: string;
    status: string;
  }>(
    `SELECT id, email, password_hash, status FROM users 
     WHERE email = $1 AND deleted_at IS NULL`,
    [email]
  );

  if (userResult.rowCount === 0) {
    throw new Error('Invalid credentials');
  }

  const user = userResult.rows[0];

  if (user.status !== 'active') {
    throw new Error('Account is not active');
  }

  // Verify password
  const isValid = await verifyPassword(password, user.password_hash);
  if (!isValid) {
    throw new Error('Invalid credentials');
  }

  // Get organization
  if (!orgId) {
    const membershipResult = await query<{ organization_id: string }>(
      `SELECT organization_id FROM user_org_memberships 
       WHERE user_id = $1 AND is_active = true AND is_default = true
       LIMIT 1`,
      [user.id]
    );

    if (membershipResult.rowCount === 0) {
      throw new Error('No organization found');
    }

    orgId = membershipResult.rows[0].organization_id;
  }

  return createSession(user.id, orgId, deviceInfo);
}

// ─── Register Flow ───
export async function register(
  email: string,
  password: string,
  name: string,
  orgId: string,
  deviceInfo: DeviceInfo
): Promise<AuthResult> {
  // Check if user exists
  const existing = await query<{ id: string }>(
    `SELECT id FROM users WHERE email = $1 AND deleted_at IS NULL`,
    [email]
  );

  if (existing.rowCount > 0) {
    throw new Error('User already exists');
  }

  // Create user
  const userId = generateId();
  const passwordHash = await hashPassword(password);

  await query(
    `INSERT INTO users (id, email, password_hash, name, status, security_level)
     VALUES ($1, $2, $3, $4, 'active', 5)`,
    [userId, email, passwordHash, name]
  );

  // Add to organization
  await query(
    `INSERT INTO user_org_memberships (user_id, organization_id, role_codes, is_active, is_default)
     VALUES ($1, $2, ARRAY['MEMBER'], true, true)`,
    [userId, orgId]
  );

  return createSession(userId, orgId, deviceInfo);
}
