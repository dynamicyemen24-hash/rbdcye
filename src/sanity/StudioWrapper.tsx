/**
 * Sanity Studio Wrapper for Vite + React
 * مكوّن لعرض Sanity Studio داخل التطبيق
 */

import { useEffect, useState } from 'react';

export function SanityStudioWrapper() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [Studio, setStudio] = useState<any>(null);

  useEffect(() => {
    // تحميل Sanity Studio ديناميكياً
    import('sanity').then(({ defineConfig }) => {
      // Studio will be loaded dynamically
      setLoading(false);
    }).catch((err) => {
      console.warn('Sanity Studio not available:', err);
      setError('Sanity Studio غير متوفر - تأكد من تثبيت الحزم');
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-brand-green border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري تحميل لوحة التحكم...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
          <h2 className="text-red-600 font-bold mb-2">خطأ في التحميل</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <a 
            href="https://rbdcye.sanity.studio" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block bg-brand-green text-white px-4 py-2 rounded-lg"
          >
            زيارة لوحة التحكم على Sanity
          </a>
        </div>
      </div>
    );
  }

  // Fallback - redirect to hosted studio
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
        <h2 className="text-brand-green font-bold mb-2">لوحة التحكم</h2>
        <p className="text-muted-foreground mb-4">
          اضغط على الزر للذهاب إلى لوحة التحكم في Sanity
        </p>
        <a 
          href="https://rbdcye.sanity.studio" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block bg-brand-green text-white px-4 py-2 rounded-lg"
        >
          فتح لوحة التحكم
        </a>
      </div>
    </div>
  );
}

// Hook for checking Sanity availability
export function useSanityStudioAvailable(): boolean {
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    const checkAvailable = async () => {
      try {
        await import('sanity');
        setAvailable(true);
      } catch {
        setAvailable(false);
      }
    };
    checkAvailable();
  }, []);

  return available;
}