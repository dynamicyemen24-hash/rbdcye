import { Lock, Mail, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useState } from "react";

import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login({ email, password });
    } catch {
      setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--brand-green)] to-[var(--brand-green-light)] p-4"
      style={{ direction: "rtl" }}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-[var(--brand-green-pale)] flex items-center justify-center mx-auto mb-4">
            <Lock className="w-10 h-10 text-[var(--brand-green)]" />
          </div>
          <h1
            className="text-[var(--foreground)] mb-2"
            style={{ fontSize: "1.5rem", fontWeight: 800 }}
          >
            دخول لوحة التحكم
          </h1>
          <p className="text-[var(--muted-foreground)]" style={{ fontSize: "0.9rem" }}>
            مؤسسة رحماء بينهم
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700" style={{ fontSize: "0.85rem" }}>
              {error}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="login-email"
              className="block text-[var(--foreground)] mb-2"
              style={{ fontSize: "0.85rem", fontWeight: 600 }}
            >
              البريد الإلكتروني
            </label>
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)]" />
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pr-10 pl-4 py-3 border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/30 focus:border-[var(--brand-green)]"
                style={{ fontSize: "0.9rem" }}
                placeholder="admin@rbdcye.org"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="block text-[var(--foreground)] mb-2"
              style={{ fontSize: "0.85rem", fontWeight: 600 }}
            >
              كلمة المرور
            </label>
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)]" />
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pr-10 pl-10 py-3 border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/30 focus:border-[var(--brand-green)]"
                style={{ fontSize: "0.9rem" }}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[var(--brand-green)] text-white rounded-xl hover:bg-[var(--brand-green-light)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{ fontSize: "0.9rem", fontWeight: 700 }}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                جاري التحقق...
              </>
            ) : (
              "تسجيل الدخول"
            )}
          </button>
        </form>

        {import.meta.env.DEV && (
          <div className="mt-6 p-4 bg-[var(--brand-gold-pale)] rounded-xl">
            <p
              className="text-[var(--brand-gold)]"
              style={{ fontSize: "0.75rem", fontWeight: 600 }}
            >
              بيانات تجريبية:
            </p>
            <p className="text-[var(--muted-foreground)] mt-1" style={{ fontSize: "0.75rem" }}>
              admin@rbdcye.org / admin123
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
