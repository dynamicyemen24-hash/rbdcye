// ============================================================
// @nexora/shared - Express Auth Middleware
// Unified JWT authentication for NexoraOS API
// ============================================================

import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../auth/index.js';
import type { AuthTokenPayload } from '../auth/service.js';
import { query } from '../database.js';

export interface AuthenticatedRequest extends Request {
  user?: AuthTokenPayload;
  organizationId?: string;
  deviceId?: string;
  requestId?: string;
}

export function requireAuth(options: { required?: boolean } = {}) {
  const { required = true } = options;

  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        if (required) {
          return res.status(401).json({ error: 'Authorization token required' });
        }
        return next();
      }

      const token = authHeader.slice(7);
      const payload = await verifyAccessToken(token);

      if (!payload) {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }

      req.user = payload;
      req.organizationId = payload.org_id;
      req.deviceId = req.headers['x-device-id'] as string;
      req.requestId = req.headers['x-request-id'] as string;

      next();
    } catch (error) {
      console.error('[Auth] Middleware error:', error);
      return res.status(500).json({ error: 'Authentication failed' });
    }
  };
}

export function requireRole(...roles: string[]) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const userRole = req.user.role;
    const hasRole = roles.includes(userRole);

    if (!hasRole) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        required: roles,
        current: userRole,
      });
    }

    next();
  };
}

export function requirePermission(...permissions: string[]) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const result = await query<{ permissions: string[] }>(
      `SELECT permissions FROM user_org_memberships 
       WHERE user_id = $1 AND organization_id = $2 AND is_active = true`,
      [req.user.id, req.user.org_id]
    );

    const userPermissions = result.rows[0]?.permissions || [];
    const hasPermission = permissions.every(p => userPermissions.includes(p));

    if (!hasPermission) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        required: permissions,
      });
    }

    next();
  };
}

export function requireTenant() {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user?.org_id) {
      return res.status(403).json({ error: 'Organization context required' });
    }

    const result = await query<{ id: string; status: string }>(
      `SELECT id, status FROM organizations 
       WHERE id = $1 AND deleted_at IS NULL`,
      [req.user.org_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    if (result.rows[0].status !== 'active') {
      return res.status(403).json({ error: 'Organization is not active' });
    }

    next();
  };
}
