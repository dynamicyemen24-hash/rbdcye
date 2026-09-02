import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';

import { authService } from '../services/auth.service';

import type { User, AuthState, LoginCredentials } from '../types/auth';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (resource: string, action: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    token: null,
  });

  // Token expiry + auto-refresh (WCAG/TECHNICAL_DEBT_AND_GAPS.md Phase 1)
  const isTokenExpired = useCallback((token: string | null): boolean => {
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (!payload.exp) return false;
      return payload.exp * 1000 < Date.now();
    } catch { return true; }
  }, []);

  const refreshIfNeeded = useCallback(async () => {
    const token = localStorage.getItem('auth_token');
    const refreshToken = localStorage.getItem('auth_refresh_token');
    if (!token || !refreshToken) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiresIn = payload.exp * 1000 - Date.now();
      if (expiresIn < 5 * 60 * 1000) {
        const res = await fetch('/api/auth/refresh', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ refreshToken }) });
        if (res.ok) { const data = await res.json(); if (data.token) { localStorage.setItem('auth_token', data.token); return data.token; } }
        await authService.logout(); return null;
      }
      return token;
    } catch { return token; }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      let token = localStorage.getItem('auth_token');
      if (isTokenExpired(token)) {
        token = await refreshIfNeeded();
        if (!token) { setState({ user: null, isAuthenticated: false, isLoading: false, token: null }); return; }
      }
      const user = await authService.checkAuth();
      setState({ user, isAuthenticated: !!user, isLoading: false, token });
    };
    initAuth();
    const interval = window.setInterval(() => { const t = localStorage.getItem('auth_token'); if (isTokenExpired(t)) refreshIfNeeded(); }, 60_000);
    return () => clearInterval(interval);
  }, [isTokenExpired, refreshIfNeeded]);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const { user, token } = await authService.login(credentials);
    setState({
      user,
      isAuthenticated: true,
      isLoading: false,
      token,
    });
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      token: null,
    });
  }, []);

  const hasPermission = useCallback(
    (resource: string, action: string): boolean => {
      if (!state.user) return false;
      if (state.user.role === 'ADMIN') return true;
      return state.user.permissions.some(
        (p: any) => p.resource === resource && p.actions.includes(action as any)
      );
    },
    [state.user]
  );

  const value = useMemo(
    () => ({ ...state, login, logout, hasPermission }),
    [state, login, logout, hasPermission]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}


