// ============================================================
// PostgreSQL Client — Routes through Admin API
// All queries go through /api/admin for security
// ============================================================

const API_BASE = '/api';

async function apiQuery<T = any>(action: string, options?: { method?: string; body?: any; params?: Record<string, string> }): Promise<{ rows: T[]; rowCount: number }> {
  const { method = 'GET', body, params } = options || {};
  const qs = params ? '?' + new URLSearchParams(params).toString() : '';

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('rbdcye_admin_token');
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE}/admin?action=${action}${qs}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();
  if (!data.success) throw new Error(data.error || 'API error');

  return { rows: data.data || [], rowCount: data.total || (data.data?.length ?? 0) };
}

// ─── Messages (contact_messages) ───
export const messagesQueries = {
  getStats: async () => {
    const result = await apiQuery('contacts', { params: { limit: '1000' } });
    const rows = result.rows;
    return {
      rows: [{
        total: result.rowCount,
        new: rows.filter((r: any) => r.status === 'new').length,
        read: rows.filter((r: any) => r.status === 'read').length,
        replied: rows.filter((r: any) => r.status === 'replied').length,
        archived: rows.filter((r: any) => r.status === 'archived').length,
      }]
    };
  },
  findAll: async (limit = 50, offset = 0) => {
    return apiQuery('contacts', { params: { limit: String(limit), offset: String(offset) } });
  },
  updateStatus: async (id: string, status: string) => {
    const response = await fetch(`${API_BASE}/admin?action=contacts&id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('rbdcye_admin_token') || ''}`,
      },
      body: JSON.stringify({ status }),
    });
    return response.json();
  },
};

// ─── Donations ───
export const donationsQueries = {
  getStats: async () => {
    const result = await apiQuery('donations', { params: { limit: '1000' } });
    const rows = result.rows;
    const totalAmount = rows.reduce((sum: number, r: any) => sum + (Number(r.amount) || 0), 0);
    return {
      rows: [{
        total: result.rowCount,
        amount: totalAmount,
        pending: rows.filter((r: any) => r.status === 'pending').length,
        completed: rows.filter((r: any) => r.status === 'completed').length,
      }]
    };
  },
  findAll: async (limit = 50, offset = 0) => {
    return apiQuery('donations', { params: { limit: String(limit), offset: String(offset) } });
  },
  updateStatus: async (id: string, status: string) => {
    const response = await fetch(`${API_BASE}/admin?action=donations&id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('rbdcye_admin_token') || ''}`,
      },
      body: JSON.stringify({ status }),
    });
    return response.json();
  },
};

// ─── Volunteers ───
export const volunteersQueries = {
  getStats: async () => {
    const result = await apiQuery('volunteers', { params: { limit: '1000' } });
    const rows = result.rows;
    return {
      rows: [{
        total: result.rowCount,
        active: rows.filter((r: any) => r.status === 'active').length,
        pending: rows.filter((r: any) => r.status === 'pending').length,
      }]
    };
  },
  findAll: async (limit = 50, offset = 0) => {
    return apiQuery('volunteers', { params: { limit: String(limit), offset: String(offset) } });
  },
  updateStatus: async (id: string, status: string) => {
    const response = await fetch(`${API_BASE}/admin?action=volunteers&id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('rbdcye_admin_token') || ''}`,
      },
      body: JSON.stringify({ status }),
    });
    return response.json();
  },
};

// ─── Projects ───
export const projectsQueries = {
  findAll: async () => {
    return apiQuery('projects');
  },
};

// ─── Notifications ───
export const notificationsQueries = {
  findAll: async (limit = 20) => {
    return apiQuery('notifications', { params: { limit: String(limit) } });
  },
  markAsRead: async (id: string) => {
    const response = await fetch(`${API_BASE}/admin?action=notifications`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('rbdcye_admin_token') || ''}`,
      },
      body: JSON.stringify({ ids: [id] }),
    });
    return response.json();
  },
  markAllAsRead: async () => {
    const response = await fetch(`${API_BASE}/admin?action=notifications`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('rbdcye_admin_token') || ''}`,
      },
      body: JSON.stringify({}),
    });
    return response.json();
  },
};

// ─── Generic query wrapper (for backward compatibility) ───
export async function query(text: string, params?: any[]) {
  console.warn('[postgres.ts] Direct SQL queries are deprecated. Use apiQuery() instead.');
  return { rows: [], rowCount: 0 };
}
