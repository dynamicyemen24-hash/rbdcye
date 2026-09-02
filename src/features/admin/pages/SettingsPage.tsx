import { FormEvent, useEffect, useState } from "react";

import { authService } from "@/features/auth/services/auth.service";

type SiteSettings = {
  siteName: string;
  tagline: string;
  email: string;
  phone: string;
};

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: "رحماء بينهم",
  tagline: "أثرٌ يدوم - مستقبلٌ يُبنى",
  email: "info@rbdcye.org",
  phone: "+967 780 777 007",
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const loadSettings = async () => {
      try {
        const response = await fetch("/api/admin?action=settings", {
          headers: { Authorization: `Bearer ${authService.getToken() ?? ""}` },
        });
        const payload = await response.json();
        if (!response.ok || !payload.success)
          throw new Error(payload.error || "تعذر تحميل الإعدادات");
        if (!cancelled) setSettings({ ...DEFAULT_SETTINGS, ...payload.data });
      } catch (loadError) {
        if (!cancelled)
          setError(loadError instanceof Error ? loadError.message : "تعذر تحميل الإعدادات");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void loadSettings();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      const response = await fetch("/api/admin?action=settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authService.getToken() ?? ""}`,
        },
        body: JSON.stringify(settings),
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) throw new Error(payload.error || "تعذر حفظ الإعدادات");
      setSettings({ ...DEFAULT_SETTINGS, ...payload.data });
      setSaved(true);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "تعذر حفظ الإعدادات");
    } finally {
      setSaving(false);
    }
  };

  const update = (key: keyof SiteSettings, value: string) =>
    setSettings((current) => ({ ...current, [key]: value }));

  if (loading)
    return (
      <div className="rounded-xl bg-white p-8 text-center text-gray-600">جارٍ تحميل الإعدادات…</div>
    );

  return (
    <form className="space-y-6" onSubmit={handleSave}>
      <div>
        <h1 className="text-2xl font-bold text-gray-800">الإعدادات</h1>
        <p className="text-gray-600">إدارة إعدادات الموقع العامة وحفظها في قاعدة البيانات.</p>
      </div>

      {error && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}
      {saved && (
        <div
          role="status"
          className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-700"
        >
          تم حفظ الإعدادات بنجاح.
        </div>
      )}

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-gray-800">إعدادات الموقع العامة</h2>
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            اسم الموقع
            <input
              value={settings.siteName}
              onChange={(event) => update("siteName", event.target.value)}
              required
              maxLength={120}
              className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </label>
          <label className="block text-sm font-medium text-gray-700">
            الشعار المختصر
            <input
              value={settings.tagline}
              onChange={(event) => update("tagline", event.target.value)}
              required
              maxLength={200}
              className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </label>
          <label className="block text-sm font-medium text-gray-700">
            البريد الإلكتروني
            <input
              type="email"
              value={settings.email}
              onChange={(event) => update("email", event.target.value)}
              required
              maxLength={254}
              className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </label>
          <label className="block text-sm font-medium text-gray-700">
            رقم الهاتف
            <input
              type="tel"
              value={settings.phone}
              onChange={(event) => update("phone", event.target.value)}
              required
              maxLength={30}
              className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </label>
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-gray-800">إعدادات Sanity CMS</h2>
        <p className="text-sm text-gray-600">
          Project ID: <code>xd0ohyiz</code> · Dataset: <code>production</code>
        </p>
        <a
          href="https://rahmaa-baynahum.sanity.studio"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-emerald-600 hover:underline"
        >
          فتح Sanity Studio
        </a>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="rounded-lg bg-emerald-600 px-6 py-2 text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saving ? "جارٍ الحفظ…" : "حفظ التغييرات"}
      </button>
    </form>
  );
}

// The settings page intentionally uses the authenticated admin API; it does not silently persist fake browser-only values.
void DEFAULT_SETTINGS;
