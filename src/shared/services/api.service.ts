// ============================================================
// API Service — Frontend client for backend endpoints
// Replaces all mock/seed data with real API calls
// ============================================================

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

interface RequestOptions {
  method?: string;
  body?: Record<string, unknown>;
  headers?: Record<string, string>;
}

interface ApiResponse<T = Record<string, unknown>> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  token?: string;
  user?: { id: string; email: string; name: string; role: string };
  total?: number;
  donation?: Record<string, unknown>;
  volunteer?: Record<string, unknown>;
  project?: Record<string, unknown>;
  deleted?: Record<string, unknown>;
}

async function apiRequest<T = Record<string, unknown>>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
  const { method = 'GET', body, headers: extraHeaders } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...extraHeaders,
  };

  const token = localStorage.getItem('rbdcye_admin_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = { method, headers };
  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }

  const url = `${API_BASE}/${endpoint}`;

  try {
    const response = await fetch(url, config);
    const data = await response.json() as ApiResponse<T>;

    if (!response.ok) {
      throw new Error(data.error || data.message || `HTTP ${response.status}`);
    }

    return data;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    if (message === 'Failed to fetch' || message.includes('fetch')) {
      throw new Error('تعذر الاتصال بالخادم');
    }
    throw error;
  }
}

// ═══════════════════════════════════════════════════════════════
// PUBLIC API (No auth required)
// ═══════════════════════════════════════════════════════════════

export const donationsApi = {
  create: (data: Record<string, unknown>) => apiRequest('donations', { method: 'POST', body: data }),
};

export const contactApi = {
  send: (data: Record<string, unknown>) => apiRequest('contact', { method: 'POST', body: data }),
};

export const volunteersApi = {
  register: (data: Record<string, unknown>) => apiRequest('volunteers', { method: 'POST', body: data }),
};

export const subscribersApi = {
  subscribe: (data: Record<string, unknown>) => apiRequest('subscribers', { method: 'POST', body: data }),
};

export const erpApi = {
  getCounters: () => apiRequest('erp?action=counters'),
  getProjects: () => apiRequest('erp?action=projects'),
  getDonationsTotal: () => apiRequest('erp?action=donations-total'),
  getBeneficiariesStats: () => apiRequest('erp?action=beneficiaries'),
  getPartners: () => apiRequest('erp?action=partners'),
  createDonation: (data: Record<string, unknown>) => apiRequest('erp?action=create-donation', { method: 'POST', body: data }),
  registerVolunteer: (data: Record<string, unknown>) => apiRequest('erp?action=register-volunteer', { method: 'POST', body: data }),
  partnershipRequest: (data: Record<string, unknown>) => apiRequest('erp?action=partnership', { method: 'POST', body: data }),
};

// ═══════════════════════════════════════════════════════════════
// ADMIN API (Auth required)
// ═══════════════════════════════════════════════════════════════

export const adminAuth = {
  login: (email: string, password: string) =>
    apiRequest('admin?action=login', { method: 'POST', body: { email, password } }),
  logout: () => {
    localStorage.removeItem('rbdcye_admin_token');
    localStorage.removeItem('rbdcye_admin_user');
  },
  getUser: (): { id: string; email: string; name: string; role: string } | null => {
    try { return JSON.parse(localStorage.getItem('rbdcye_admin_user') || 'null') as { id: string; email: string; name: string; role: string }; }
    catch { return null; }
  },
  setAuth: (token: string, user: { id: string; email: string; name: string; role: string }) => {
    localStorage.setItem('rbdcye_admin_token', token);
    localStorage.setItem('rbdcye_admin_user', JSON.stringify(user));
  },
  isAuthenticated: () => !!localStorage.getItem('rbdcye_admin_token'),
};

export const adminDashboard = {
  getStats: () => apiRequest('admin?action=dashboard'),
};

export const adminDonations = {
  list: (params: Record<string, string> = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiRequest(`admin?action=donations&${qs}`);
  },
  updateStatus: (id: string, status: string, notes?: string) =>
    apiRequest(`admin?action=donations&id=${id}`, { method: 'PUT', body: { status, notes } }),
};

export const adminContacts = {
  list: (params: Record<string, string> = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiRequest(`admin?action=contacts&${qs}`);
  },
  updateStatus: (id: string, status: string) =>
    apiRequest(`admin?action=contacts&id=${id}`, { method: 'PUT', body: { status } }),
};

export const adminVolunteers = {
  list: (params: Record<string, string> = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiRequest(`admin?action=volunteers&${qs}`);
  },
  updateStatus: (id: string, status: string) =>
    apiRequest(`admin?action=volunteers&id=${id}`, { method: 'PUT', body: { status } }),
};

export const adminProjects = {
  list: () => apiRequest('admin?action=projects'),
  create: (data: Record<string, unknown>) => apiRequest('admin?action=projects', { method: 'POST', body: data }),
  update: (id: string, data: Record<string, unknown>) =>
    apiRequest(`admin?action=projects&id=${id}`, { method: 'PUT', body: data }),
  delete: (id: string) => apiRequest(`admin?action=projects&id=${id}`, { method: 'DELETE' }),
};

export const adminNotifications = {
  list: (params: Record<string, string> = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiRequest(`admin?action=notifications&${qs}`);
  },
  markRead: (ids?: string[]) => apiRequest('admin?action=notifications', { method: 'PUT', body: { ids } }),
};

export default apiRequest;
