// ============================================================
// Multi-Project Donation Widget - Enterprise Grade
// يدعم التبرع لمشاريع متعددة في صفقة واحدة
// متصل بقاعدة البيانات الحقيقية
// ============================================================
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, TrendingUp, CheckCircle, Plus, Minus, AlertCircle,
  Info, DollarSign, Share2, Download, Banknote, CreditCard,
  Building, Target, Sparkles, Calculator, Wallet,
  ChevronDown, ChevronUp, PiggyBank, Shield, FileText,
  Users, BookOpen, GraduationCap, Droplets, Utensils,
  Stethoscope, TreePine, Star, Gift, Loader2,
} from 'lucide-react';
import { useState, useCallback, useMemo, useEffect } from 'react';
import { useAuth } from '@/features/auth/contexts/AuthContext';

import {
  multiProjectDonationService,
  type MultiProjectDonationRequest,
  type ProjectAllocation,
  type DonationReceipt,
} from '@/shared/services/donation-multi-project.service';
import { type PaymentMethod, type PaymentCurrency } from '@/shared/services/payment-gateway.service';

// ============================================================
// Icons for projects
// ============================================================
const PROJECT_ICONS: Record<string, any> = {
  default: Heart,
  ماء: Droplets,
  بئر: Droplets,
  يتيم: Users,
  غذائي: Utensils,
  سلة: Utensils,
  تعليم: GraduationCap,
  وقف: BookOpen,
  صحي: Stethoscope,
  إغاثة: Heart,
  تنموي: TreePine,
  عام: Star,
};

function getProjectIcon(name: string): any {
  for (const [keyword, icon] of Object.entries(PROJECT_ICONS)) {
    if (name.includes(keyword)) return icon;
  }
  return Heart;
}

// ============================================================
// Preset Amounts
// ============================================================
const PRESET_AMOUNTS = [100, 500, 1000, 5000, 10000, 50000];
const PAYMENT_METHODS = [
  { id: 'card' as PaymentMethod, name: 'بطاقة ائتمان', icon: CreditCard, desc: 'Visa - MasterCard - مدى' },
  { id: 'bank' as PaymentMethod, name: 'تحويل بنكي', icon: Building, desc: 'حساب المؤسسة' },
  { id: 'stripe' as PaymentMethod, name: 'Stripe', icon: Wallet, desc: 'دفع دولي آمن' },
  { id: 'moyasar' as PaymentMethod, name: 'Moyasar', icon: CreditCard, desc: 'مدى - فيزا - ماستركارد' },
  { id: 'cash' as PaymentMethod, name: 'نقدي', icon: Banknote, desc: 'تنسيق مع المؤسسة' },
];

// ============================================================
// MultiProjectDonation Component
// ============================================================
export default function MultiProjectDonation() {
  const { user } = useAuth();
  
  // Core state
  const [projects, setProjects] = useState<ProjectAllocation[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [donorName, setDonorName] = useState(user?.name || '');
  const [donorEmail, setDonorEmail] = useState(user?.email || '');
  const [donorPhone, setDonorPhone] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [dedication, setDedication] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeContact, setAgreeContact] = useState(false);
  const [notes, setNotes] = useState('');
  
  // UI state
  const [step, setStep] = useState<'projects' | 'amount' | 'info' | 'confirm' | 'receipt'>('projects');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [receipt, setReceipt] = useState<DonationReceipt | null>(null);
  const [error, setError] = useState('');
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [splitMethod, setSplitMethod] = useState<'equal' | 'custom'>('equal');

  // Load projects
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const available = await multiProjectDonationService.getAvailableProjects();
        setProjects(available);
        if (available.length > 0) {
          setSelectedProjects([available[0].projectId]);
        }
      } catch {
        // Fallback projects handled in service
      } finally {
        setLoading(false);
      }
    };
    loadProjects();
  }, []);

  // Initialize donor info
  useEffect(() => {
    if (user) {
      setDonorName(user.name || '');
      setDonorEmail(user.email || '');
    }
  }, [user]);

  // Calculate allocations
  const allocations = useMemo(() => {
    const activeProjects = projects.filter(p => selectedProjects.includes(p.projectId));
    if (activeProjects.length === 0 || totalAmount <= 0) {
      return activeProjects.map(p => ({ ...p, amount: 0 }));
    }
    return multiProjectDonationService.splitDonationEqually(totalAmount, activeProjects);
  }, [projects, selectedProjects, totalAmount]);

  const totalAllocated = useMemo(() => 
    allocations.reduce((sum, a) => sum + a.amount, 0),
  [allocations]);

  // Handlers
  const toggleProject = useCallback((projectId: string) => {
    setSelectedProjects(prev => 
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  }, []);

  const handlePresetAmount = useCallback((amount: number) => {
    setTotalAmount(amount);
    setCustomAmount('');
  }, []);

  const handleCustomAmount = useCallback((value: string) => {
    const num = parseInt(value.replace(/[^\d]/g, ''), 10);
    if (isNaN(num)) {
      setCustomAmount('');
      setTotalAmount(0);
    } else {
      setCustomAmount(value);
      setTotalAmount(num);
    }
  }, []);

  const handleAllocationChange = useCallback((projectId: string, amount: number) => {
    setProjects(prev => prev.map(p => 
      p.projectId === projectId ? { ...p, amount: Math.max(0, amount) } : p
    ));
  }, []);

  const handleSubmit = async () => {
    setError('');
    
    // Validation
    if (selectedProjects.length === 0) {
      setError('الرجاء اختيار مشروع واحد على الأقل');
      return;
    }
    if (totalAmount < 10) {
      setError('الحد الأدنى للتبرع 10 ريال');
      return;
    }
    if (!donorName.trim() && !isAnonymous) {
      setError('الرجاء إدخال اسم المتبرع');
      return;
    }
    if (!donorEmail.trim()) {
      setError('الرجاء إدخال البريد الإلكتروني');
      return;
    }
    if (!agreeTerms) {
      setError('الرجاء الموافقة على شروط التبرع');
      return;
    }

    setProcessing(true);
    try {
      const request: MultiProjectDonationRequest = {
        donorId: user?.id,
        donorName: isAnonymous ? 'متبرع كريم' : donorName.trim(),
        donorEmail: donorEmail.trim(),
        donorPhone: donorPhone.trim() || undefined,
        allocations: allocations.filter(a => a.amount > 0),
        totalAmount: totalAllocated,
        currency: 'YER',
        paymentMethod,
        paymentType: 'once',
        isAnonymous,
        dedication: dedication.trim() || undefined,
        notes: notes.trim() || undefined,
        source: 'web',
        agreeToTerms: agreeTerms,
        agreeToContact: agreeContact,
      };

      const result = await multiProjectDonationService.processDonation(request);
      setReceipt(result);
      setStep('receipt');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ أثناء معالجة التبرع');
    } finally {
      setProcessing(false);
    }
  };

  const handleNewDonation = () => {
    setSelectedProjects(projects.length > 0 ? [projects[0].projectId] : []);
    setTotalAmount(0);
    setCustomAmount('');
    setPaymentMethod('card');
    setDedication('');
    setAgreeTerms(false);
    setAgreeContact(false);
    setNotes('');
    setError('');
    setReceipt(null);
    setStep('projects');
  };

  const displayProjects = showAllProjects ? projects : projects.slice(0, 4);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--brand-green)] mx-auto mb-4" />
          <p className="text-sm text-gray-500">جاري تحميل المشاريع المتاحة...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-l from-[var(--brand-green)] via-emerald-600 to-emerald-800 p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" fill="white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">تبرع لمشاريع متعددة</h2>
            <p className="text-white/80 text-sm">وزع تبرعك على المشاريع التي تختارها</p>
          </div>
        </div>
        
        {/* Step Indicator */}
        <div className="flex items-center gap-2 mt-4">
          {[
            { id: 'projects', label: 'المشاريع' },
            { id: 'amount', label: 'المبلغ' },
            { id: 'info', label: 'البيانات' },
            { id: 'confirm', label: 'التأكيد' },
          ].map((s, i) => (
            <div key={s.id} className="flex items-center gap-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step === s.id ? 'bg-white text-emerald-800 shadow-lg' :
                ['receipt', 'confirm'].includes(step) && i < 4 ? 'bg-white/30 text-white' :
                'bg-white/10 text-white/60'
              }`}>
                {step === s.id ? (
                  <span className="flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" />
                  </span>
                ) : ['receipt', 'confirm'].includes(step) && i < 4 ? (
                  <CheckCircle className="w-4 h-4" />
                ) : i + 1}
              </div>
              <span className={`text-xs ${step === s.id ? 'text-white font-semibold' : 'text-white/60'}`}>{s.label}</span>
              {i < 3 && <div className="w-6 h-0.5 bg-white/20 mx-1" />}
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700"
          >
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* ====================================================
            STEP 1: PROJECT SELECTION
            ==================================================== */}
        {step === 'projects' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Target className="w-5 h-5 text-[var(--brand-green)]" />
              اختر المشاريع التي تريد دعمها
              <span className="text-sm font-normal text-gray-500">(اختيار متعدد)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {displayProjects.map((project, i) => {
                const isSelected = selectedProjects.includes(project.projectId);
                const Icon = getProjectIcon(project.projectName);
                return (
                  <motion.button
                    key={project.projectId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => toggleProject(project.projectId)}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative p-4 rounded-2xl border-2 text-right transition-all ${
                      isSelected
                        ? 'border-[var(--brand-green)] bg-emerald-50 shadow-md'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 left-2 w-6 h-6 bg-[var(--brand-green)] rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-2" style={{ background: isSelected ? '#05966920' : '#F3F4F6' }}>
                      <Icon className="w-5 h-5" style={{ color: isSelected ? '#059669' : '#6B7280' }} />
                    </div>
                    <h4 className="font-semibold text-gray-800 text-sm mb-1">{project.projectName}</h4>
                    {project.projectImage && (
                      <p className="text-xs text-gray-500">اضغط للاختيار</p>
                    )}
                  </motion.button>
                );
              })}

              {projects.length > 4 && (
                <button
                  onClick={() => setShowAllProjects(!showAllProjects)}
                  className="col-span-full flex items-center justify-center gap-2 py-2 text-sm text-[var(--brand-green)] hover:text-emerald-600"
                >
                  {showAllProjects ? 'عرض أقل' : `عرض ${projects.length - 4} مشاريع أخرى`}
                  {showAllProjects ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              )}
            </div>

            <p className="text-xs text-gray-400">
              تم اختيار {selectedProjects.length} من {projects.length} مشروع
            </p>

            <motion.button
              onClick={() => selectedProjects.length > 0 && setStep('amount')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={selectedProjects.length === 0}
              className="w-full py-3.5 bg-[var(--brand-green)] text-white rounded-xl font-bold hover:bg-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-100"
            >
              متابعة - تحديد المبلغ
            </motion.button>
          </motion.div>
        )}

        {/* ====================================================
            STEP 2: AMOUNT & ALLOCATION
            ==================================================== */}
        {step === 'amount' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-[var(--brand-green)]" />
              اختر المبلغ الإجمالي
            </h3>

            {/* Preset Amounts */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {PRESET_AMOUNTS.map(amount => (
                <button
                  key={amount}
                  onClick={() => handlePresetAmount(amount)}
                  className={`py-2.5 rounded-xl font-semibold text-sm transition-all ${
                    totalAmount === amount && !customAmount
                      ? 'bg-[var(--brand-green)] text-white shadow-lg shadow-emerald-200'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {amount.toLocaleString('ar-SA')}
                </button>
              ))}
              <input
                type="text"
                value={customAmount}
                onChange={e => handleCustomAmount(e.target.value)}
                placeholder="مبلغ مخصص"
                className="px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-center text-sm focus:ring-2 focus:ring-[var(--brand-green)]/30 outline-none"
              />
            </div>

            {totalAmount > 0 && (
              <>
                {/* Allocation Summary */}
                <div className="bg-gradient-to-l from-emerald-50 to-white rounded-2xl p-5 border border-emerald-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">توزيع {totalAmount.toLocaleString('ar-SA')} ريال</span>
                    <span className="text-xs text-gray-500 block">{allocations.length} مشاريع</span>
                  </div>

                  <div className="space-y-2">
                    {allocations.map(allocation => (
                      <div key={allocation.projectId} className="flex items-center justify-between py-1">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-[var(--brand-green)]" />
                          <span className="text-sm text-gray-700">{allocation.projectName}</span>
                        </div>
                        <span className="text-sm font-semibold text-[var(--brand-green)]">
                          {allocation.amount.toLocaleString('ar-SA')} ريال
                          <span className="text-xs text-gray-500 mr-1">({allocation.percentage?.toFixed(1)}%)</span>
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Total bar */}
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden flex">
                    {allocations.map((a, i) => (
                      <div
                        key={a.projectId}
                        className="h-full transition-all"
                        style={{
                          width: `${a.percentage || 0}%`,
                          background: `hsl(${120 + i * 30}, 60%, 45%)`,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Impact Preview */}
                <div className="bg-gradient-to-l from-blue-50 to-white rounded-2xl p-4 border border-blue-100">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                    <Sparkles className="w-4 h-4 text-blue-500" />
                    الأثر المتوقع
                  </h4>
                  <div className="space-y-1">
                    {allocations.map(a => (
                      <p key={a.projectId} className="text-xs text-gray-600">
                        {a.projectName}: <span className="font-semibold text-blue-600">{Math.floor(a.amount / 100)}</span> مستفيد
                      </p>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="flex gap-3">
              <button onClick={() => setStep('projects')} className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all">
                رجوع
              </button>
              <motion.button
                onClick={() => totalAmount > 0 && setStep('info')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={totalAmount <= 0}
                className="flex-[2] py-3 bg-[var(--brand-green)] text-white rounded-xl font-bold hover:bg-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                متابعة - بيانات المتبرع
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* ====================================================
            STEP 3: DONOR INFO
            ==================================================== */}
        {step === 'info' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[var(--brand-green)]" />
              بيانات المتبرع
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="donor-name" className="block text-sm font-semibold text-gray-700 mb-1">الاسم الكامل {!isAnonymous && <span className="text-red-500">*</span>}</label>
                <input id="donor-name" type="text" value={donorName} onChange={e => setDonorName(e.target.value)} disabled={isAnonymous}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-[var(--brand-green)]/30 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-400" 
                  placeholder={isAnonymous ? 'متبرع كريم' : 'محمد أحمد'} />
              </div>
              <div>
                <label htmlFor="donor-email" className="block text-sm font-semibold text-gray-700 mb-1">البريد الإلكتروني <span className="text-red-500">*</span></label>
                <input id="donor-email" type="email" value={donorEmail} onChange={e => setDonorEmail(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-[var(--brand-green)]/30 outline-none transition-all"
                  placeholder="example@email.com" />
              </div>
              <div>
                <label htmlFor="donor-phone" className="block text-sm font-semibold text-gray-700 mb-1">رقم الهاتف</label>
                <input id="donor-phone" type="tel" value={donorPhone} onChange={e => setDonorPhone(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-[var(--brand-green)]/30 outline-none transition-all"
                  placeholder="+967 XXX XXX XXX" />
              </div>
              <div>
                <label htmlFor="donor-dedication" className="block text-sm font-semibold text-gray-700 mb-1">هدية / إهداء (اختياري)</label>
                <input id="donor-dedication" type="text" value={dedication} onChange={e => setDedication(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-[var(--brand-green)]/30 outline-none transition-all"
                  placeholder="مثال: هدية لروح والدي" />
              </div>
            </div>

            {/* Anonymous Toggle */}
            <span className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100/50 transition-all">
              <input 
                id="anonymous-donation" 
                type="checkbox" 
                checked={isAnonymous} 
                onChange={e => setIsAnonymous(e.target.checked)} 
                className="w-5 h-5 rounded border-gray-300 text-[var(--brand-green)] focus:ring-[var(--brand-green)]" 
                aria-label="تبرع مجهول - لن يظهر اسمك في سجل المتبرعين"
              />
              <span>
                <span className="text-sm font-semibold text-gray-800">تبرع مجهول</span>
                <span className="text-xs text-gray-500 block">لن يظهر اسمك في سجل المتبرعين</span>
              </span>
            </span>

            {/* Notes */}
            <div>
              <label htmlFor="donor-notes" className="block text-sm font-semibold text-gray-700 mb-1">ملاحظات (اختياري)</label>
              <textarea id="donor-notes" rows={2} value={notes} onChange={e => setNotes(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-[var(--brand-green)]/30 outline-none transition-all resize-none"
                placeholder="أي ملاحظات إضافية..." />
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep('amount')} className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all">
                رجوع
              </button>
              <motion.button
                onClick={() => setStep('confirm')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-[2] py-3 bg-[var(--brand-green)] text-white rounded-xl font-bold hover:bg-emerald-600 transition-all"
              >
                متابعة - التأكيد والدفع
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* ====================================================
            STEP 4: CONFIRM & PAY
            ==================================================== */}
        {step === 'confirm' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Shield className="w-5 h-5 text-[var(--brand-green)]" />
              تأكيد التبرع
            </h3>

            {/* Summary Card */}
            <div className="bg-gradient-to-l from-emerald-50 to-white rounded-2xl p-5 border border-emerald-100">
              <h4 className="font-semibold text-gray-800 mb-3">ملخص التبرع</h4>
              <div className="space-y-2 mb-4">
                {allocations.filter(a => a.amount > 0).map(a => (
                  <div key={a.projectId} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{a.projectName}</span>
                    <span className="font-semibold text-gray-800">{a.amount.toLocaleString('ar-SA')} ريال</span>
                  </div>
                ))}
                <div className="border-t border-emerald-200 pt-2 flex items-center justify-between">
                  <span className="font-bold text-gray-800">الإجمالي</span>
                  <span className="font-bold text-lg text-[var(--brand-green)]">{totalAllocated.toLocaleString('ar-SA')} ريال</span>
                </div>
              </div>

              <div className="space-y-1 text-xs text-gray-500">
                <p>المتبرع: {isAnonymous ? 'متبرع كريم' : donorName}</p>
                <p>البريد: {donorEmail}</p>
                {dedication && <p>إهداء: {dedication}</p>}
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">طريقة الدفع</h4>
              <div className="grid grid-cols-1 gap-2">
                {PAYMENT_METHODS.map(method => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                      paymentMethod === method.id
                        ? 'border-[var(--brand-green)] bg-emerald-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      paymentMethod === method.id ? 'bg-[var(--brand-green)]' : 'bg-gray-100'
                    }`}>
                      <method.icon className={`w-5 h-5 ${paymentMethod === method.id ? 'text-white' : 'text-gray-500'}`} />
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-gray-800 block">{method.name}</span>
                      <span className="text-xs text-gray-500">{method.desc}</span>
                    </div>
                    {paymentMethod === method.id && (
                      <CheckCircle className="w-5 h-5 text-[var(--brand-green)] mr-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Terms */}
            <div className="space-y-3">
            <label htmlFor="agree-terms" className="flex items-start gap-3 cursor-pointer">
                <input id="agree-terms" type="checkbox" checked={agreeTerms} onChange={e => setAgreeTerms(e.target.checked)}
                  className="w-5 h-5 mt-0.5 rounded border-gray-300 text-[var(--brand-green)] focus:ring-[var(--brand-green)]" />
                <span className="text-sm text-gray-600">
                  أقر بأن هذا تبرع خيري طوعي، وأوافق على استخدام المبلغ بحسب تقدير المؤسسة لتحقيق أهدافها الإنسانية
                  <span className="text-red-500">*</span>
                </span>
              </label>
              <label htmlFor="agree-contact" className="flex items-start gap-3 cursor-pointer">
                <input id="agree-contact" type="checkbox" checked={agreeContact} onChange={e => setAgreeContact(e.target.checked)}
                  className="w-5 h-5 mt-0.5 rounded border-gray-300 text-[var(--brand-green)] focus:ring-[var(--brand-green)]" />
                <span className="text-sm text-gray-600">
                  أوافق على استلام تقارير الأثر والإنجازات عبر البريد الإلكتروني
                </span>
              </label>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep('info')} className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all">
                رجوع
              </button>
              <motion.button
                onClick={handleSubmit}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={!agreeTerms || processing}
                className="flex-[2] py-3 bg-gradient-to-l from-[var(--brand-green)] to-emerald-500 text-white rounded-xl font-bold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    جاري معالجة التبرع...
                  </>
                ) : (
                  <>
                    <Heart className="w-5 h-5" />
                    تأكيد التبرع - {totalAllocated.toLocaleString('ar-SA')} ريال
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* ====================================================
            STEP 5: RECEIPT
            ==================================================== */}
        {step === 'receipt' && receipt && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4 text-center">
            {/* Success Animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 10 }}
              className="w-20 h-20 mx-auto bg-gradient-to-br from-[var(--brand-green)] to-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-200"
            >
              <CheckCircle className="w-10 h-10 text-white" />
            </motion.div>

            <h3 className="text-2xl font-bold text-gray-800">تم استلام تبرعك بنجاح!</h3>
            <p className="text-gray-500">جزاك الله خيراً على كرمك وعطائك</p>

            {/* Receipt Card */}
            <div className="bg-white rounded-2xl p-6 border-2 border-emerald-100 shadow-lg text-right">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                <div>
                  <h4 className="font-bold text-gray-800">{receipt.organizationInfo.nameAr}</h4>
                  <p className="text-xs text-gray-500">{receipt.organizationInfo.name}</p>
                </div>
                <div className="text-left">
                  <p className="text-xs text-gray-500">رقم الإيصال</p>
                  <p className="font-mono text-sm font-bold text-[var(--brand-green)]">{receipt.receiptNumber}</p>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                {receipt.allocations.filter(a => a.amount > 0).map(a => (
                  <div key={a.projectId} className="flex items-center justify-between py-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[var(--brand-green)]" />
                      <span className="text-sm text-gray-700">{a.projectName}</span>
                    </div>
                    <span className="text-sm font-semibold">{a.amount.toLocaleString('ar-SA')} ريال</span>
                  </div>
                ))}
                <div className="border-t border-emerald-100 pt-3 flex items-center justify-between">
                  <span className="font-bold text-gray-800">الإجمالي</span>
                  <span className="text-lg font-bold text-[var(--brand-green)]">{receipt.totalAmount.toLocaleString('ar-SA')} ريال</span>
                </div>
              </div>

              <div className="text-xs text-gray-400 space-y-1">
                <p>المتبرع: {receipt.donorName}</p>
                <p>التاريخ: {new Date(receipt.createdAt).toLocaleDateString('ar-SA')}</p>
                <p>رقم العملية: {receipt.transactionId}</p>
                <p>رقم السجل: {receipt.organizationInfo.licenseNumber}</p>
                <p>هاتف: {receipt.organizationInfo.phone}</p>
              </div>
            </div>

            {/* Impact Certificate */}
            <div className="bg-gradient-to-l from-emerald-50 to-green-50 rounded-2xl p-4 border border-emerald-100">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-[var(--brand-green)] mt-0.5" />
                <div className="text-right">
                  <h5 className="font-semibold text-gray-800 text-sm mb-1">شهادة الأثر المتوقع</h5>
                  <div className="text-xs text-gray-600 space-y-0.5">
                    {receipt.allocations.filter(a => a.amount > 0).map(a => {
                      const beneficiaries = Math.floor(a.amount / 100);
                      return (
                        <p key={a.projectId}>• {a.projectName}: <span className="font-semibold text-emerald-700">{beneficiaries}</span> مستفيد</p>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <motion.button
                onClick={() => {
                  const text = `تبرعت بمبلغ ${receipt.totalAmount.toLocaleString('ar-SA')} ريال لـ ${receipt.allocations.filter(a => a.amount > 0).length} مشاريع عبر @rbdcye.org`;
                  if (navigator.share) {
                    navigator.share({ title: 'تبرعي لرحماء بينهم', text, url: window.location.href }).catch(() => {});
                  } else {
                    navigator.clipboard.writeText(text);
                  }
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                مشاركة
              </motion.button>
              <motion.button
                onClick={() => window.print()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                حفظ
              </motion.button>
            </div>

            <motion.button
              onClick={handleNewDonation}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-gradient-to-l from-[var(--brand-green)] to-emerald-500 text-white rounded-xl font-bold hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <Heart className="w-5 h-5" />
              تبرع مرة أخرى
            </motion.button>
          </motion.div>
        )}

        {/* Complete the step logic - back to projects if needed */}
        {!['projects', 'amount', 'info', 'confirm', 'receipt'].includes(step) && (
          <div className="text-center py-8">
            <p className="text-gray-500">حدث خطأ غير متوقع. الرجاء المحاولة مرة أخرى.</p>
            <button onClick={handleNewDonation} className="mt-4 px-6 py-2 bg-[var(--brand-green)] text-white rounded-xl font-semibold">
              بدء تبرع جديد
            </button>
          </div>
        )}
      </div>
    </div>
  );
}