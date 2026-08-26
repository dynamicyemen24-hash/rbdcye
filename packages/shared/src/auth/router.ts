// ============================================================
// @nexora/shared - Auth API Routes
// Express routes for authentication endpoints
// ============================================================

import { Router, Request, Response } from 'express';
import { login, register, refreshSession, revokeSession } from '../auth/service.js';
import { requireAuth, type AuthenticatedRequest } from '../middleware/index.js';
import { query } from '../database.js';
import { checkPasswordStrength } from '../auth/index.js';

const router = Router();

// ─── POST /auth/login ───
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password, deviceInfo, orgId } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (!deviceInfo?.platform || !deviceInfo?.appVersion || !deviceInfo?.fingerprint) {
      return res.status(400).json({ error: 'Device information is required' });
    }

    const result = await login(email, password, deviceInfo, orgId);
    res.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login failed';
    res.status(401).json({ error: message });
  }
});

// ─── POST /auth/register ───
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name, orgId, deviceInfo } = req.body;

    if (!email || !password || !name || !orgId) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const strength = checkPasswordStrength(password);
    if (strength.score < 3) {
      return res.status(400).json({
        error: 'Password is too weak',
        feedback: strength.feedback,
      });
    }

    if (!deviceInfo?.platform || !deviceInfo?.appVersion || !deviceInfo?.fingerprint) {
      return res.status(400).json({ error: 'Device information is required' });
    }

    const result = await register(email, password, name, orgId, deviceInfo);
    res.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Registration failed';
    res.status(400).json({ error: message });
  }
});

// ─── POST /auth/refresh ───
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const { refreshToken, deviceInfo } = req.body;

    if (!refreshToken || !deviceInfo) {
      return res.status(400).json({ error: 'Refresh token and device info required' });
    }

    const result = await refreshSession(refreshToken, deviceInfo);
    res.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Token refresh failed';
    res.status(401).json({ error: message });
  }
});

// ─── POST /auth/logout ───
router.post('/logout', requireAuth(), async (req: AuthenticatedRequest, res: Response) => {
  try {
    await revokeSession(req.user!.id, req.deviceId);
    res.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Logout failed';
    res.status(500).json({ error: message });
  }
});

// ─── GET /auth/me ───
router.get('/me', requireAuth(), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await query<{
      id: string;
      email: string;
      name: string;
      phone: string;
      image_url: string;
      status: string;
    }>(
      `SELECT id, email, name, phone, image_url, status 
       FROM users WHERE id = $1 AND deleted_at IS NULL`,
      [req.user!.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    // Get organization membership
    const membershipResult = await query<{
      organization_id: string;
      role_codes: string[];
      permissions: string[];
    }>(
      `SELECT organization_id, role_codes, permissions 
       FROM user_org_memberships 
       WHERE user_id = $1 AND is_active = true AND organization_id = $2`,
      [req.user!.id, req.user!.org_id]
    );

    const membership = membershipResult.rows[0];

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        imageUrl: user.image_url,
        status: user.status,
      },
      organization: {
        id: membership?.organization_id,
        roles: membership?.role_codes || [],
        permissions: membership?.permissions || [],
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to get user info';
    res.status(500).json({ error: message });
  }
});

// ─── GET /auth/devices ───
router.get('/devices', requireAuth(), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await query<{
      id: string;
      platform: string;
      app_version: string;
      last_seen_at: string;
      status: string;
    }>(
      `SELECT id, platform, app_version, last_seen_at, status 
       FROM devices 
       WHERE user_id = $1 
       ORDER BY last_seen_at DESC`,
      [req.user!.id]
    );

    res.json({ devices: result.rows });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to get devices';
    res.status(500).json({ error: message });
  }
});

// ─── DELETE /auth/devices/:deviceId ───
router.delete('/devices/:deviceId', requireAuth(), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { deviceId } = req.params;

    // Verify device belongs to user
    const result = await query(
      `UPDATE devices SET status = 'revoked', updated_at = NOW() 
       WHERE id = $1 AND user_id = $2`,
      [deviceId, req.user!.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Device not found' });
    }

    res.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to revoke device';
    res.status(500).json({ error: message });
  }
});

// ─── POST /auth/change-password ───
router.post('/change-password', requireAuth(), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password are required' });
    }

    const strength = checkPasswordStrength(newPassword);
    if (strength.score < 3) {
      return res.status(400).json({
        error: 'New password is too weak',
        feedback: strength.feedback,
      });
    }

    // Get current password hash
    const result = await query<{ password_hash: string }>(
      `SELECT password_hash FROM users WHERE id = $1`,
      [req.user!.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const bcrypt = await import('bcryptjs');
    const isValid = await bcrypt.compare(currentPassword, result.rows[0].password_hash);

    if (!isValid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Update password
    const newHash = await bcrypt.hash(newPassword, 12);
    await query(
      `UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2`,
      [newHash, req.user!.id]
    );

    // Revoke all other sessions
    await revokeSession(req.user!.id);

    res.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to change password';
    res.status(500).json({ error: message });
  }
});

export default router;
