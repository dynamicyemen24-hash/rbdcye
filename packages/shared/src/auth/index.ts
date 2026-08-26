// ============================================================
// @nexora/shared - Authentication Module
// JWT + Device Management + Session Handling
// ============================================================

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import type { AuthTokenPayload, AuthResult, User, Device } from '../types/index.js';

// Re-export service functions (these override some local functions below)
export {
  login,
  register,
  refreshSession,
  revokeSession,
  registerDevice,
  revokeDevice,
} from './service.js';

export { default as authRouter } from './router.js';

export type { DeviceInfo } from './service.js';

// ─── Config ───
const JWT_SECRET = process.env.JWT_SECRET || '';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || '';
const JWT_ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES || '8h';
const JWT_REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES || '7d';
const BCRYPT_ROUNDS = 12;

if (!JWT_SECRET || JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be at least 32 characters');
}

// ─── Password Hashing ───
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ─── Token Generation ───
export function generateAccessToken(user: User, orgId: string): string {
  const payload: Omit<AuthTokenPayload, 'iat' | 'exp'> = {
    id: user.id,
    email: user.email,
    role: 'user',
    org_id: orgId,
    security_level: user.securityLevel,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_ACCESS_EXPIRES });
}

export function generateRefreshToken(userId: string): string {
  return jwt.sign({ userId, type: 'refresh' }, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES });
}

export function generateDeviceToken(): string {
  return randomBytes(32).toString('hex');
}

// ─── Token Verification ───
export function verifyAccessToken(token: string): AuthTokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): { userId: string } | null {
  try {
    const payload = jwt.verify(token, JWT_REFRESH_SECRET) as { userId: string; type: string };
    if (payload.type !== 'refresh') return null;
    return { userId: payload.userId };
  } catch {
    return null;
  }
}

// ─── Token Rotation ───
export function rotateTokens(accessToken: string): { accessToken: string; refreshToken: string } | null {
  const payload = verifyAccessToken(accessToken);
  if (!payload) return null;

  // Generate new tokens
  const newAccessToken = jwt.sign(
    { id: payload.id, email: payload.email, role: payload.role, org_id: payload.org_id, security_level: payload.security_level },
    JWT_SECRET,
    { expiresIn: JWT_ACCESS_EXPIRES }
  );
  const newRefreshToken = generateRefreshToken(payload.id);

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}

// ─── Device Management ───
export function generateDeviceFingerprint(userAgent: string, platform: string): string {
  const data = `${userAgent}:${platform}:${Date.now()}`;
  return randomBytes(16).toString('hex');
}

export function isDeviceTrusted(device: Device): boolean {
  return device.status === 'active' && device.lastSeen > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
}

// ─── Session Management ───
export interface Session {
  id: string;
  userId: string;
  deviceId: string;
  organizationId: string;
  createdAt: Date;
  expiresAt: Date;
  lastActivity: Date;
  ipAddress: string;
  userAgent: string;
}

export function createSession(userId: string, deviceId: string, orgId: string, ip: string, ua: string): Session {
  const now = new Date();
  return {
    id: randomBytes(16).toString('hex'),
    userId,
    deviceId,
    organizationId: orgId,
    createdAt: now,
    expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
    lastActivity: now,
    ipAddress: ip,
    userAgent: ua,
  };
}

export function isSessionValid(session: Session): boolean {
  return session.expiresAt > new Date();
}

// ─── Password Policy ───
export interface PasswordStrength {
  score: number;
  feedback: string[];
}

export function checkPasswordStrength(password: string): PasswordStrength {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) score++;
  else feedback.push('Password must be at least 8 characters');

  if (password.length >= 12) score++;

  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  else feedback.push('Include both uppercase and lowercase letters');

  if (/\d/.test(password)) score++;
  else feedback.push('Include at least one number');

  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
  else feedback.push('Include at least one special character');

  return { score, feedback };
}
