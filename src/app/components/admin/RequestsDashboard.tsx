import {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  FileText, MessageSquareWarning, Send, Users, CheckCircle2, Clock,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  AlertTriangle, Filter, ChevronDown, Search, Eye, Edit3, BarChart3
} from 'lucide-react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, memo } from 'react';

import { servicesDBService, type BeneficiaryRequest, type ComplaintSuggestion, type ServiceApplication } from '@/services/beneficiary/services-db.service';

type Tab = 'requests' | 'feedback' | 'applications' | 'stats';

const STATUS_LABELS: Record<string, string> = {
  pending: 'قيد الانتظار', under_review: 'قيد المراجعة', approved: 'مقبول', in_progress: 'قيد التنفيذ',
  completed: 'مكتمل', rejected: 'مرفوض', new: 'جديد', acknowledged: 'تم التأكيد',
  investigating: 'قيد التحقيق', resolved: 'تم الحل', closed: 'مغلق',
  submitted: 'مقدم', documents_needed: 'يحتاج مستندات',
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  under_review: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  approved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  in_progress: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  new: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  acknowledged: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  investigating: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  resolved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  closed: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
  submitted: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  documents_needed: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
};

export const RequestsDashboard = memo(function RequestsDashboard() {
  const [tab, setTab] = useState<Tab>('requests');
  const [requests, setRequests] = useState<BeneficiaryRequest[]>([]);
  const [feedback, setFeedback] = useState<ComplaintSuggestion[]>([]);
  const [applications, setApplications] = useState<ServiceApplication[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedItem, setSelectedItem] = useState<BeneficiaryRequest | ComplaintSuggestion | ServiceApplication | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [detailOpen, setDetailOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      const [r, f, a] = await Promise.all([
        servicesDBService.getRequests(),
        servicesDBService.getFeedback(),
        servicesDBService.getApplications(),
      ]);
      setRequests(r);
      setFeedback(f);
      setApplications(a);
      setLoading(false);
    };
    loadAll();
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: string, type: 'request' | 'feedback' | 'application') => {
    if (type === 'request') {
      await servicesDBService.updateRequestStatus(id, newStatus);
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    } else if (type === 'feedback') {
      await servicesDBService.updateFeedbackStatus(id, newStatus);
      setFeedback(prev => prev.map(f => f.id === id ? { ...f, status: newStatus } : f));
    } else {
      await servicesDBService.updateApplicationStatus(id, newStatus);
      setApplications(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    }
  };

  const filterItems = <T extends { status?: string; full_name?: string; applicant_name?: string; subject?: string }>(items: T[]): T[] => {
    return items.filter(item => {
      const matchesStatus = !statusFilter || item.status === statusFilter;
      const searchLower = search.toLowerCase();
      const name = ('full_name' in item ? item.full_name : '') || ('applicant_name' in item ? item.applicant_name : '') || '';
      const subject = ('subject' in item ? item.subject : '') || '';
      const matchesSearch = !search || name.toLowerCase().includes(searchLower) || subject.toLowerCase().includes(searchLower);
      return matchesStatus && matchesSearch;
    });
  };

  const tabs = [
    { id: 'requests' as Tab, label: 'طلبات المستفيدين', icon: FileText, count: requests.length },
    { id: 'feedback' as Tab, label: 'الشكاوى والمقترحات', icon: MessageSquareWarning, count: feedback.length },
    { id: 'applications' as Tab, label: 'طلبات الخدمات', icon: Send, count: applications.length },
    { id: 'stats' as Tab, label: 'الإحصائيات', icon: BarChart3, count: null },
  ];

  const requestStats = { total: requests.length, pending: requests.filter(r => r.status === 'pending').length, completed: requests.filter(r => r.status === 'completed').length };
  const feedbackStats = { total: feedback.length, complaints: feedback.filter(f => f.type === 'complaint').length, suggestions: feedback.filter(f => f.type === 'suggestion').length, resolved: feedback.filter(f => f.status === 'resolved' || f.status === 'closed').length };
  const appStats = { total: applications.length, pending: applications.filter(a => a.status === 'submitted').length, approved: applications.filter(a => a.status === 'approved').length };

  return (
    <div dir="rtl" className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto rounded-xl bg-[var(--muted)] p-1">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-bold transition-all ${tab === t.id ? 'bg-[var(--card)] text-[var(--foreground)] shadow-sm' : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'}`}>
            <t.icon className="h-4 w-4" />
            {t.label}
            {t.count !== null && <span className="rounded-full bg-[var(--brand-green)]/10 px-2 py-0.5 text-xs text-[var(--brand-green)]">{t.count}</span>}
          </button>
        ))}
      </div>

      {/* Search & Filter */}
      {tab !== 'stats' && (
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] py-2.5 pr-10 pl-4 text-sm" placeholder="بحث بالاسم أو الموضوع..." />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-sm">
            <option value="">جميع الحالات</option>
            {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
      )}

      {/* Stats Tab */}
      {tab === 'stats' && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
            <h3 className="text-sm font-bold text-[var(--muted-foreground)]">طلبات المستفيدين</h3>
            <p className="mt-2 text-3xl font-bold text-[var(--foreground)]">{requestStats.total}</p>
            <div className="mt-3 flex gap-3 text-xs">
              <span className="text-amber-500">⏳ {requestStats.pending} قيد الانتظار</span>
              <span className="text-green-500">✓ {requestStats.completed} مكتمل</span>
            </div>
          </div>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
            <h3 className="text-sm font-bold text-[var(--muted-foreground)]">الشكاوى والمقترحات</h3>
            <p className="mt-2 text-3xl font-bold text-[var(--foreground)]">{feedbackStats.total}</p>
            <div className="mt-3 flex gap-3 text-xs">
              <span className="text-red-500">⚠ {feedbackStats.complaints} شكوى</span>
              <span className="text-amber-500">💡 {feedbackStats.suggestions} اقتراح</span>
              <span className="text-green-500">✓ {feedbackStats.resolved} محلولة</span>
            </div>
          </div>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
            <h3 className="text-sm font-bold text-[var(--muted-foreground)]">طلبات الخدمات</h3>
            <p className="mt-2 text-3xl font-bold text-[var(--foreground)]">{appStats.total}</p>
            <div className="mt-3 flex gap-3 text-xs">
              <span className="text-blue-500">📨 {appStats.pending} جديد</span>
              <span className="text-green-500">✓ {appStats.approved} مقبول</span>
            </div>
          </div>
        </div>
      )}

      {/* Requests Tab */}
      {tab === 'requests' && (
        <div className="space-y-2">
          {filterItems(requests).length === 0 ? (
            <div className="py-12 text-center text-[var(--muted-foreground)]">لا توجد طلبات</div>
          ) : (
            filterItems(requests).map(req => (
              <div key={req.id} className="flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 transition-all hover:shadow-md">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[var(--foreground)]">{req.full_name}</span>
                    <span className="text-xs text-[var(--muted-foreground)]">#{req.request_number}</span>
                  </div>
                  <p className="mt-1 text-sm text-[var(--muted-foreground)]">{req.request_type} — {req.governorate}</p>
                  <p className="mt-0.5 text-xs text-[var(--muted-foreground)] truncate">{req.description}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${STATUS_COLORS[req.status || 'pending']}`}>{STATUS_LABELS[req.status || 'pending']}</span>
                {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- precise: @typescript-eslint/no-non-null-assertion verified */}
                <select value={req.status} onChange={e => { if (!req.id) return; handleStatusUpdate(req.id, e.target.value, 'request'); }} className="shrink-0 rounded-lg border border-[var(--border)] bg-[var(--background)] px-2 py-1.5 text-xs">
                  {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
            ))
          )}
        </div>
      )}

      {/* Feedback Tab */}
      {tab === 'feedback' && (
        <div className="space-y-2">
          {filterItems(feedback).length === 0 ? (
            <div className="py-12 text-center text-[var(--muted-foreground)]">لا توجد رسائل</div>
          ) : (
            filterItems(feedback).map(item => (
              <div key={item.id} className="flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 transition-all hover:shadow-md">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {/* eslint-disable-next-line no-nested-ternary -- precise: no-nested-ternary verified */}
                    <span className="font-bold text-[var(--foreground)]">{item.full_name}</span>
                    {/* eslint-disable-next-line no-nested-ternary -- precise: no-nested-ternary verified */}
                    <span className={`rounded-full px-2 py-0.5 text-[0.65rem] font-bold ${item.type === 'complaint' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : item.type === 'suggestion' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                      {/* eslint-disable-next-line no-nested-ternary -- precise: no-nested-ternary verified */}
                      {item.type === 'complaint' ? 'شكوى' : item.type === 'suggestion' ? 'اقتراح' : item.type === 'feedback' ? 'ملاحظات' : 'استفسار'}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-bold text-[var(--foreground)]">{item.subject}</p>
                  {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- precise: @typescript-eslint/no-non-null-assertion verified */}
                  <p className="mt-0.5 text-xs text-[var(--muted-foreground)] truncate">{item.description}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${STATUS_COLORS[item.status || 'new']}`}>{STATUS_LABELS[item.status || 'new']}</span>
                {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- precise: @typescript-eslint/no-non-null-assertion verified */}
                <select value={item.status} onChange={e => { if (!item.id) return; handleStatusUpdate(item.id, e.target.value, 'feedback'); }} className="shrink-0 rounded-lg border border-[var(--border)] bg-[var(--background)] px-2 py-1.5 text-xs">
                  {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
            ))
          )}
        </div>
      )}

      {/* Applications Tab */}
      {tab === 'applications' && (
        <div className="space-y-2">
          {filterItems(applications).length === 0 ? (
            <div className="py-12 text-center text-[var(--muted-foreground)]">لا توجد طلبات</div>
          ) : (
            filterItems(applications).map(app => (
              <div key={app.id} className="flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 transition-all hover:shadow-md">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[var(--foreground)]">{app.applicant_name}</span>
                    <span className="text-xs text-[var(--muted-foreground)]">{app.applicant_governorate}</span>
                  {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- precise: @typescript-eslint/no-non-null-assertion verified */}
                  </div>
                  <p className="mt-1 text-xs text-[var(--muted-foreground)]">هاتف: {app.applicant_phone}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${STATUS_COLORS[app.status || 'submitted']}`}>{STATUS_LABELS[app.status || 'submitted']}</span>
                {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- precise: @typescript-eslint/no-non-null-assertion verified */}
                <select value={app.status} onChange={e => { if (!app.id) return; handleStatusUpdate(app.id, e.target.value, 'application'); }} className="shrink-0 rounded-lg border border-[var(--border)] bg-[var(--background)] px-2 py-1.5 text-xs">
                  {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
});
