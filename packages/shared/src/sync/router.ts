// ============================================================
// @nexora/shared - Sync API Routes
// Express routes for sync endpoints
// ============================================================

import { Router, Request, Response } from 'express';
import { requireAuth, type AuthenticatedRequest } from '../middleware/index.js';
import { handleSyncPush, handleSyncPull } from './engine.js';
import { query } from '../database.js';

const router = Router();

// All sync routes require authentication
router.use(requireAuth());

// ─── POST /sync/push ───
router.post('/push', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { operations, lastCursor } = req.body;
    const deviceId = req.deviceId;

    if (!Array.isArray(operations) || operations.length === 0) {
      return res.status(400).json({ error: 'Operations array is required' });
    }

    if (operations.length > 100) {
      return res.status(400).json({ error: 'Maximum 100 operations per batch' });
    }

    const result = await handleSyncPush(
      req.organizationId!,
      operations,
      deviceId || 'unknown'
    );

    res.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Sync push failed';
    res.status(500).json({ error: message });
  }
});

// ─── POST /sync/pull ───
router.post('/pull', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { cursor, limit = 50, entityTypes } = req.body;
    const deviceId = req.deviceId;

    const result = await handleSyncPull(
      req.organizationId!,
      cursor,
      Math.min(limit, 100),
      entityTypes,
      deviceId
    );

    res.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Sync pull failed';
    res.status(500).json({ error: message });
  }
});

// ─── POST /sync/ack ───
router.post('/ack', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { cursor } = req.body;

    if (!cursor) {
      return res.status(400).json({ error: 'Cursor is required' });
    }

    // Update device last sync time
    if (req.deviceId) {
      await query(
        `UPDATE devices SET last_sync_at = NOW(), updated_at = NOW() 
         WHERE id = $1 AND user_id = $2`,
        [req.deviceId, req.user!.id]
      );
    }

    res.json({
      success: true,
      serverTimestamp: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Sync ack failed';
    res.status(500).json({ error: message });
  }
});

// ─── GET /sync/status ───
router.get('/status', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const deviceId = req.deviceId;

    // Get device sync status
    const deviceResult = await query<{
      last_sync_at: string;
      status: string;
    }>(
      `SELECT last_sync_at, status FROM devices 
       WHERE id = $1 AND user_id = $2`,
      [deviceId, req.user!.id]
    );

    const device = deviceResult.rows[0];

    // Get pending sync count
    const pendingResult = await query<{ count: string }>(
      `SELECT COUNT(*) as count FROM sync_queue 
       WHERE organization_id = $1 AND status = 'PENDING'`,
      [req.organizationId]
    );

    res.json({
      lastSync: device?.last_sync_at || null,
      deviceStatus: device?.status || 'unknown',
      pendingChanges: parseInt(pendingResult.rows[0]?.count || '0'),
      serverTimestamp: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to get sync status';
    res.status(500).json({ error: message });
  }
});

export default router;
