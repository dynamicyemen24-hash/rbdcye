import { ReactNode } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area } from "recharts";

interface InteractiveChartProps {
  data: { name: string; value: number }[];
  height?: number;
  type?: "line" | "area";
  children?: ReactNode;
}

export function InteractiveChart({ data, height = 240, type = "line" }: InteractiveChartProps) {
  return (
    <div className="bg-white/80 dark:bg-[var(--brand-green-dark)]/80 rounded-xl p-4 shadow-sm border border-[var(--border)]">
      <div style={{ width: "100%", height }}>
        <ResponsiveContainer width="100%" height="100%">
          {type === "area" ? (
            <AreaChart data={data} margin={{ top: 6, right: 12, left: -12, bottom: 6 }}>
              <defs>
                <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="var(--brand-green)" stopOpacity={0.18} />
                  <stop offset="100%" stopColor="var(--brand-green)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.06} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="var(--brand-green)" fill="url(#areaGradient)" />
            </AreaChart>
          ) : (
            <LineChart data={data} margin={{ top: 6, right: 12, left: -12, bottom: 6 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.06} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="var(--brand-green)" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default InteractiveChart;


