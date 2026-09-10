import { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Utensils, Home, Droplets, Heart, Stethoscope, GraduationCap, AlertTriangle,
  Users, ChevronDown, ChevronUp, FileText, Send, CheckCircle2, Loader2, MapPin, X
} from 'lucide-react';
import { servicesDBService, type ServiceCatalog, type ServiceApplication } from '@/services/beneficiary/services-db.service';

const CATEGORY_ICONS: Record<string, typeof Utensils> = {
  food: Utensils, shelter: Home, water: Droplets, medical: Stethoscope,
  educational: GraduationCap, assistance: Heart,
};

const CATEGORY_COLORS: Record<string, string> = {
  food: 'bg-amber-500', shelter: 'bg-purple-500', water: 'bg-cyan-500',
  medical: 'bg-red-500', educational: 'bg-blue-500', assistance: 'bg-[var(--brand-green)]',
};

const GOVERNORATES = servicesDBService.getGovernorates();

const FALLBACK_SERVICES: ServiceCatalog[] = [
  { id: '1', name: 'سلة غذائية طارئة', description: 'سلة غذائية متكاملة تكفي أسرة لمدة شهر', category: 'food', eligibility: 'أي أسرة تعاني من نقص غذائي', required_documents: 'هوية شخصية، إثبات السكن', available_governorates: GOVERNORATES, application_count: 342 },
  { id: '2', name: 'كسوة شتوية', description: 'عباءة شتوية كاملة لكل فرد', category: 'shelter', eligibility: 'الأسر في المناطق الجبلية', required_documents: 'هوية شخصية', available_governorates: ['صنعاء', 'صعدة', 'إب', 'تعز'], application_count: 187 },
  { id: '3', name: 'حفر بئر مياه نقية', description: 'بئر مياه عميقة بالطاقة الشمسية', category: 'water', eligibility: 'تجمع سكاني يعاني من نقص المياه', required_documents: 'PERMITS البلدية', available_governorates: ['مأرب', 'شبوة', 'حضرموت', 'البيضاء'], application_count: 23 },
  { id: '4', name: 'كفالة يتيم شهري', description: 'دعم شهري لليتيم يشمل التعليم والعلاج', category: 'assistance', eligibility: 'أيتام فقدوا الوالد', required_documents: 'شهادة وفاة، شهادة ميلاد', available_governorates: GOVERNORATES, application_count: 456 },
  { id: '5', name: 'تأمين طبي مجاني', description: 'تغطية تكاليف العلاج والأدوية', category: 'medical', eligibility: 'أولوية للأسر غير المؤممة', required_documents: 'تشخيص طبي، فاتورة', available_governorates: ['صنعاء', 'عدن', 'تعز', 'إب'], application_count: 234 },
  { id: '6', name: 'دفء تعليمي', description: ' Cruiser + كتب + قرطاسية', category: 'educational', eligibility: 'طلاب من أسر غير قادرة', required_documents: 'شهادة ميلاد، كشف دراسي', available_governorates: GOVERNORATES, application_count: 567 },
  { id: '7', name: 'مساعدات طوارئ كوارث', description: 'حقيبة طوارئ شاملة للمتضررين', category: 'assistance', eligibility: 'متضررون من كارثة', required_documents: 'إثبات التضرر', available_governorates: ['صنعاء', 'تعز', 'لحج', 'أبين'], application_count: 89 },
  { id: '8', name: 'برنامج تأهيل النساء', description: 'تدريب مهني + دعم مالي للنساء', category: 'assistance', eligibility: 'نساء فوق ١٨ سنة', required_documents: 'هوية شخصية', available_governorates: ['صنعاء', 'عدن', 'تعز', 'إب'], application_count: 134 },
];

interface ApplicationModal {
  open: boolean;
  service: ServiceCatalog | null;
}

export const ServiceCatalogPage = memo(function ServiceCatalogPage() {
  const [services, setServices] = useState<ServiceCatalog[]>(FALLBACK_SERVICES);
  const [filter, setFilter] = useState('all');
  const [modal, setModal] = useState<ApplicationModal>({ open: false, service: null });
  const [expanded, setExpanded] = useState<string | null>(null);
  const [appForm, setAppForm] = useState({ applicant_name: '', applicant_phone: '', applicant_governorate: '', additional_info: '' });
  const [submitting, setSubmitting] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    const load = async () => {
      const data = await servicesDBService.getServices();
      if (data.length > 0) setServices(data);
    };
    load();
  }, []);

  const categories = [...new Set(services.map(s => s.category))];
  const filtered = filter === 'all' ? services : services.filter(s => s.category === filter);

  const handleApply = async () => {
    if (!appForm.applicant_name || !appForm.applicant_phone || !appForm.applicant_governorate || !modal.service) return;
    setSubmitting(true);
    const result = await servicesDBService.submitApplication({
      service_id: modal.service.id!,
      applicant_name: appForm.applicant_name,
      applicant_phone: appForm.applicant_phone,
      applicant_governorate: appForm.applicant_governorate,
      additional_info: appForm.additional_info || undefined,
    });
    setSubmitting(false);
    if (result.success) setApplied(true);
  };

  const openApply = (service: ServiceCatalog) => {
    setModal({ open: true, service });
    setApplied(false);
    setAppForm({ applicant_name: '', applicant_phone: '', applicant_governorate: '', additional_info: '' });
  };

  return (
    <div className="min-h-screen bg-[var(--background)] py-24" dir="rtl">
      <div className="mx-auto max-w-7xl px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h1 className="text-3xl font-bold text-[var(--foreground)]">الخدمات المتوفرة</h1>
          <p className="mt-2 text-[var(--muted-foreground)]">اختر الخدمة المناسبة وقدم طلبك مباشرة</p>
        </motion.div>

        {/* Category Tabs */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          <button onClick={() => setFilter('all')} className={`rounded-xl px-4 py-2 text-sm font-bold transition-all ${filter === 'all' ? 'bg-[var(--brand-green)] text-white' : 'bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--muted)]/80'}`}>
            الكل ({services.length})
          </button>
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)} className={`rounded-xl px-4 py-2 text-sm font-bold transition-all ${filter === cat ? 'bg-[var(--brand-green)] text-white' : 'bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--muted)]/80'}`}>
              {cat === 'food' ? 'غذائي' : cat === 'shelter' ? 'سكن' : cat === 'water' ? 'مياه' : cat === 'medical' ? 'طبي' : cat === 'educational' ? 'تعليمي' : 'إنساني'} ({services.filter(s => s.category === cat).length})
            </button>
          ))}
        </div>

        {/* Service Cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((service, i) => {
            const Icon = CATEGORY_ICONS[service.category] || Heart;
            const isExpanded = expanded === service.id;
            return (
              <motion.div key={service.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lg">
                <div className="p-5">
                  <div className="flex items-start gap-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${CATEGORY_COLORS[service.category]}`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-[var(--foreground)]">{service.name}</h3>
                      <p className="mt-1 text-sm text-[var(--muted-foreground)]">{service.description}</p>
                    </div>
                  </div>

                  {service.eligibility && (
                    <div className="mt-3 rounded-lg bg-[var(--muted)] p-3 text-xs text-[var(--muted-foreground)]">
                      <span className="font-bold text-[var(--foreground)]">الشروط: </span>{service.eligibility}
                    </div>
                  )}

                  <div className="mt-3 flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
                    <MapPin className="h-3 w-3" />
                    <span>{service.available_governorates?.join(' - ')}</span>
                  </div>

                  {service.application_count !== undefined && service.application_count > 0 && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-[var(--brand-green)]">
                      <Users className="h-3 w-3" />
                      <span className="font-bold">{service.application_count}</span> طلب سابق
                    </div>
                  )}
                </div>

                <div className="flex border-t border-[var(--border)]">
                  <button onClick={() => setExpanded(isExpanded ? null : service.id!)} className="flex flex-1 items-center justify-center gap-1 py-3 text-sm font-bold text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)]">
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    التفاصيل
                  </button>
                  <button onClick={() => openApply(service)} className="flex flex-1 items-center justify-center gap-1 border-r border-[var(--border)] py-3 text-sm font-bold text-[var(--brand-green)] transition-colors hover:bg-[var(--brand-green)]/5">
                    <Send className="h-4 w-4" /> تقديم طلب
                  </button>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden border-t border-[var(--border)]">
                      <div className="p-4 text-sm">
                        <h4 className="font-bold text-[var(--foreground)]">المستندات المطلوبة:</h4>
                        <p className="mt-1 text-[var(--muted-foreground)]">{service.required_documents}</p>
                        <h4 className="mt-3 font-bold text-[var(--foreground)]">المحافظات المتاحة:</h4>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {service.available_governorates?.map(g => (
                            <span key={g} className="rounded-full bg-[var(--muted)] px-2 py-0.5 text-xs text-[var(--muted-foreground)]">{g}</span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Application Modal */}
      <AnimatePresence>
        {modal.open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setModal({ open: false, service: null })}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} onClick={e => e.stopPropagation()} className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6" dir="rtl">
              {applied ? (
                <div className="text-center">
                  <CheckCircle2 className="mx-auto h-16 w-16 text-[var(--brand-green)]" />
                  <h3 className="mt-4 text-xl font-bold text-[var(--foreground)]">تم تقديم الطلب بنجاح</h3>
                  <p className="mt-2 text-sm text-[var(--muted-foreground)]">سنتواصل معك خلال ٢٤-٤٨ ساعة</p>
                  <button onClick={() => setModal({ open: false, service: null })} className="mt-6 rounded-xl bg-[var(--brand-green)] px-6 py-2 font-bold text-white">إغلاق</button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-[var(--foreground)]">طلب خدمة: {modal.service?.name}</h3>
                    <button onClick={() => setModal({ open: false, service: null })} className="p-1 hover:bg-[var(--muted)] rounded"><X className="h-5 w-5" /></button>
                  </div>
                  <div className="mt-4 space-y-3">
                    <div>
                      <label className="mb-1 block text-sm font-medium">الاسم الكامل *</label>
                      <input type="text" value={appForm.applicant_name} onChange={e => setAppForm(p => ({ ...p, applicant_name: e.target.value }))} className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm" placeholder="الاسم" />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">رقم الهاتف *</label>
                      <input type="tel" value={appForm.applicant_phone} onChange={e => setAppForm(p => ({ ...p, applicant_phone: e.target.value }))} className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm" placeholder="770123456" dir="ltr" />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">المحافظة *</label>
                      <select value={appForm.applicant_governorate} onChange={e => setAppForm(p => ({ ...p, applicant_governorate: e.target.value }))} className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm">
                        <option value="">اختر</option>
                        {GOVERNORATES.map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">معلومات إضافية</label>
                      <textarea rows={3} value={appForm.additional_info} onChange={e => setAppForm(p => ({ ...p, additional_info: e.target.value }))} className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm resize-none" placeholder="أي ملاحظات إضافية" />
                    </div>
                  </div>
                  <button onClick={handleApply} disabled={submitting || !appForm.applicant_name || !appForm.applicant_phone || !appForm.applicant_governorate} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--brand-green)] py-3 font-bold text-white disabled:opacity-50">
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    {submitting ? 'جاري الإرسال...' : 'تقديم الطلب'}
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
