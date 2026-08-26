// Shared JWT Authentication Utility
import jwt from 'jsonwebtoken';
import { query } from './database.js';

const JWT_SECRET = process.env.JWT_SECRET;

function getTokenFromHeader(req) {
  const auth = req.headers.authorization || '';
  return auth.startsWith('Bearer ') ? auth.slice(7) : null;
}

export async function verifyToken(req) {
  if (!JWT_SECRET) return null;
  const token = getTokenFromHeader(req);
  if (!token) return null;

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (!payload || payload.type !== 'admin') return null;

    const userResult = await query(
      `SELECT id, email, name, role, status FROM users WHERE id = $1 AND deleted_at IS NULL`,
      [payload.id]
    );
    const user = userResult.rows[0];
    if (!user || user.status !== 'active') return null;

    return user;
  } catch {
    return null;
  }
}

export function requireAuth(handler) {
  return async (req, res) => {
    const user = await verifyToken(req);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    req.user = user;
    return handler(req, res);
  };
}
