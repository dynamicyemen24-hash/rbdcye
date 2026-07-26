// SettingsPage - إعدادات النظام
import { useState } from 'react';

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">الإعدادات</h1>
        <p className="text-gray-600">إدارة إعدادات النظام العامة</p>
      </div>

      {/* Site Settings */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-4">إعدادات الموقع العامة</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 mb-1">اسم المؤسسة</label>
            <input
              id="siteName"
              type="text"
              defaultValue="رحماء بينهم"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label htmlFor="tagline" className="block text-sm font-medium text-gray-700 mb-1">الشعار المختصر</label>
            <input
              id="tagline"
              type="text"
              defaultValue="أثرٌ يدوم - مستقبلٌ يُبنى"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
            <input
              id="email"
              type="email"
              defaultValue="info@rbdcye.org"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
            <input
              id="phone"
              type="tel"
              defaultValue="+967 1 234 567"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Sanity Settings */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-4">إعدادات Sanity CMS</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="projectId" className="block text-sm font-medium text-gray-700 mb-1">Project ID</label>
            <input
              id="projectId"
              type="text"
              defaultValue="xd0ohyiz"
              disabled
              className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
            />
          </div>
          <div>
            <label htmlFor="dataset" className="block text-sm font-medium text-gray-700 mb-1">Dataset</label>
            <input
              id="dataset"
              type="text"
              defaultValue="production"
              disabled
              className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
            />
          </div>
          <div>
            <label htmlFor="sanityUrl" className="block text-sm font-medium text-gray-700 mb-1">Sanity Studio URL</label>
            <a
              href="https://rahmaa-baynahum.sanity.studio"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 hover:underline"
            >
              https://rahmaa-baynahum.sanity.studio
            </a>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          حفظ التغييرات
        </button>
        {saved && (
          <span className="text-emerald-600 text-sm">✅ تم الحفظ بنجاح</span>
        )}
      </div>
    </div>
  );
}