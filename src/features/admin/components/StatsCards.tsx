import { MessageSquare, Clock, CheckCircle, Archive, Reply } from "lucide-react";
import React from "react";

interface StatsCardsProps {
  stats: {
    total: number;
    new: number;
    read: number;
    replied: number;
    archived: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    { label: "الكل", value: stats.total, icon: MessageSquare, color: "bg-blue-50 text-blue-600" },
    { label: "جديد", value: stats.new, icon: Clock, color: "bg-red-50 text-red-600" },
    { label: "مقروء", value: stats.read, icon: CheckCircle, color: "bg-gray-50 text-gray-600" },
    { label: "تم الرد", value: stats.replied, icon: Reply, color: "bg-green-50 text-green-600" },
    { label: "مؤرشف", value: stats.archived, icon: Archive, color: "bg-yellow-50 text-yellow-600" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card, index) => (
        <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${card.color}`}>
              <card.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{card.label}</p>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
