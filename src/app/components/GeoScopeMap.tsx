// GeoScopeMap - Interactive geographic map showing project reach
import { Map, Navigation, Grid3x3 } from "lucide-react";
import { useState } from "react";

interface GeoScopeMapProps {
  setCurrentPage?: (page: string) => void;
}

interface Governorate {
  id: string;
  name: string;
  lat: number;
  lng: number;
  projects: number;
  beneficiaries: number;
  color: string;
  sector?: string;
}

// Yemen governorates with project data
const YEMEN_GOVERNORATES: Governorate[] = [
  { id: "sanaa", name: "صنعاء", lat: 15.3694, lng: 44.1917, projects: 0, beneficiaries: 0, color: "var(--brand-green)", sector: "إغاثة وأمن غذائي" },
  { id: "taiz", name: "تعز", lat: 13.7833, lng: 44.1333, projects: 0, beneficiaries: 0, color: "var(--brand-gold)", sector: "مياه وإصحاح بيئي" },
  { id: "hodeidah", name: "الحديدة", lat: 15.3433, lng: 43.2333, projects: 0, beneficiaries: 0, color: "#2563EB", sector: "صحة واستجابة طارئة" },
  { id: "hajjah", name: "حجة", lat: 16.0933, lng: 43.8944, projects: 0, beneficiaries: 0, color: "#7C3AED", sector: "إغاثة وسقيا ماء" },
  { id: "dhale", name: "ذمار", lat: 13.9333, lng: 44.8667, projects: 0, beneficiaries: 0, color: "#E74C3C", sector: "تعليم وتنمية" },
  { id: "abyan", name: "ابين", lat: 13.9933, lng: 45.8667, projects: 0, beneficiaries: 0, color: "#F59E0B", sector: "تمكين اقتصادي" },
  { id: "shabwah", name: "شبوة", lat: 14.8500, lng: 45.9667, projects: 0, beneficiaries: 0, color: "#10B981", sector: "إغاثة وأمن غذائي" },
  { id: "hadramawt", name: "حضرموت", lat: 15.4000, lng: 48.3667, projects: 0, beneficiaries: 0, color: "#8B5CF6", sector: "تعليم وتنمية" },
  { id: "adDalis", name: "الضالع", lat: 14.6667, lng: 47.3333, projects: 0, beneficiaries: 0, color: "#06B6D4", sector: "مياه وإصحاح بيئي" },
  { id: "lahij", name: "لحج", lat: 13.2000, lng: 44.8000, projects: 0, beneficiaries: 0, color: "#EC4899", sector: "إغاثة وسقيا ماء" },
  { id: "mahrah", name: "المحويت", lat: 16.7333, lng: 52.6667, projects: 0, beneficiaries: 0, color: "#FFD700", sector: "تمكين اقتصادي" },
  { id: "rijal", name: "ريمة", lat: 17.5167, lng: 43.5667, projects: 0, beneficiaries: 0, color: "#F97316", sector: "صحة واستجابة طارئة" },
];

export function GeoScopeMap({ setCurrentPage = () => {} }: GeoScopeMapProps) {
  const [viewMode, setViewMode] = useState<"map" | "grid">("map");
  const [, setSelectedGovernorate] = useState<string | null>(null);
  const [hoveredGovernorate, setHoveredGovernorate] = useState<string | null>(null);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);

  const totalProjects = YEMEN_GOVERNORATES.reduce((sum, g) => sum + g.projects, 0);
  const totalBeneficiaries = YEMEN_GOVERNORATES.reduce((sum, g) => sum + g.beneficiaries, 0);
  const filteredGovernorates = selectedSector
    ? YEMEN_GOVERNORATES.filter((g) => g.sector === selectedSector)
    : YEMEN_GOVERNORATES;

  return (
    <section id="geosope-map" className="py-24 md:py-32 bg-gradient-to-b from-[var(--brand-green-pale)]/10 to-white relative overflow-hidden">
      <div className="absolute inset-0 pattern-zellij-light pointer-events-none" />
      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block mb-3 text-[var(--brand-green)] border border-[var(--brand-green)]/30 bg-[var(--brand-green-pale)] px-4 py-1 rounded-full" style={{ fontSize: "0.8rem", fontWeight: 600 }}>
            الواقع الجغرافي
          </span>
          <h2 className="text-4xl font-bold mb-4">
            خريطة <span className="text-[var(--brand-green)]">الأثر</span> المؤسسي
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            توثيق انتشار مشاريعنا وأثرنا في المحافظات اليمنية
          </p>
        </div>

        {/* Sector Filter */}
        <div className="text-center mb-6">
          <p className="text-sm text-slate-500 font-medium mb-3">القطاع</p>
          <div className="inline-flex gap-2">
            <button
              onClick={() => setSelectedSector(null)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                !selectedSector
                  ? 'bg-[var(--brand-green)] text-white'
                  : 'bg-white text-[var(--muted-foreground)] border border-slate-200'
              }`}
            >
              الكل
            </button>
            {['إغاثة وأمن غذائي', 'مياه وإصحاح بيئي', 'صحة واستجابة طارئة', 'إغاثة وسقيا ماء', 'تعليم وتنمية', 'تمكين اقتصادي'].map((sector) => {
              const sectorColor: Record<string, string> = {
                'إغاثة وأمن غذائي': 'var(--brand-green)',
                'مياه وإصحاح بيئي': 'var(--brand-blue)',
                'صحة واستجابة طارئة': 'var(--brand-green)',
                'إغاثة وسقيا ماء': 'var(--brand-gold)',
                'تعليم وتنمية': 'var(--brand-purple)',
                'تمكين اقتصادي': 'var(--brand-gold)',
              };
              const isSelected = selectedSector === sector;
              return (
                <button
                  key={sector}
                  onClick={() => setSelectedSector(sector)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                    isSelected
                      ? `bg-${Object.keys(sectorColor).find(k => sectorColor[k] === sectorColor[sector]) ?? 'brand-green'} text-white`
                      : 'bg-white text-[var(--muted-foreground)] border border-slate-200'}
                  }`}
                >
                  {sector}
                </button>
              );
            })}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 max-w-4xl mx-auto">
          <div className="text-center p-4 bg-white rounded-xl border border-[var(--border)] shadow-sm">
            <div className="text-2xl font-bold text-[var(--brand-green)]">{YEMEN_GOVERNORATES.length}</div>
            <div className="text-sm text-[var(--muted-foreground)]">محافظة</div>
          </div>
          <div className="text-center p-4 bg-white rounded-xl border border-[var(--border)] shadow-sm">
            <div className="text-2xl font-bold text-[var(--brand-gold)]">{totalProjects}</div>
            <div className="text-sm text-[var(--muted-foreground)]">مشروع نشط</div>
          </div>
          <div className="text-center p-4 bg-white rounded-xl border border-[var(--border)] shadow-sm">
            <div className="text-2xl font-bold text-blue-600">{totalBeneficiaries.toLocaleString('ar-SA')}</div>
            <div className="text-sm text-[var(--muted-foreground)]">مستفيد</div>
          </div>
          <div className="text-center p-4 bg-white rounded-xl border border-[var(--border)] shadow-sm">
            <div className="text-2xl font-bold text-purple-600">+عشرات</div>
            <div className="text-sm text-[var(--muted-foreground)]">شريك محلي</div>
          </div>
        </div>

        {/* View Switch */}
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-lg p-1 border border-[var(--border)] inline-flex">
            <button
              onClick={() => setViewMode("map")}
              className={`px-4 py-2 rounded-md transition-all flex items-center gap-2 text-sm ${
                viewMode === "map"
                  ? "bg-[var(--brand-green)] text-white"
                  : "text-[var(--foreground)] hover:bg-[var(--muted)]"
              }`}
            >
              <Map className="w-4 h-4" />
              الخريطة
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`px-4 py-2 rounded-md transition-all flex items-center gap-2 text-sm ${
                viewMode === "grid"
                  ? "bg-[var(--brand-green)] text-white"
                  : "text-[var(--foreground)] hover:bg-[var(--muted)]"
              }`}
            >
              <Grid3x3 className="w-4 h-4" />
              الشبكة
            </button>
          </div>
        </div>

        {/* Map View */}
        {viewMode === "map" && (
          <div className="max-w-5xl mx-auto">
            <div className="relative bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-8 border border-[var(--border)] overflow-hidden min-h-[400px]">
              {/* Map Background */}
              <div className="absolute inset-0 opacity-20">
                <svg viewBox="0 0 800 600" className="w-full h-full" preserveAspectRatio="none">
                  {/* Simplified Yemen map outline */}
                  <path
                    d="M200,100 L600,100 L650,200 L600,400 L250,500 L150,350 Z"
                    fill="none"
                    stroke="var(--brand-green)"
                    strokeWidth="2"
                  />
                </svg>
              </div>

              {/* Governorates as dots */}
              <div className="relative grid grid-cols-4 gap-4 md:grid-cols-6">
                {filteredGovernorates.map((governorate) => (
                  <button
                    key={governorate.id}
                    onClick={() => setSelectedGovernorate(governorate.id)}
                    onMouseEnter={() => setHoveredGovernorate(governorate.id)}
                    onMouseLeave={() => setHoveredGovernorate(null)}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/80 backdrop-blur-sm border border-[var(--border)] hover:shadow-md transition-all"
                    style={{ 
                      transform: hoveredGovernorate === governorate.id ? 'scale(1.05)' : 'scale(1)',
                      borderColor: hoveredGovernorate === governorate.id ? governorate.color : undefined
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-md"
                      style={{ backgroundColor: governorate.color }}
                    >
                      {governorate.projects}
                    </div>
                    <span className="text-xs font-medium text-center" style={{ maxWidth: "80px" }}>
                      {governorate.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Grid View */}
        {viewMode === "grid" && (
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredGovernorates.map((governorate) => (
                <div
                  key={governorate.id}
                  className="bg-white rounded-xl p-5 border border-[var(--border)] hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-[var(--foreground)]">{governorate.name}</h3>
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: governorate.color }}
                    >
                      {governorate.projects}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--muted-foreground)]">المشاريع</span>
                      <span className="font-medium">{governorate.projects}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--muted-foreground)]">المستفيدون</span>
                      <span className="font-medium">{governorate.beneficiaries.toLocaleString('ar-SA')}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setCurrentPage("projects")}
                    className="mt-4 w-full py-2 text-xs text-[var(--brand-green)] hover:bg-[var(--brand-green-pale)] rounded-lg transition-colors"
                  >
                    عرض المشاريع
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-12">
          <button
            onClick={() => setCurrentPage("transparency")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--brand-green)] text-white rounded-lg hover:bg-[var(--brand-green-light)] transition-colors"
          >
            <Navigation className="w-4 h-4" />
            استكشاف تقارير الانجاز
          </button>
        </div>
      </div>
    </section>
  );
}

