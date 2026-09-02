/**
 * Token Management Utilities
 * Handles JWT token creation, validation, and refresh
 */

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  permissions: Array<{ resource: string; actions: string[] }>;
  iat: number;
  exp: number;
}

export class TokenManager {
  private static readonly TOKEN_KEY = "auth_token";
  private static readonly REFRESH_TOKEN_KEY = "refresh_token";
  private static readonly EXPIRY_BUFFER = 5 * 60 * 1000; // 5 minutes

  static generateMockToken(userId: string, email: string, role: string): string {
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = btoa(
      JSON.stringify({
        userId,
        email,
        role,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
      })
    );
    const signature = btoa("mock_signature_" + Date.now());
    return `${header}.${payload}.${signature}`;
  }

  static setTokens(accessToken: string, refreshToken?: string): void {
    localStorage.setItem(this.TOKEN_KEY, accessToken);
    if (refreshToken) {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    }
  }

  static getAccessToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  static clearTokens(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  static isTokenExpired(token: string): boolean {
    try {
      const payload = this.parseToken(token);
      const expiryTime = payload.exp * 1000;
      return Date.now() >= expiryTime - this.EXPIRY_BUFFER;
    } catch {
      return true;
    }
  }

  static parseToken(token: string): TokenPayload {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) throw new Error("Invalid token format");
      const payload = JSON.parse(atob(parts[1]));
      return payload as TokenPayload;
    } catch {
      throw new Error("Failed to parse token");
    }
  }

  static shouldRefreshToken(token: string): boolean {
    try {
      const payload = this.parseToken(token);
      const expiryTime = payload.exp * 1000;
      const refreshThreshold = Date.now() + 15 * 60 * 1000;
      return refreshThreshold >= expiryTime;
    } catch {
      return true;
    }
  }

  static getTokenExpiryIn(token: string): number {
    try {
      const payload = this.parseToken(token);
      const remainingSeconds = payload.exp - Math.floor(Date.now() / 1000);
      return Math.max(0, remainingSeconds);
    } catch {
      return 0;
    }
  }
}
