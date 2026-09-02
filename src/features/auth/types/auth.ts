export interface User {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "EDITOR" | "MANAGER" | "VIEWER";
  permissions: Permission[];
  avatar?: string;
  createdAt?: string;
}

export interface Permission {
  resource: string;
  actions: string[];
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
}

export interface TokenPayload {
  sub: string;
  email: string;
  role: string;
  permissions: Permission[];
  exp: number;
  iat: number;
}
