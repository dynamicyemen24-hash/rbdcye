import { API_BASE_URL } from "@/shared/constants/api";

import type { LoginCredentials, User } from "../types/auth";

const API_URL = `${API_BASE_URL.replace(/\/$/, "")}/auth`;

export const authApi = {
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "فشل تسجيل الدخول");
    }

    return response.json();
  },

  async logout(): Promise<void> {
    await fetch(`${API_URL}/logout`, {
      method: "POST",
      credentials: "include",
    });
  },

  async refreshToken(): Promise<string> {
    const response = await fetch(`${API_URL}/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("فشل تحديث الجلسة");
    }

    const data = await response.json();
    return data.token;
  },
};
