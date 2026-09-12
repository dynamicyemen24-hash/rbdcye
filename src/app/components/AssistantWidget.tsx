// Assistant Widget - AI-Powered Information Assistant with Rule-Based Foundation
// Can be upgraded to connect to any LLM API (OpenAI, HuggingFace, etc.) later

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useState, useEffect, useRef } from 'react';

/// --- قاعدة المعرفة الأساسية (يمكن توسيعها إلى DB أو اتصال AI) ---
const KNOWLEDGE_BASE: Record<string, { question: string; answer: string; action: string; cta: string }> = {
  // السؤال الأول: كيفية التبرع
  donation: {
    question: "كيف أتبرع؟",
    answer: "يمكنك التبرع بسهولة من خلال صفحة التبرع لدينا:\n\n1. اضغط على زر 'تبرع الآن' في الهيرو أو القائمة\n2. اختر نوع التبرع (مادي، مشروع، كفالة)\n3. أدخل المبلغ المطلوب\n4. أدخل بياناتك للمتابعة (اسم، email، الهاتف)\n5. ستreceipt يتم إرسالها إلى بريدك الإلكتروني",
    action: "/donate",
    cta: "التبرع الآن"
  },
  // السؤال الثاني: الموقع الجغرافي
  location: {
    question: "أين تقع المؤسسة؟",
    answer: "تقع مؤسسة رحماء بينهم للإغاثة والتنمية:\n📍 العاصمة: صنعاء، الجمهورية اليمنية\n📍 رقم الترخيص: ٤٨٢ (ترخيص رسمي)\n📍 المناطق المغطاة: 8 محافظات يمنية\n📍 طرق التواصل:\n• واتساب: +967-780-777-007\n• Email: info@rbdcye.org\n• الهاتف: +967-780-777-007",
    action: "/about",
    cta: "زيارة الموقع"
  },
  // السؤال الثالث: الأنشطة
  activities: {
    question: "ما هي الأنشطة والبرامج؟",
    answer: "نغطي أربعة مجالات رئيسية للإنقاذ والتنموية:\n\n🟢 **1. الرعاية الاجتماعية والكفالات**\n   - كفالات الأيتام والأرامل (450 مستفيد حالي)\n   - تفريج كرب الغارمين والمعدمين\n   - الكسوات (شتاء، عيد، مدارس)\n\n🟢 **2. الأمن الغذائي والإغاثة العاجلة**\n   - توزيع السلال الغذائية (12,000 عائلة)\n   - المطابخ الخيرية (وجبات ساخنة يومية)\n   - توزيع اللحوم خارج إطار الأضاحي\n\n🟢 **3. المياه والمشاريع الإنشائية**\n   - 8 آبار مياه بالطاقة الشمسية\n   - حفر الآبار والارتوازية\n   - إنشاء الخزانات والأحواض\n   - ترميم دور القرآن والمساجد\n\n📊 **إجمالي المستفيدين**: 15,000+ مستفيد مباشر\n📅 **سنوات العطاء**: 11 عامًا من العطاء المتواصل",
    action: "/programs",
    cta: "استكشاف البرامج"
  },
  // السؤال الرابع: الترخيص
  license: {
    question: "هل المؤسسة مرخصة؟",
    answer: "✅ **نعم، المؤسسة مرخصة رسميًا**\n\n📜 رقم الترخيص: ٤٨٢\n📜 نوع الكيان: مؤسسة إنسانية تنموية مستقلة\n📜 الجهة المشرفة: الجمهورية اليمنية\n📜 الحالة: نشطة وحالية\n📜 الوثائق: التقارير المالية المدققة تُنشر بشكل ربعي وسنوي\n\nنحن نلتزم بأعلى معايير الحوكمة والشفافية مع منظمات CHS و SPHERE internationales.",
    action: "/transparency",
    cta: "عرض التقارير"
  }
};

export const AssistantWidget = () => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('donation');
  const [answer, setAnswer] = useState<string>('');
  const [showAI, setShowAI] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle question selection
  const handleSelect = (tab: keyof typeof KNOWLEDGE_BASE) => {
    setActiveTab(tab);
    const data = KNOWLEDGE_BASE[tab];
    setAnswer(data.answer);
    setShowAI(true);
    // Auto-scroll or focus
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Simulate AI upgrade - can be replaced with real API call
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const simulateAIResponse = (userQuery: string) => {
    const lower = userQuery.toLowerCase();
    for (const [key, data] of Object.entries(KNOWLEDGE_BASE)) {
      if (lower.includes(key) || lower.includes(KNOWLEDGE_BASE[key].question.toLowerCase())) {
        return data.answer;
      }
    }
    // Default fallback
    return "يمكنك طرح سؤالك وسأجيبك بناءً على معلومات المؤسسة، أو يمكنك زيارة صفحاتنا للمزيد من التفاصيل.";
  };

return (
    <>
      <button
        type="button"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[var(--brand-green)] flex items-center justify-center shadow-2xl shadow-glow-green hover:translate-y-1 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-gold)] focus-visible:ring-offset-2"
           onClick={() => setOpen(!open)} 
           aria-expanded={open}
           aria-controls="assistant-panel"
           aria-label="فتح مساعد المؤسسة الذكي">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m12 4l-8 4-8-4m0 7l-8-4-8 4M5 7h2l.4 2H2l1.9 9a2 2 0 012 1.6h15a2 2 0 012 1.6l1.9-9H5a2 2 0 012 1.6l1.9-9H5a2 2 0 01-2-1.6L5 7z" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xl transition-opacity" onClick={() => setOpen(false)} aria-hidden="true" />
          
          {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
          <div
            id="assistant-panel"
            role="dialog"
            aria-modal="true"
            aria-label="مساعد المؤسسة الذكي"
            className="fixed bottom-24 right-6 z-50 w-full max-w-sm bg-white rounded-2xl shadow-2xl shadow-glow-green border border-[var(--brand-green)]/20 max-h-[80vh] overflow-y-auto transform transition-all duration-300 ease-out" style={{ transform: "translateY(20px)" }} onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-[var(--brand-green)]/20">
              <h3 className="font-bold text-[var(--brand-green)] text-lg">
                🤖 مساعد المؤسسة
              </h3>
              <button
                onClick={() => setOpen(false)}
                className="text-[var(--muted-foreground)] hover:text-[var(--brand-green)] float-right text-sm"
                aria-label="إغلاق المساعد"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              {/* Tab Navigation */}
              <div className="mb-4 flex space-x-2">
                {(Object.keys(KNOWLEDGE_BASE) as Array<keyof typeof KNOWLEDGE_BASE>).map((key) => {
                  const data = KNOWLEDGE_BASE[key];
                  return (
                    <button
                      key={key}
                      onClick={() => handleSelect(key)}
                      className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                        activeTab === key
                          ? 'bg-[var(--brand-green)] text-white'
                          : 'text-[var(--muted-foreground)] hover:bg-[var(--brand-green)]/20'
                      }`}
                      aria-label={data.question}
                    >
                      // eslint-disable-next-line no-nested-ternary -- precise: verified
                      {key === 'donation' ? '💳' : key === 'location' ? '📍' : key === 'activities' ? '📋' : '📜'}
                      {data.question}
                    </button>
                  );
                })}
              </div>

              {/* Answer Display */}
              <div className="bg-[var(--card)]/50 rounded-xl p-4 mb-4 min-h-[100px]">
                <p className="text-[var(--foreground)] leading-relaxed">{answer}</p>
              </div>

              {/* AI Upgrade Section */}
              {showAI && (
                <div className="pt-3 border-t border-[var(--border)]">
                  <p className="text-xs text-[var(--muted-foreground)] mb-2">
                    💡 يمكنك طرح سؤال آخر أو التمرير للأسفل للمزيد من الخيارات
                  </p>
                  <div className="space-y-1">
                    <button
                      onClick={() => setShowAI(false)}
                      className="text-[var(--brand-green)] text-sm hover:underline"
                    >
                      إنهاء المحادثة
                    </button>
                    <button
                      onClick={() => setShowAI(false)}
                      className="text-[var(--muted-foreground)] text-sm hover:underline"
                    >
                      عرض الخيارات مجدداً
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};