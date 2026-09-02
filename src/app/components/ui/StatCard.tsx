import { ReactNode } from "react";
import { ResponsiveContainer, AreaChart, Area } from "recharts";

interface StatCardProps {
  title: string;
  value: string | number;
  delta?: string | number;
  children?: ReactNode;
  sparkData?: { x: string; y: number }[];
}

export function StatCard({ title, value, delta, children, sparkData = [] }: StatCardProps) {
  return (
    <div className="bg-white/80 dark:bg-[#0b1220]/80 rounded-xl p-4 shadow-sm border border-[var(--border)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs text-[var(--muted)]">{title}</div>
          <div className="mt-1 text-2xl font-bold leading-tight">{value}</div>
          {delta && <div className="text-sm text-[var(--muted)] mt-1">{delta}</div>}
        </div>
        <div className="w-24 h-12">
          {sparkData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparkData} syncId={title}>
                <Area type="monotone" dataKey="y" stroke="var(--brand-green)" fill="var(--brand-green)" fillOpacity={0.12} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
}

export default StatCard;


