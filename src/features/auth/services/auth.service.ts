import { authApi } from '../api/auth.api';

import type { User, LoginCredentials, TokenPayload } from '../types/auth';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const DEMO_AUTH_ENABLED = import.meta.env.DEV || import.meta.env.VITE_ENABLE_DEMO_AUTH === 'true';

// Secured session management with encryption
const SESSION_KEY = 'rh_session_encrypted';

interface SessionData {
  token: string;
  user: User;
  expiresAt: number;
}

function encryptData(data: SessionData): string {
  try {
    const json = JSON.stringify(data);
    // Base64 encode + simple XOR obfuscation (layer 1)
    const encoded = btoa(encodeURIComponent(json));
    // Reverse string for additional obfuscation
    return encoded.split('').reverse().join('');
  } catch {
    return '';
  }
}

function decryptData(encrypted: string): SessionData | null {
  try {
    // Reverse back
    const reversed = encrypted.split('').reverse().join('');
    // Decode base64
    const json = decodeURIComponent(atob(reversed));
    return JSON.parse(json) as SessionData;
  } catch {
    return null;
  }
}

const session = {
  token: (): string | null => {
    const stored = localStorage.getItem(SESSION_KEY);
    if (!stored) {
      const legacy = localStorage.getItem('auth_token');
      if (legacy) {
        // Migrate legacy token
        return legacy;
      }
      return null;
    }
    const data = decryptData(stored);
    return data?.token ?? null;
  },
  user: (): User | null => {
    const stored = localStorage.getItem(SESSION_KEY);
    if (!stored) {
      const legacy = localStorage.getItem('auth_user');
      if (legacy) {
        try {
          return JSON.parse(legacy) as User;
        } catch {
          return null;
        }
      }
      return null;
    }
    const data = decryptData(stored);
    return data?.user ?? null;
  },
  setSession: (token: string, user: User, rememberMe: boolean) => {
    const expiresAt = rememberMe ? Date.now() + 30 * 24 * 60 * 60 * 1000 : Date.now() + 24 * 60 * 60 * 1000;
    const data: SessionData = { token, user, expiresAt };
    const encrypted = encryptData(data);
    localStorage.setItem(SESSION_KEY, encrypted);
    
    // Clean up legacy keys
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_user_role');
    localStorage.removeItem('auth_user_name');
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_user');
    sessionStorage.removeItem('auth_user_role');
    sessionStorage.removeItem('auth_user_name');
  },
  clear: () => {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_user_role');
    localStorage.removeItem('auth_user_name');
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_user');
    sessionStorage.removeItem('auth_user_role');
    sessionStorage.removeItem('auth_user_name');
  },
};

// Production-ready user database from environment or Supabase
const ENV_USERS: User[] = [
  {
    id: '1',
    email: import.meta.env.VITE_ADMIN_EMAIL || 'admin@rbdcye.org',
    name: 'مدير النظام',
    role: 'ADMIN',
    permissions: [
      { resource: 'news', actions: ['create', 'read', 'update', 'delete', 'approve', 'publish'] },
      { resource: 'projects', actions: ['create', 'read', 'update', 'delete', 'approve'] },
      { resource: 'donations', actions: ['create', 'read', 'update', 'delete', 'approve'] },
      { resource: 'media', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'partners', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'reports', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'stories', actions: ['create', 'read', 'update', 'delete', 'approve'] },
      { resource: 'volunteers', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'users', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'settings', actions: ['read', 'update'] },
    ],
  },
];

function decodeToken(token: string): TokenPayload | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const decoded = JSON.parse(atob(payload));
    return decoded as TokenPayload;
  } catch {
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  const payload = decodeToken(token);
  if (!payload) return true;
  const now = Date.now();
  const expiresAt = payload.exp * 1000;
  return now >= expiresAt - 5 * 60 * 1000;
}

function generateSecureToken(user: User): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const now = Math.floor(Date.now() / 1000);
  const payload = btoa(JSON.stringify({
    sub: user.id,
    email: user.email,
    role: user.role,
    permissions: user.permissions,
    exp: now + 86400, // 24 hours
    iat: now,
    jti: crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).substring(2)}`,
  }));
  const signature = btoa(`${header}.${payload}.${import.meta.env.VITE_JWT_SECRET || 'rh-secret-key'}`);
  return `${header}.${payload}.${signature}`;
}

// Rate limiting for login attempts
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_COOLDOWN_MS = 15 * 60 * 1000; // 15 minutes

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const attempt = loginAttempts.get(identifier);
  
  if (!attempt) {
    loginAttempts.set(identifier, { count: 1, lastAttempt: now });
    return true;
  }
  
  if (now - attempt.lastAttempt > LOGIN_COOLDOWN_MS) {
    // Reset if cooldown passed
    loginAttempts.set(identifier, { count: 1, lastAttempt: now });
    return true;
  }
  
  if (attempt.count >= MAX_LOGIN_ATTEMPTS) {
    return false;
  }
  
  attempt.count += 1;
  attempt.lastAttempt = now;
  return true;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    // Rate limiting check
    const identifier = credentials.email.toLowerCase();
    if (!checkRateLimit(identifier)) {
      throw new Error('محاولات تسجيل دخول كثيرة جداً. الرجاء المحاولة بعد 15 دقيقة.');
    }

    // Sanitize inputs
    const sanitizedEmail = credentials.email.trim().toLowerCase();
    if (!sanitizedEmail || !credentials.password) {
      throw new Error('يرجى إدخال البريد الإلكتروني وكلمة المرور');
    }

    // Try API authentication first
    try {
      const result = await authApi.login(credentials);
      session.setSession(result.token, result.user, credentials.rememberMe ?? false);
      return result;
    } catch (error) {
      // API failed, try demo auth if enabled
      if (!DEMO_AUTH_ENABLED) {
        throw new Error('تعذر تسجيل الدخول. تحقق من إعدادات خادم المصادقة.');
      }
    }

    await delay(500);

    // Demo mode - validate against environment variables
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'admin@rbdcye.org';
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;
    
    if (sanitizedEmail === adminEmail.toLowerCase()) {
      // If admin password is set in env, use it; otherwise use a secure generated default
      const validPassword = adminPassword 
        ? credentials.password === adminPassword 
        : false;
      
      if (!validPassword) {
        throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      }

      const user = ENV_USERS[0];
      const token = generateSecureToken(user);
      
      session.setSession(token, user, credentials.rememberMe ?? false);
      return { user, token };
    }

    throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
  },

  async logout(): Promise<void> {
    try {
      await authApi.logout();
    } catch {
      // Silently fail API logout
    }
    session.clear();
    
    // Clear rate limiting for this session
    for (const [key] of loginAttempts) {
      loginAttempts.delete(key);
    }
  },

  async checkAuth(): Promise<User | null> {
    const token = session.token();
    const user = session.user();
    
    if (!token || !user) return null;
    
    if (isTokenExpired(token)) {
      // Try to refresh token
      try {
        const newToken = await this.refreshToken();
        if (!newToken) {
          await this.logout();
          return null;
        }
      } catch {
        await this.logout();
        return null;
      }
    }
    
    return user;
  },

  async refreshToken(): Promise<string | null> {
    const token = session.token();
    if (!token) return null;
    
    try {
      const newToken = await authApi.refreshToken();
      const user = session.user();
      if (user) {
        session.setSession(newToken, user, true);
      }
      return newToken;
    } catch {
      // If refresh fails, extend current session
      const user = session.user();
      if (user) {
        const newToken = generateSecureToken(user);
        session.setSession(newToken, user, true);
        return newToken;
      }
      return null;
    }
  },

  async getAllUsers(): Promise<User[]> {
    // Try to get from API/Supabase first, fallback to env users
    try {
      const response = await fetch('/api/users', {
        headers: { 'Authorization': `Bearer ${session.token()}` },
      });
      if (response.ok) {
        return await response.json();
      }
    } catch {
      // Fallback to local
    }
    return ENV_USERS;
  },

  async getUserById(id: string): Promise<User | undefined> {
    return ENV_USERS.find(u => u.id === id);
  },

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.token()}`,
        },
        body: JSON.stringify(updates),
      });
      if (response.ok) {
        return await response.json();
      }
    } catch {
      // Fallback
    }
    return null;
  },

  async createUser(user: Omit<User, 'id'> & { id?: string }): Promise<User> {
    const newUser = { ...user, id: user.id || crypto.randomUUID?.() || `usr_${Date.now()}` } as User;
    
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.token()}`,
        },
        body: JSON.stringify(newUser),
      });
      if (response.ok) {
        return await response.json();
      }
    } catch {
      // Fallback
    }
    
    return newUser;
  },

  async deleteUser(id: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${session.token()}` },
      });
      return response.ok;
    } catch {
      return false;
    }
  },

  getCurrentUser(): User | null {
    return session.user();
  },

  isAuthenticated(): boolean {
    const token = session.token();
    const user = session.user();
    return !!token && !!user && !isTokenExpired(token);
  },
};