import InteractiveChart from "./ui/InteractiveChart";
import ProgressBar from "./ui/ProgressBar";
import { StatCard } from "./ui/StatCard";

const sampleSpark = [
  { x: "1", y: 20 },
  { x: "2", y: 45 },
  { x: "3", y: 38 },
  { x: "4", y: 52 },
  { x: "5", y: 66 },
  { x: "6", y: 72 },
  { x: "7", y: 90 },
];

const sampleChart = [
  { name: "ينا", value: 120 },
  { name: "فبر", value: 210 },
  { name: "مار", value: 150 },
  { name: "أبر", value: 300 },
  { name: "ماي", value: 240 },
  { name: "يون", value: 380 },
];

export default function AdminDashboardExtras() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="الزوار هذا الشهر" value="3,420" delta="+12%" sparkData={sampleSpark as any} />
        <StatCard title="التبرعات (ر.ي)" value="72,300" delta="+8%" sparkData={sampleSpark as any} />
        <StatCard title="المشاريع النشطة" value={24} delta="-1%" sparkData={sampleSpark as any} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <InteractiveChart data={sampleChart} type="area" />
        </div>
        <div className="space-y-4">
          <div className="bg-white/80 dark:bg-[var(--brand-green-dark)]/80 rounded-xl p-4 shadow-sm border border-[var(--border)]">
            <h4 className="text-sm text-[var(--muted)]">أداء الحملة</h4>
            <div className="mt-3">
              <ProgressBar value={68} max={100} />
            </div>
          </div>

          <div className="bg-white/80 dark:bg-[var(--brand-green-dark)]/80 rounded-xl p-4 shadow-sm border border-[var(--border)]">
            <h4 className="text-sm text-[var(--muted)]">معدل إتمام النماذج</h4>
            <div className="mt-3">
              <ProgressBar value={87} max={100} size="sm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


