import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, CheckCircle2, Users, FolderOpen, Heart, 
  Sparkles, Layers, Search, ArrowLeft, ShieldCheck, ChevronRight
} from 'lucide-react';
import { map as createMap, tileLayer, control, circleMarker, CircleMarker, Map as LeafletMap } from 'leaflet';
import 'leaflet/dist/leaflet.css';

export interface GovernorateProjectData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  projectsCount: number;
  beneficiaries: number;
  sector: string;
  sectorColor: string;
  projects: {
    title: string;
    category: string;
    beneficiaries: string;
    status: string;
    year: string;
  }[];
}

export const YEMEN_MAP_GOVERNORATES: GovernorateProjectData[] = [
  {
    id: "sanaa-city",
    name: "أمانة العاصمة - صنعاء",
    lat: 15.3694,
    lng: 44.1910,
    projectsCount: 14,
    beneficiaries: 28500,
    sector: "الإغاثة والأمن الغذائي",
    sectorColor: "#0F4C3A",
    projects: [
      { title: "مشروع السلال الغذائية الشهرية الدورية", category: "إغاثة", beneficiaries: "١٢,٠٠٠ مستفيد", status: "مستمر", year: "٢٠٢٥-٢٠٢٦" },
      { title: "مركز كفالة ورعاية الأيتام والأسر المعيلة", category: "كفالات", beneficiaries: "٤,٥٠٠ أسر", status: "منجز", year: "٢٠٢٥" },
      { title: "توزيع المساعدات الطبية الطارئة للمستشفيات", category: "صحة", beneficiaries: "١٢,٠٠٠ حالة", status: "مستمر", year: "٢٠٢٦" },
    ]
  },
  {
    id: "taiz",
    name: "تعز",
    lat: 13.5789,
    lng: 44.0194,
    projectsCount: 12,
    beneficiaries: 21200,
    sector: "المياه والإصلاح البيئي",
    sectorColor: "#0284C7",
    projects: [
      { title: "حفر وتجهيز آبار المياه بالطاقة الشمسية", category: "مياه", beneficiaries: "٩,٥٠٠ مستفيد", status: "منجز", year: "٢٠٢٥" },
      { title: "برنامج التمكين الاقتصادي للأسر المنتجة", category: "تمكين", beneficiaries: "٤٥٠ أسرة", status: "مستمر", year: "٢٠٢٦" },
      { title: "شاحنات سقيا الماء للمناطق الأشد عطشاً", category: "مياه", beneficiaries: "١١,٢٥٠ مستفيد", status: "مستمر", year: "٢٠٢٦" },
    ]
  },
  {
    id: "hodeidah",
    name: "الحديدة",
    lat: 14.7978,
    lng: 42.9545,
    projectsCount: 11,
    beneficiaries: 19400,
    sector: "الصحة والاستجابة الطارئة",
    sectorColor: "#0F4C3A",
    projects: [
      { title: "دعم مراكز سوء التغذية والأمومة", category: "صحة", beneficiaries: "٦,٨٠٠ حالة", status: "مستمر", year: "٢٠٢٥" },
      { title: "الوجبات الساخنة والسلال الإغاثية للنازحين", category: "إغاثة", beneficiaries: "٨,٢٠٠ مستفيد", status: "منجز", year: "٢٠٢٥" },
      { title: "خزانات المياه النقية الشاملة", category: "مياه", beneficiaries: "٤,٤٠٠ مستفيد", status: "مستمر", year: "٢٠٢٦" },
    ]
  },
  {
    id: "hajjah",
    name: "حجة",
    lat: 15.6942,
    lng: 43.6053,
    projectsCount: 9,
    beneficiaries: 14800,
    sector: "الإغاثة وسقيا الماء",
    sectorColor: "#C69E5A",
    projects: [
      { title: "تأسيس محطات تحلية وسقيا المياه", category: "مياه", beneficiaries: "٧,٠٠٠ مستفيد", status: "منجز", year: "٢٠٢٥" },
      { title: "السلال الغذائية للأسر المتعففة في الأرياف", category: "إغاثة", beneficiaries: "٧,٨٠٠ مستفيد", status: "مستمر", year: "٢٠٢٦" },
    ]
  },
  {
    id: "ibb",
    name: "إب",
    lat: 13.9667,
    lng: 44.1833,
    projectsCount: 8,
    beneficiaries: 13200,
    sector: "التعليم والتنمية",
    sectorColor: "#7C3AED",
    projects: [
      { title: "كفالة الطلاب المتميزين وطباعة الكتب", category: "تعليم", beneficiaries: "٣,٢٠٠ طالب", status: "مستمر", year: "٢٠٢٦" },
      { title: "تمليك وسائل الكسب والحرف اليدوية", category: "تمكين", beneficiaries: "٣٥٠ أسرة", status: "منجز", year: "٢٠٢٥" },
    ]
  },
  {
    id: "aden",
    name: "عدن",
    lat: 12.7855,
    lng: 45.0186,
    projectsCount: 10,
    beneficiaries: 17500,
    sector: "التمكين والخدمات الصحية",
    sectorColor: "#C69E5A",
    projects: [
      { title: "منح المشاريع الصغرى للأرامل والمعيلات", category: "تمكين", beneficiaries: "٥٠٠ أسرة", status: "مستمر", year: "٢٠٢٦" },
      { title: "القوافل الطبية المعاينة والأدوية المجانية", category: "صحة", beneficiaries: "٩,٠٠٠ حالة", status: "منجز", year: "٢٠٢٥" },
    ]
  },
  {
    id: "hadramaut",
    name: "حضرموت",
    lat: 14.5425,
    lng: 49.1242,
    projectsCount: 7,
    beneficiaries: 11000,
    sector: "التعليم والتنمية المستدامة",
    sectorColor: "#7C3AED",
    projects: [
      { title: "دعم وتجهيز المدارس والمراكز التعليمية", category: "تعليم", beneficiaries: "٤,١٠٠ طالب", status: "مستمر", year: "٢٠٢٦" },
      { title: "المساعدات الغذائية للأسر النائية", category: "إغاثة", beneficiaries: "٦,٩٠٠ مستفيد", status: "منجز", year: "٢٠٢٥" },
    ]
  },
  {
    id: "marib",
    name: "مأرب",
    lat: 15.4633,
    lng: 45.3250,
    projectsCount: 11,
    beneficiaries: 22000,
    sector: "إغاثة مخيمات النازحين",
    sectorColor: "#0F4C3A",
    projects: [
      { title: "إغاثة وإيواء مخيمات النازحين الأشد احتياجاً", category: "إغاثة", beneficiaries: "١٥,٠٠٠ مستفيد", status: "مستمر", year: "٢٠٢٦" },
      { title: "خزانات المياه الصالحة للشرب اليومية", category: "مياه", beneficiaries: "٧,٠٠٠ مستفيد", status: "مستمر", year: "٢٠٢٦" },
    ]
  },
  {
    id: "dhamar",
    name: "ذمار",
    lat: 14.5428,
    lng: 44.4051,
    projectsCount: 6,
    beneficiaries: 9800,
    sector: "الأمن الغذائي والسقيا",
    sectorColor: "#0F4C3A",
    projects: [
      { title: "السلال الغذائية الموسمية والدورية", category: "إغاثة", beneficiaries: "٦,٢٠٠ مستفيد", status: "منجز", year: "٢٠٢٥" },
      { title: "مشاريع السقيا وحفر الآبار المحلية", category: "مياه", beneficiaries: "٣,٦٠٠ مستفيد", status: "مستمر", year: "٢٠٢٦" },
    ]
  },
  {
    id: "amran",
    name: "عمران",
    lat: 15.6594,
    lng: 43.9439,
    projectsCount: 5,
    beneficiaries: 8200,
    sector: "الرعاية الاجتماعية والإغاثة",
    sectorColor: "#C69E5A",
    projects: [
      { title: "كسوة العيد وحقيبة المدرسة للأيتام", category: "كفالات", beneficiaries: "٢,٨٠٠ طفل", status: "منجز", year: "٢٠٢٥" },
      { title: "توزيع الدقيق والمواد الأساسية", category: "إغاثة", beneficiaries: "٥,٤٠٠ مستفيد", status: "مستمر", year: "٢٠٢٦" },
    ]
  },
  {
    id: "saada",
    name: "صعدة",
    lat: 16.9402,
    lng: 43.7639,
    projectsCount: 5,
    beneficiaries: 7500,
    sector: "الإغاثة الطارئة والمياه",
    sectorColor: "#0F4C3A",
    projects: [
      { title: "قافلة الإغاثة الغذائية والطبية", category: "إغاثة", beneficiaries: "٤,٥٠٠ مستفيد", status: "منجز", year: "٢٠٢٥" },
      { title: "توفير صهاريج المياه النقية", category: "مياه", beneficiaries: "٣,٠٠٠ مستفيد", status: "مستمر", year: "٢٠٢٦" },
    ]
  },
  {
    id: "abyan",
    name: "أبين",
    lat: 13.1287,
    lng: 45.3806,
    projectsCount: 4,
    beneficiaries: 6400,
    sector: "التمكين الزراعي والأنشطة الإغاثية",
    sectorColor: "#C69E5A",
    projects: [
      { title: "دعم الصيادين والمزارعين الصغار", category: "تمكين", beneficiaries: "٢٤٠ أسرة", status: "منجز", year: "٢٠٢٥" },
      { title: "توزيع الطرود الغذائية للأسر المعيلة", category: "إغاثة", beneficiaries: "٥,٠٠٠ مستفيد", status: "مستمر", year: "٢٠٢٦" },
    ]
  },
  {
    id: "shabwah",
    name: "شبوة",
    lat: 14.5372,
    lng: 46.8319,
    projectsCount: 4,
    beneficiaries: 5900,
    sector: "سقيا الماء والدعم الاجتماعي",
    sectorColor: "#0284C7",
    projects: [
      { title: "تأهيل شبكات المياه القروية", category: "مياه", beneficiaries: "٤,١٠٠ مستفيد", status: "منجز", year: "٢٠٢٥" },
      { title: "كفالات الأسر والمساعدات الطارئة", category: "إغاثة", beneficiaries: "١,٨٠٠ مستفيد", status: "مستمر", year: "٢٠٢٦" },
    ]
  },
  {
    id: "lahj",
    name: "لحج",
    lat: 13.0583,
    lng: 44.8822,
    projectsCount: 5,
    beneficiaries: 7100,
    sector: "الإغاثة والتمكين الحرفي",
    sectorColor: "#0F4C3A",
    projects: [
      { title: "تأهيل مشاتل ومشاريع الحرف اليدوية", category: "تمكين", beneficiaries: "١٨٠ أسرة", status: "منجز", year: "٢٠٢٥" },
      { title: "المساعدات الغذائية المباشرة", category: "إغاثة", beneficiaries: "٥,٥٠٠ مستفيد", status: "مستمر", year: "٢٠٢٦" },
    ]
  },
  {
    id: "al-mahrah",
    name: "المهرة",
    lat: 16.2078,
    lng: 52.1761,
    projectsCount: 3,
    beneficiaries: 4200,
    sector: "المساعدات الغذائية والتعليم",
    sectorColor: "#7C3AED",
    projects: [
      { title: "دعم الطلاب والطالبات بالحقيبة المدرسية", category: "تعليم", beneficiaries: "١,٥٠٠ طالب", status: "منجز", year: "٢٠٢٥" },
      { title: "السلال الغذائية للأسر النائية", category: "إغاثة", beneficiaries: "٢,٧٠٠ مستفيد", status: "مستمر", year: "٢٠٢٦" },
    ]
  },
  {
    id: "socotra",
    name: "سقطرى",
    lat: 12.4634,
    lng: 53.8237,
    projectsCount: 3,
    beneficiaries: 3800,
    sector: "الإغاثة الموسمية والسقيا",
    sectorColor: "#0F4C3A",
    projects: [
      { title: "إغاثة القرى النائية بالأغذية والبطانيات", category: "إغاثة", beneficiaries: "٢,٤٠٠ مستفيد", status: "منجز", year: "٢٠٢٥" },
      { title: "تأمين خزان المياه ومحطة التحلية", category: "مياه", beneficiaries: "١,٤٠٠ مستفيد", status: "مستمر", year: "٢٠٢٦" },
    ]
  }
];

export function InteractiveMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<{ [key: string]: CircleMarker }>({});

  const [selectedGovernorate, setSelectedGovernorate] = useState<GovernorateProjectData>(YEMEN_MAP_GOVERNORATES[0]);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter governorates for search
  const filteredGovernorates = YEMEN_MAP_GOVERNORATES.filter((gov) =>
    gov.name.includes(searchTerm) || gov.sector.includes(searchTerm)
  );

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center of Yemen: [15.5527, 47.5160] zoom level 6
    const map = createMap(mapContainerRef.current, {
      center: [15.3500, 46.5000],
      zoom: 6,
      zoomControl: false,
      scrollWheelZoom: false,
    });

    // Custom OpenStreetMap Tile Layer with clean light aesthetics
    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map);

    // Zoom control on top left
    control.zoom({ position: 'topleft' }).addTo(map);

    mapInstanceRef.current = map;

    // Add Markers for all governorates
    YEMEN_MAP_GOVERNORATES.forEach((gov) => {
      const marker = circleMarker([gov.lat, gov.lng], {
        radius: 12,
        fillColor: gov.sectorColor,
        color: '#FFFFFF',
        weight: 3,
        opacity: 1,
        fillOpacity: 0.85,
      }).addTo(map);

      // Bind Popup
      const popupContent = `
        <div style="font-family: Cairo, sans-serif; text-align: right; direction: rtl; padding: 4px; min-width: 160px;">
          <h4 style="font-weight: 800; font-size: 14px; margin: 0 0 4px 0; color: #0F4C3A;">${gov.name}</h4>
          <p style="font-size: 11px; margin: 0 0 6px 0; color: #475569;">${gov.sector}</p>
          <div style="font-weight: 700; font-size: 12px; color: #C69E5A;">${gov.projectsCount} مشروعاً ميدانياً</div>
        </div>
      `;

      marker.bindPopup(popupContent, { closeButton: false });

      marker.on('click', () => {
        setSelectedGovernorate(gov);
      });

      markersRef.current[gov.id] = marker;
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  const handleSelectGovernorate = (gov: GovernorateProjectData) => {
    setSelectedGovernorate(gov);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([gov.lat, gov.lng], 7, { duration: 1.2 });
      const marker = markersRef.current[gov.id];
      if (marker) {
        marker.openPopup();
      }
    }
  };

  return (
    <div className="w-full font-cairo bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden" dir="rtl">
      {/* Map Section Header Bar */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-[#0F4C3A] via-[#155A45] to-[#0A372A] text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute inset-0 pattern-geometric-islamic opacity-10 pointer-events-none" />
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold border border-white/20 mb-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>خريطة التغطية الميدانية التفاعلية</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black leading-tight">
            المشاريع التنموية والإغاثية <span className="text-amber-300">في المحافظات اليمنية</span>
          </h3>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-1">
            انقر على أي محافظة لعرض التفاصيل والمشاريع المنفذة وعدد المستفيدين الموثق.
          </p>
        </div>

        {/* Global Summary Badge */}
        <div className="relative z-10 flex items-center gap-3 shrink-0 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20">
          <ShieldCheck className="w-6 h-6 text-amber-300" />
          <div>
            <div className="text-xs text-emerald-200 font-bold">إجمالي المحافظات</div>
            <div className="text-xl font-black text-white tabular-nums">١٨ محافظة مغطاة</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Leaflet Canvas + Details Sidebar */}
      <div className="grid lg:grid-cols-12 min-h-[520px]">
        
        {/* Left Col (Map Canvas) */}
        <div className="lg:col-span-7 relative min-h-[380px] lg:min-h-[520px] bg-slate-100">
          <div ref={mapContainerRef} className="w-full h-full min-h-[380px] lg:min-h-[520px] z-10" />

          {/* Quick Legend Overlay */}
          <div className="absolute bottom-4 right-4 z-20 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-lg border border-slate-200/80 text-xs font-bold text-slate-700 space-y-2 hidden sm:block">
            <div className="text-[11px] text-slate-400 font-extrabold mb-1">دليل القطاعات:</div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#0F4C3A]" />
              <span>إغاثة وأمن غذائي</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#0284C7]" />
              <span>مياه وإصحاح بيئي</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#7C3AED]" />
              <span>تعليم وتنمية</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#C69E5A]" />
              <span>تمكين اقتصادي</span>
            </div>
          </div>
        </div>

        {/* Right Col (Governorate Details & Project List Panel) */}
        <div className="lg:col-span-5 p-6 bg-slate-50 border-t lg:border-t-0 lg:border-r border-slate-200 flex flex-col justify-between">
          
          <div>
            {/* Search Input for Governorates */}
            <div className="relative mb-5">
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث عن محافظة أو قطاع..."
                className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0F4C3A] transition-colors"
              />
            </div>

            {/* Governorate Quick Chips Bar */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-5 scrollbar-none">
              {filteredGovernorates.map((gov) => {
                const isSelected = selectedGovernorate.id === gov.id;
                return (
                  <button
                    key={gov.id}
                    onClick={() => handleSelectGovernorate(gov)}
                    className={`
                      px-3 py-1.5 rounded-xl text-xs font-extrabold shrink-0 transition-all cursor-pointer flex items-center gap-1.5
                      ${isSelected
                        ? "bg-[#0F4C3A] text-white shadow-md scale-105"
                        : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200"
                      }
                    `}
                  >
                    <span>{gov.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? "bg-[#C69E5A] text-slate-950" : "bg-slate-100 text-slate-600"}`}>
                      {gov.projectsCount}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Selected Governorate Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedGovernorate.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {/* Header Info */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xl font-black text-slate-900 font-cairo flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-[#0F4C3A]" />
                      <span>{selectedGovernorate.name}</span>
                    </h4>
                    <span
                      className="px-3 py-1 rounded-full text-xs font-black text-white"
                      style={{ backgroundColor: selectedGovernorate.sectorColor }}
                    >
                      {selectedGovernorate.sector}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                      <div className="text-[11px] font-bold text-slate-500">المشاريع المنفذة</div>
                      <div className="text-xl font-black text-[#0F4C3A] mt-0.5 tabular-nums">
                        {selectedGovernorate.projectsCount} مشاريع
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                      <div className="text-[11px] font-bold text-slate-500">عدد المستفيدين</div>
                      <div className="text-xl font-black text-[#C69E5A] mt-0.5 tabular-nums">
                        {selectedGovernorate.beneficiaries.toLocaleString("ar-SA")}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Implemented Projects List */}
                <div className="space-y-2.5">
                  <h5 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <FolderOpen className="w-4 h-4 text-[#0F4C3A]" />
                    <span>أبرز المشاريع الميدانية بالمحافظة:</span>
                  </h5>

                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {selectedGovernorate.projects.map((proj, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-white border border-slate-200/80 hover:border-[#0F4C3A]/30 transition-all flex items-start justify-between gap-3 shadow-2xs"
                      >
                        <div className="space-y-1">
                          <h6 className="font-extrabold text-xs text-slate-900 leading-snug">
                            {proj.title}
                          </h6>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-[#0F4C3A] font-bold">
                              {proj.category}
                            </span>
                            <span>• {proj.beneficiaries}</span>
                          </div>
                        </div>

                        <div className="text-left shrink-0">
                          <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                            {proj.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer Note */}
          <div className="pt-4 border-t border-slate-200 text-center">
            <p className="text-[11px] font-bold text-slate-500 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#0F4C3A]" />
              <span>مشاريع موثقة ومحدثة دورياً عبر فرق الرقابة الميدانية</span>
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}

export default InteractiveMap;
