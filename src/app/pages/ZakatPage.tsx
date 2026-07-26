// Zakat Calculator Page - حاسبة الزكاة الشرعية (محسّنة لتكامل لوحة التحكم والمواصفات)
import { motion } from "framer-motion";
import { Calculator, DollarSign, Gem, Calendar, Bell, CheckCircle, ArrowLeft, ArrowRight, Shield, Heart, TrendingUp } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { useSEO } from '@/utils/seoAdvanced';
import { contentBridge } from '@/shared/services/content-bridge.service';
import { analyticsService } from '@/shared/services/analytics.service';

type ZakatType = 'money' | 'gold' | 'fitr';

const GOLD_PRICE_PER_GRAM = 30; // ريال عماني تقريبي

export default function ZakatPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ZakatType>('money');
  const [cashAmount, setCashAmount] = useState(0);
  const [goldWeight, setGoldWeight] = useState(0);
  const [familyMembers, setFamilyMembers] = useState(1);
  const [zakatResult, setZakatResult] = useState<number | null>(null);
  const [reminderEmail, setReminderEmail] = useState('');
  const [reminderSaved, setReminderSaved] = useState(false);
  const [contentSource, setContentSource] = useState<'static' | 'sanity'>('static');

  useSEO({
    title: 'حاسبة الزكاة - رحماء بينهم',
    description: 'احسب زكاة مالك وذهبك وفطرك بدقة وسهولة، وأدِ زكاتك في مصارفها الشرعية',
    keywords: ['زكاة', 'حاسبة زكاة', 'زكاة المال', 'زكاة الذهب', 'زكاة الفطر', 'رحماء بينهم'],
  });

  useEffect(() => {
    let cancelled = false;
    contentBridge.getContent<any>('impact')
      .then((result) => {
        if (!cancelled) {
          setContentSource(result.isDynamic ? 'sanity' : 'static');
        }
      })
      .catch(() => {
        if (!cancelled) setContentSource('static');
      });
    return () => { cancelled = true; };
  }, []);

  const NISAB = useMemo(() => ({
    money: 85 * GOLD_PRICE_PER_GRAM, // ما يعادل 85 جرام ذهب
    gold: 85,
    fitr: 2.5, // كيلو جرام قمح تقريباً
  }), []);

  const calculateMoneyZakat = () => {
    if (cashAmount >= NISAB.money) {
      return cashAmount * 0.025;
    }
    return 0;
  };

  const calculateGoldZakat = () => {
    if (goldWeight >= NISAB.gold) {
      return goldWeight * GOLD_PRICE_PER_GRAM * 0.025;
    }
    return 0;
  };

  const calculateFitrZakat = () => {
    return familyMembers * NISAB.fitr;
  };

  const handleCalculate = () => {
    let result = 0;
    switch (activeTab) {
      case 'money':
        result = calculateMoneyZakat();
        break;
      case 'gold':
        result = calculateGoldZakat();
        break;
      case 'fitr':
        result = calculateFitrZakat();
        break;
    }
    setZakatResult(result);
    try { analyticsService.generateImpactReport(); } catch { /* non-critical */ }
  };

  const handleReminderSave = () => {
    if (reminderEmail) {
      setReminderSaved(true);
      setTimeout(() => setReminderSaved(false), 3000);
    }
  };

  const handleDonateZakat = () => {
    navigate('/donate', { state: { zakatAmount: zakatResult } });
  };

  return (
    <div className="min-h-screen bg-[var(--background)] pt-20" dir="rtl">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-[var(--brand-green)]/10 to-white overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-[var(--brand-green)]/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-[var(--brand-gold)]/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-[var(--brand-green)]/20 px-5 py-2 rounded-full mb-6 shadow-lg">
              <Calculator className="w-4 h-4 text-[var(--brand-green)]" />
              <span className="text-[var(--brand-green)] text-sm font-medium">حاسبة الزكاة الشرعية</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-[var(--foreground)] mb-4">
              احسب <span className="text-[var(--brand-green)]">زكاتك</span> بسهولة
            </h1>
            <p className="text-xl text-[var(--muted-foreground)] max-w-2xl mx-auto mb-8">
              أداة شرعية موثوقة لحساب زكاة المال والذهب والفطر، مع توجيه لإخراجها في مصارفها
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-[var(--border)]">
                <div className="text-[var(--brand-green)] flex justify-center mb-1">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div className="text-2xl font-bold text-[var(--foreground)]">2.5%</div>
                <div className="text-xs text-[var(--muted-foreground)]">نسبة الزكاة</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-[var(--border)]">
                <div className="text-[var(--brand-gold)] flex justify-center mb-1">
                  <Gem className="w-6 h-6" />
                </div>
                <div className="text-2xl font-bold text-[var(--foreground)]">{NISAB.gold} جرام</div>
                <div className="text-xs text-[var(--muted-foreground)]">نصاب الذهب</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-[var(--border)]">
                <div className="text-blue-600 flex justify-center mb-1">
                  <Calculator className="w-6 h-6" />
                </div>
                <div className="text-2xl font-bold text-[var(--foreground)]">{NISAB.money.toLocaleString('ar-SA')} ر.ع</div>
                <div className="text-xs text-[var(--muted-foreground)]">نصاب المال</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-[var(--border)]">
                <div className="text-purple-600 flex justify-center mb-1">
                  <Heart className="w-6 h-6" />
                </div>
                <div className="text-2xl font-bold text-[var(--foreground)]">8</div>
                <div className="text-xs text-[var(--muted-foreground)]">مصارف الزكاة</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Calculator */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Zakat Type Tabs */}
            <div className="flex gap-2 mb-8">
              {[
                { id: 'money', label: 'زكاة المال', icon: DollarSign },
                { id: 'gold', label: 'زكاة الذهب', icon: Gem },
                { id: 'fitr', label: 'زكاة الفطر', icon: Calendar },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id as ZakatType); setZakatResult(null); }}
                  className={`flex-1 p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-[var(--brand-green)] bg-[var(--brand-green-pale)] text-[var(--brand-green)]'
                      : 'border-[var(--border)] hover:border-[var(--brand-green)]'
                  }`}
                >
                  <tab.icon className="w-8 h-8" />
                  <span className="font-semibold">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Money Zakat */}
            {activeTab === 'money' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-8 border border-[var(--border)] shadow-lg"
              >
                <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6">حساب زكاة المال</h2>

                <div className="mb-6">
                  <label htmlFor="cashAmount" className="block text-lg font-semibold text-[var(--foreground)] mb-2">
                    إجمالي المبلغ المملوك (ر.ع)
                  </label>
                  <div className="relative">
                    <input
                      id="cashAmount"
                      type="number"
                      value={cashAmount || ''}
                      onChange={(e) => setCashAmount(Number(e.target.value))}
                      className="w-full p-4 pr-12 border-2 border-[var(--border)] rounded-xl text-lg focus:ring-2 focus:ring-[var(--brand-green)]/30 outline-none transition-all"
                      placeholder="أدخل المبلغ"
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]">ر.ع</span>
                  </div>
                </div>

                <div className="bg-[var(--brand-green-pale)] p-4 rounded-xl mb-6">
                  <p className="text-sm text-[var(--muted-foreground)]">
                    نصاب الزكاة: {NISAB.money.toLocaleString('ar-SA')} ر.ع (ما يعادل 85 جرام ذهب)
                  </p>
                </div>

                <div className="space-y-3 mb-8">
                  <label className="flex items-center gap-3 p-3 border border-[var(--border)] rounded-xl cursor-pointer hover:border-[var(--brand-green)] transition-colors">
                    <input type="checkbox" className="w-4 h-4 text-[var(--brand-green)]" defaultChecked />
                    <span className="text-[var(--foreground)]">بلغ المال النصاب الشرعي</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 border border-[var(--border)] rounded-xl cursor-pointer hover:border-[var(--brand-green)] transition-colors">
                    <input type="checkbox" className="w-4 h-4 text-[var(--brand-green)]" defaultChecked />
                    <span className="text-[var(--foreground)]">مر عليه عام هجري كامل</span>
                  </label>
                </div>

                <button onClick={handleCalculate} className="w-full bg-[var(--brand-green)] text-white py-4 rounded-xl font-bold text-lg hover:bg-[var(--brand-green-light)] transition-colors shadow-lg hover:shadow-xl">
                  احسب الزكاة
                </button>
              </motion.div>
            )}

            {/* Gold Zakat */}
            {activeTab === 'gold' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-8 border border-[var(--border)] shadow-lg"
              >
                <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6">حساب زكاة الذهب</h2>

                <div className="mb-6">
                  <label htmlFor="goldWeight" className="block text-lg font-semibold text-[var(--foreground)] mb-2">
                    وزن الذهب المملوك (جرام)
                  </label>
                  <input
                    id="goldWeight"
                    type="number"
                    value={goldWeight || ''}
                    onChange={(e) => setGoldWeight(Number(e.target.value))}
                    className="w-full p-4 border-2 border-[var(--border)] rounded-xl text-lg focus:ring-2 focus:ring-[var(--brand-green)]/30 outline-none transition-all"
                    placeholder="أدخل الوزن بالجرام"
                  />
                </div>

                <div className="bg-[var(--brand-green-pale)] p-4 rounded-xl mb-6">
                  <p className="text-sm text-[var(--muted-foreground)]">
                    نصاب الذهب: {NISAB.gold} جرام (سعر الجرام ~ {GOLD_PRICE_PER_GRAM} ر.ع)
                  </p>
                </div>

                <button onClick={handleCalculate} className="w-full bg-[var(--brand-green)] text-white py-4 rounded-xl font-bold text-lg hover:bg-[var(--brand-green-light)] transition-colors shadow-lg hover:shadow-xl">
                  احسب الزكاة
                </button>
              </motion.div>
            )}

            {/* Fitr Zakat */}
            {activeTab === 'fitr' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-8 border border-[var(--border)] shadow-lg"
              >
                <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6">زكاة الفطر</h2>
                <div className="bg-gradient-to-r from-[var(--brand-green)]/10 to-[var(--brand-green)]/5 p-6 rounded-xl mb-6">
                  <p className="text-lg text-[var(--foreground)]">
                    <strong>مقدار زكاة الفطر:</strong> {NISAB.fitr} ر.ع للشخص الواحد
                  </p>
                  <p className="text-sm text-[var(--muted-foreground)] mt-2">
                    تُقدر بقيمة 2.5 كيلو جرام من القمح أو ما يعادله من الأرز/التمر
                  </p>
                </div>

                <div className="mb-6">
                  <label htmlFor="familyMembers" className="block text-lg font-semibold text-[var(--foreground)] mb-2">
                    عدد أفراد الأسرة
                  </label>
                  <input
                    id="familyMembers"
                    type="number"
                    value={familyMembers || ''}
                    onChange={(e) => setFamilyMembers(Number(e.target.value))}
                    className="w-full p-4 border-2 border-[var(--border)] rounded-xl text-lg focus:ring-2 focus:ring-[var(--brand-green)]/30 outline-none transition-all"
                    placeholder="أدخل العدد"
                    min="1"
                  />
                </div>

                <button onClick={handleCalculate} className="w-full bg-[var(--brand-green)] text-white py-4 rounded-xl font-bold text-lg hover:bg-[var(--brand-green-light)] transition-colors shadow-lg hover:shadow-xl">
                  احسب الإجمالي
                </button>
              </motion.div>
            )}

            {/* Zakat Result */}
            {zakatResult !== null && zakatResult > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-8 mt-6 border-2 border-[var(--brand-green)] shadow-lg"
              >
                <div className="text-center mb-6">
                  <CheckCircle className="w-16 h-16 mx-auto mb-4 text-[var(--brand-green)]" />
                  <h3 className="text-2xl font-bold text-[var(--foreground)] mb-2">قيمة الزكاة المستحقة</h3>
                  <div className="text-5xl font-bold text-[var(--brand-green)] mb-2">
                    {zakatResult.toFixed(2)}
                  </div>
                  <p className="text-[var(--muted-foreground)]">ريال عماني</p>
                </div>

                <div className="bg-[var(--brand-green-pale)] p-6 rounded-xl mb-6">
                  <div className="flex items-start gap-3 mb-3">
                    <TrendingUp className="w-5 h-5 text-[var(--brand-green)] flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-[var(--brand-green)] mb-1">أثر زكاتك</h4>
                      <p className="text-sm text-[var(--muted-foreground)]">
                        بهذا المبلغ يمكنك إطعام {Math.floor(zakatResult / 2)} شخص لمدة يوم، أو دعم أسرة متكاملة لأسبوع كامل
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleDonateZakat}
                  className="w-full bg-[var(--brand-green)] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[var(--brand-green-light)] transition-colors shadow-lg hover:shadow-xl"
                >
                  <Heart className="w-5 h-5" fill="white" />
                  أخرج زكاتك الآن
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </motion.div>
            )}

            {zakatResult === 0 && zakatResult !== null && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-8 mt-6 border border-[var(--border)] shadow-lg"
              >
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-[var(--brand-gold-pale)] rounded-full flex items-center justify-center">
                    <Calculator className="w-8 h-8 text-[var(--brand-gold)]" />
                  </div>
                  <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">لم يبلغ النصاب الشرعي</h3>
                  <p className="text-[var(--muted-foreground)]">
                    المبلغ المملوك لم يبلغ النصاب الشرعي، لا تجب عليك الزكاة.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Reminder Tool */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-8 mt-6 border border-[var(--border)] shadow-lg"
            >
              <h3 className="text-xl font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
                <Bell className="w-6 h-6 text-[var(--brand-green)]" />
                تذكير بموعد الزكاة
              </h3>
              <p className="text-[var(--muted-foreground)] mb-4">
                أدخل بريدك الإلكتروني ليتم تذكيرك في نفس التاريخ الهجري من العام القادم
              </p>
              <div className="flex gap-3">
                <input
                  type="email"
                  value={reminderEmail}
                  onChange={(e) => setReminderEmail(e.target.value)}
                  className="flex-1 p-4 border-2 border-[var(--border)] rounded-xl focus:ring-2 focus:ring-[var(--brand-green)]/30 outline-none transition-all"
                  placeholder="البريد الإلكتروني"
                />
                <button
                  onClick={handleReminderSave}
                  className="bg-[var(--brand-green)] text-white px-6 py-4 rounded-xl font-bold hover:bg-[var(--brand-green-light)] transition-colors shadow-lg"
                >
                  {reminderSaved ? 'تم الحفظ ✅' : 'تذكير'}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content Source Indicator (dev only) */}
      {import.meta.env?.DEV && (
        <div className="fixed bottom-4 left-4 z-50 bg-purple-600 text-white text-xs px-3 py-2 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${contentSource === 'sanity' ? 'bg-green-400' : 'bg-yellow-400'}`} />
            <span>{contentSource === 'sanity' ? 'Sanity CMS' : 'Static Content'}</span>
          </div>
        </div>
      )}
    </div>
  );
}