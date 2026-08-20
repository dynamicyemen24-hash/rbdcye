import { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, FileText, CheckCircle2, UserCheck, Scale, ArrowRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSEO } from '@/utils/seoAdvanced';

export default function PrivacyPolicyPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const initialTab = (location.state as { policyType?: string })?.policyType === 'terms' ? 'terms' : 'privacy';
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'donor-rights'>(initialTab);

  useSEO({
    title: 'السياسات والخصوصية - مؤسسة رحماء بينهم',
    description: 'سياسة الخصوصية، شروط الاستخدام، وميثاق حقوق المتبرعين والحوكمة المعتمدة لدى مؤسسة رحماء بينهم',
  });

  return (
    <div className="min-h-screen bg-[var(--section-bg-primary)] py-16 sm:py-20 lg:py-28 xl:py-32 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Back Link & Header */}
        <div>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand-green)] hover:underline mb-6 font-cairo"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة للصفحة السابقة</span>
          </button>

          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--brand-green-pale)] text-[var(--brand-green)] text-xs font-bold font-cairo">
              <Shield className="w-3.5 h-3.5" />
              <span>الحوكمة والامتثال القانوني</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-alexandria text-gray-900">
              السياسات والشروط والخصوصية
            </h1>
            <p className="text-gray-600 text-sm sm:text-base font-cairo max-w-xl mx-auto leading-relaxed">
              التزامنا الصارم بالشفافية المطلقة، حماية بيانات المتبرعين، وتطبيق أعلى المعايير القانونية والأخلاقية.
            </p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex justify-center border-b border-gray-200 gap-2 sm:gap-4 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-bold font-cairo border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'privacy'
                ? 'border-[var(--brand-green)] text-[var(--brand-green)]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>سياسة الخصوصية</span>
          </button>

          <button
            onClick={() => setActiveTab('terms')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-bold font-cairo border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'terms'
                ? 'border-[var(--brand-green)] text-[var(--brand-green)]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>الشروط والأحكام</span>
          </button>

          <button
            onClick={() => setActiveTab('donor-rights')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-bold font-cairo border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'donor-rights'
                ? 'border-[var(--brand-green)] text-[var(--brand-green)]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>ميثاق حقوق المتبرع</span>
          </button>
        </div>

        {/* Content Box */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-100 space-y-6 font-cairo text-gray-700 leading-relaxed text-sm sm:text-base"
        >
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold font-cairo text-gray-900 flex items-center gap-2">
                <Lock className="w-5 h-5 text-[var(--brand-green)]" />
                سياسة حماية البيانات والخصوصية
              </h2>
              <p>
                تلتزم مؤسسة رحماء بينهم بحماية خصوصية جميع المتبرعين والزوار والمستفيدين. نوضح هنا كيفية جمع البيانات واستخدامها وحمايتها:
              </p>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-1">1. البيانات التي نجمعها</h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    نجمع البيانات الأساسية المقدمة طواعية عند التبرع أو التطوع (الاسم، البريد الإلكتروني، رقم الهاتف، والمساهمات). لا نقوم بتخزين أي معلومات بطاقات ائتمانية على خوادمنا بل تتم معالجتها مشفرة عبر بوابات الدفع العالمية المعتمدة.
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-1">2. الغرض من استخدام البيانات</h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    تُستخدم البيانات فقط لإصدار السندات المالية الرسمية، إرسال تقارير الأثر الميداني للمشاريع، والرد على الاستفسارات والتواصل مع المتطوعين.
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-1">3. عدم مشاركة البيانات</h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    نتعهد بعدم بيع أو تأجير أو مشاركة أي بيانات للمتبرعين أو المتطوعين مع أي طرف ثالث لأغراض تجارية، وتخضع كافة السجلات لمعايير السرية التامة.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold font-cairo text-gray-900 flex items-center gap-2">
                <Scale className="w-5 h-5 text-[var(--brand-green)]" />
                الشروط والأحكام العامة
              </h2>
              <p>
                تنظم هذه الشروط استخدام الموقع الإلكتروني لمؤسسة رحماء بينهم وكافة الخدمات وعمليات التبرع المتاحة من خلاله:
              </p>

              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[var(--brand-green)] shrink-0 mt-0.5" />
                  <span>توجيه التبرعات بنسبة 100% للمصارف والمشاريع الإنسانية المحددة من قِبل المتبرع أو الصندوق العام في حال عدم التحديد.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[var(--brand-green)] shrink-0 mt-0.5" />
                  <span>تخضع المؤسسة للمراجعة المحاسبية السنوية وتصدر تقارير مالية وتدقيقية مستقلة معتمدة.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[var(--brand-green)] shrink-0 mt-0.5" />
                  <span>يحق للمتبرع طلب تقرير مفصل حول تنفيذ المشروع الذي ساهم فيه عبر التواصل مع إدارة البرامج أو عبر بوابة المتبرع.</span>
                </li>
              </ul>
            </div>
          )}

          {activeTab === 'donor-rights' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold font-cairo text-gray-900 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-[var(--brand-gold)]" />
                ميثاق حقوق المتبرعين
              </h2>
              <p>
                إيمانًا منا بأن العمل الإنساني قائم على الثقة والمسؤولية، نضمن للمتبرع الحقوق التالية:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100">
                  <h4 className="font-bold text-gray-900 mb-1 text-sm">حق المعرفة والاطلاع</h4>
                  <p className="text-xs text-gray-600">معرفة أهداف المؤسسة، هوية مجلس الإدارة، واستراتيجيات تنفيذ المشاريع الميدانية.</p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100">
                  <h4 className="font-bold text-gray-900 mb-1 text-sm">حق التوجيه والأمانة</h4>
                  <p className="text-xs text-gray-600">التأكد من أن تبرعه يُصرف وفق الغرض الذي تبرع من أجله بدقة وشفافية.</p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100">
                  <h4 className="font-bold text-gray-900 mb-1 text-sm">حق السرية التامة</h4>
                  <p className="text-xs text-gray-600">الحفاظ على سرية هويته ومعلوماته الشخصية وحجم تبرعاته ما لم يطلب خلاف ذلك.</p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100">
                  <h4 className="font-bold text-gray-900 mb-1 text-sm">حق التوثيق والمساءلة</h4>
                  <p className="text-xs text-gray-600">استلام سندات التبرع الرسمية والتقارير الدورية المصورة للمشاريع المنجزة.</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
