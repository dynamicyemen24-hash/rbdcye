// ============================================================
// Enterprise Analytics Service - Reports & Business Intelligence
// ============================================================

export interface AnalyticsMetric {
  label: string;
  labelAr: string;
  value: number;
  previousValue?: number;
  change?: number;
  changePercent?: number;
  trend: "up" | "down" | "stable";
  icon: string;
  color: string;
}

export interface TimeSeriesData {
  date: string;
  value: number;
  label: string;
}

export interface ReportFilter {
  startDate?: string;
  endDate?: string;
  category?: string;
  status?: string;
  region?: string;
  projectId?: string;
}

export interface ReportData {
  id: string;
  title: string;
  titleAr: string;
  type: "financial" | "impact" | "operational" | "donor" | "project";
  period: string;
  generatedAt: string;
  generatedBy: string;
  metrics: AnalyticsMetric[];
  charts: ChartData[];
  tables: TableData[];
  summary: string;
  recommendations?: string[];
}

export interface ChartData {
  id: string;
  title: string;
  titleAr: string;
  type: "bar" | "line" | "pie" | "area" | "donut";
  labels: string[];
  datasets: {
    label: string;
    labelAr?: string;
    data: number[];
    color?: string;
  }[];
}

export interface TableData {
  id: string;
  title: string;
  titleAr: string;
  headers: { key: string; label: string; labelAr: string }[];
  rows: Record<string, unknown>[];
  total?: Record<string, number>;
}

class AnalyticsService {
  private static instance: AnalyticsService;
  private reports: ReportData[] = [];

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  // Generate Financial Report
  async generateFinancialReport(filter: ReportFilter = {}): Promise<ReportData> {
    const report: ReportData = {
      id: `RPT_FIN_${Date.now()}`,
      title: "Financial Performance Report",
      titleAr: "تقرير الأداء المالي",
      type: "financial",
      period: this.formatPeriod(filter),
      generatedAt: new Date().toISOString(),
      generatedBy: "نظام التحليلات",
      metrics: this.getFinancialMetrics(),
      charts: this.getFinancialCharts(),
      tables: this.getFinancialTables(filter),
      summary:
        "تحليل شامل للأداء المالي للمؤسسة يشمل إجمالي التبرعات والمصروفات والموازنة التشغيلية",
      recommendations: [
        "تنويع مصادر الدخل عبر حملات تمويل جماعي",
        "زيادة نسبة التبرعات المتكررة (الشهرية)",
        "تطوير برنامج شركاء العطاء",
      ],
    };

    this.reports.push(report);
    return report;
  }

  // Generate Impact Report
  async generateImpactReport(filter: ReportFilter = {}): Promise<ReportData> {
    const report: ReportData = {
      id: `RPT_IMP_${Date.now()}`,
      title: "Social Impact Report",
      titleAr: "تقرير الأثر الاجتماعي",
      type: "impact",
      period: this.formatPeriod(filter),
      generatedAt: new Date().toISOString(),
      generatedBy: "نظام التحليلات",
      metrics: this.getImpactMetrics(),
      charts: this.getImpactCharts(),
      tables: this.getImpactTables(filter),
      summary: "قياس الأثر الاجتماعي للمشاريع والبرامج المنفذة وأعداد المستفيدين",
      recommendations: [
        "توسيع نطاق المشاريع التنموية في المناطق الأكثر احتياجاً",
        "تعزيز الشراكات مع القطاع الخاص",
        "تطوير برامج تمكين اقتصادي للمستفيدين",
      ],
    };

    this.reports.push(report);
    return report;
  }

  // Generate Donor Report
  async generateDonorReport(filter: ReportFilter = {}): Promise<ReportData> {
    const report: ReportData = {
      id: `RPT_DON_${Date.now()}`,
      title: "Donor Engagement Report",
      titleAr: "تقرير تفاعل المتبرعين",
      type: "donor",
      period: this.formatPeriod(filter),
      generatedAt: new Date().toISOString(),
      generatedBy: "نظام التحليلات",
      metrics: this.getDonorMetrics(),
      charts: this.getDonorCharts(),
      tables: this.getDonorTables(filter),
      summary: "تحليل سلوك المتبرعين وأنماط التبرع ومستويات الرضا",
      recommendations: [
        "إطلاق برنامج ولاء للمتبرعين الدائمين",
        "تحسين تواصل ما بعد التبرع",
        "تطوير تقارير الأثر المخصصة لكل متبرع",
      ],
    };

    this.reports.push(report);
    return report;
  }

  // Generate Project Report
  async generateProjectReport(projectId?: string): Promise<ReportData> {
    const report: ReportData = {
      id: `RPT_PRJ_${Date.now()}`,
      title: "Project Performance Report",
      titleAr: "تقرير أداء المشاريع",
      type: "project",
      period: "ربع سنوي",
      generatedAt: new Date().toISOString(),
      generatedBy: "نظام التحليلات",
      metrics: this.getProjectMetrics(),
      charts: this.getProjectCharts(),
      tables: this.getProjectTables(projectId),
      summary: "متابعة أداء المشاريع من حيث الإنجاز والموازنة والأثر",
    };

    this.reports.push(report);
    return report;
  }

  // Export report as XLSX
  async exportToExcel(reportId: string): Promise<Blob> {
    const report = this.reports.find((r) => r.id === reportId);
    if (!report) throw new Error("التقرير غير موجود");

    // Create CSV content
    const rows: string[] = [];
    rows.push(`"${report.titleAr}"`);
    rows.push(
      `"الفترة: ${report.period}","تاريخ التقرير: ${new Date().toLocaleDateString("ar-SA")}"`
    );
    rows.push("");

    // Add metrics
    rows.push("المؤشرات الرئيسية");
    rows.push("المؤشر,القيمة,التغير");
    report.metrics.forEach((m) => {
      rows.push(`"${m.labelAr}",${m.value},${m.changePercent || 0}%`);
    });
    rows.push("");

    // Add tables
    report.tables.forEach((table) => {
      rows.push(table.titleAr);
      rows.push(table.headers.map((h) => `"${h.labelAr}"`).join(","));
      table.rows.forEach((row) => {
        rows.push(table.headers.map((h) => `"${row[h.key] || ""}"`).join(","));
      });
      rows.push("");
    });

    const bom = "\uFEFF";
    const csv = bom + rows.join("\n");
    return new Blob([csv], { type: "text/csv;charset=utf-8;" });
  }

  // Export report as PDF summary
  async exportToPdf(reportId: string): Promise<string> {
    const report = this.reports.find((r) => r.id === reportId);
    if (!report) throw new Error("التقرير غير موجود");

    return `/reports/${reportId}.pdf`;
  }

  // Get all reports
  getReports(type?: ReportData["type"]): ReportData[] {
    if (type) return this.reports.filter((r) => r.type === type);
    return [...this.reports].sort(
      (a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime()
    );
  }

  // Get report by ID
  getReport(id: string): ReportData | undefined {
    return this.reports.find((r) => r.id === id);
  }

  // Private helpers
  private formatPeriod(filter: ReportFilter): string {
    if (filter.startDate && filter.endDate) {
      return `${filter.startDate} إلى ${filter.endDate}`;
    }
    return `${new Date().getFullYear()} - ربع سنوي`;
  }

  private getFinancialMetrics(): AnalyticsMetric[] {
    return [
      {
        label: "Total Revenue",
        labelAr: "إجمالي الإيرادات",
        value: 2450000,
        previousValue: 2100000,
        change: 350000,
        changePercent: 16.7,
        trend: "up",
        icon: "dollar",
        color: "#059669",
      },
      {
        label: "Total Expenses",
        labelAr: "إجمالي المصروفات",
        value: 1820000,
        previousValue: 1680000,
        change: 140000,
        changePercent: 8.3,
        trend: "up",
        icon: "trending-down",
        color: "#DC2626",
      },
      {
        label: "Operating Budget",
        labelAr: "الموازنة التشغيلية",
        value: 3200000,
        previousValue: 2800000,
        change: 400000,
        changePercent: 14.3,
        trend: "up",
        icon: "pie-chart",
        color: "#2563EB",
      },
      {
        label: "Admin Cost Ratio",
        labelAr: "نسبة التكاليف الإدارية",
        value: 8.5,
        previousValue: 9.2,
        change: -0.7,
        changePercent: -7.6,
        trend: "down",
        icon: "percent",
        color: "#D97706",
      },
    ];
  }

  private getImpactMetrics(): AnalyticsMetric[] {
    return [
      {
        label: "Total Beneficiaries",
        labelAr: "إجمالي المستفيدين",
        value: 15200,
        previousValue: 12800,
        change: 2400,
        changePercent: 18.8,
        trend: "up",
        icon: "users",
        color: "#059669",
      },
      {
        label: "Completed Projects",
        labelAr: "المشاريع المنجزة",
        value: 48,
        previousValue: 36,
        change: 12,
        changePercent: 33.3,
        trend: "up",
        icon: "check-circle",
        color: "#2563EB",
      },
      {
        label: "Active Programs",
        labelAr: "البرامج النشطة",
        value: 12,
        previousValue: 10,
        change: 2,
        changePercent: 20,
        trend: "up",
        icon: "activity",
        color: "#7C3AED",
      },
      {
        label: "Volunteer Hours",
        labelAr: "ساعات التطوع",
        value: 24800,
        previousValue: 19600,
        change: 5200,
        changePercent: 26.5,
        trend: "up",
        icon: "clock",
        color: "#D97706",
      },
    ];
  }

  private getDonorMetrics(): AnalyticsMetric[] {
    return [
      {
        label: "Active Donors",
        labelAr: "المتبرعون النشطون",
        value: 1250,
        previousValue: 980,
        change: 270,
        changePercent: 27.6,
        trend: "up",
        icon: "users",
        color: "#059669",
      },
      {
        label: "Avg Donation",
        labelAr: "متوسط التبرع",
        value: 1850,
        previousValue: 1620,
        change: 230,
        changePercent: 14.2,
        trend: "up",
        icon: "trending-up",
        color: "#2563EB",
      },
      {
        label: "Recurring Donors",
        labelAr: "المتبرعون المتكررون",
        value: 420,
        previousValue: 310,
        change: 110,
        changePercent: 35.5,
        trend: "up",
        icon: "repeat",
        color: "#7C3AED",
      },
      {
        label: "Donor Retention",
        labelAr: "معدل الاحتفاظ",
        value: 76,
        previousValue: 72,
        change: 4,
        changePercent: 5.6,
        trend: "up",
        icon: "heart",
        color: "#D97706",
      },
    ];
  }

  private getProjectMetrics(): AnalyticsMetric[] {
    return [
      {
        label: "Active Projects",
        labelAr: "المشاريع النشطة",
        value: 24,
        previousValue: 20,
        change: 4,
        changePercent: 20,
        trend: "up",
        icon: "folder-open",
        color: "#059669",
      },
      {
        label: "Completion Rate",
        labelAr: "معدل الإنجاز",
        value: 72,
        previousValue: 65,
        change: 7,
        changePercent: 10.8,
        trend: "up",
        icon: "check-circle",
        color: "#2563EB",
      },
      {
        label: "Budget Utilization",
        labelAr: "استخدام الموازنة",
        value: 82,
        previousValue: 78,
        change: 4,
        changePercent: 5.1,
        trend: "up",
        icon: "pie-chart",
        color: "#7C3AED",
      },
      {
        label: "On-time Delivery",
        labelAr: "التسليم في الوقت",
        value: 68,
        previousValue: 62,
        change: 6,
        changePercent: 9.7,
        trend: "up",
        icon: "clock",
        color: "#D97706",
      },
    ];
  }

  private getFinancialCharts(): ChartData[] {
    return [
      {
        id: "chart-donations-monthly",
        title: "Monthly Donations",
        titleAr: "التبرعات الشهرية",
        type: "bar",
        labels: [
          "يناير",
          "فبراير",
          "مارس",
          "أبريل",
          "مايو",
          "يونيو",
          "يوليو",
          "أغسطس",
          "سبتمبر",
          "أكتوبر",
          "نوفمبر",
          "ديسمبر",
        ],
        datasets: [
          {
            label: "Amount",
            labelAr: "المبلغ",
            data: [
              180000, 220000, 195000, 250000, 280000, 310000, 290000, 340000, 320000, 380000,
              410000, 450000,
            ],
            color: "#059669",
          },
        ],
      },
      {
        id: "chart-revenue-sources",
        title: "Revenue by Source",
        titleAr: "الإيرادات حسب المصدر",
        type: "pie",
        labels: ["تبرعات أفراد", "شركات", "منح", "زكاة", "أوقاف"],
        datasets: [{ label: "", data: [45, 25, 15, 10, 5], color: "#059669" }],
      },
    ];
  }

  private getImpactCharts(): ChartData[] {
    return [
      {
        id: "chart-beneficiaries",
        title: "Beneficiaries by Program",
        titleAr: "المستفيدون حسب البرنامج",
        type: "bar",
        labels: ["إغاثة", "تعليم", "صحة", "مياه", "كفالات"],
        datasets: [
          {
            label: "Beneficiaries",
            labelAr: "المستفيدون",
            data: [4500, 3800, 2900, 3200, 800],
            color: "#059669",
          },
        ],
      },
    ];
  }

  private getDonorCharts(): ChartData[] {
    return [
      {
        id: "chart-donor-growth",
        title: "Donor Growth",
        titleAr: "نمو المتبرعين",
        type: "line",
        labels: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو"],
        datasets: [
          {
            label: "New Donors",
            labelAr: "متبرعون جدد",
            data: [85, 95, 110, 130, 145, 160],
            color: "#2563EB",
          },
        ],
      },
    ];
  }

  private getProjectCharts(): ChartData[] {
    return [
      {
        id: "chart-project-status",
        title: "Project Status",
        titleAr: "حالة المشاريع",
        type: "donut",
        labels: ["نشط", "مكتمل", "قيد البدء", "متوقف"],
        datasets: [{ label: "", data: [24, 48, 8, 3], color: "#059669" }],
      },
    ];
  }

  private getFinancialTables(filter: ReportFilter): TableData[] {
    return [
      {
        id: "table-income-statement",
        title: "Income Statement",
        titleAr: "قائمة الدخل",
        headers: [
          { key: "item", label: "Item", labelAr: "البند" },
          { key: "budget", label: "Budget", labelAr: "الموازنة" },
          { key: "actual", label: "Actual", labelAr: "الفعلي" },
          { key: "variance", label: "Variance", labelAr: "الانحراف" },
        ],
        rows: [
          { item: "تبرعات الأفراد", budget: 1800000, actual: 1620000, variance: "-10%" },
          { item: "منح مؤسسية", budget: 800000, actual: 750000, variance: "-6.25%" },
          { item: "زكاة", budget: 400000, actual: 380000, variance: "-5%" },
          { item: "أوقاف", budget: 200000, actual: 100000, variance: "-50%" },
        ],
        total: { budget: 3200000, actual: 2850000 },
      },
    ];
  }

  private getImpactTables(filter: ReportFilter): TableData[] {
    return [
      {
        id: "table-program-impact",
        title: "Program Impact",
        titleAr: "أثر البرامج",
        headers: [
          { key: "program", label: "Program", labelAr: "البرنامج" },
          { key: "beneficiaries", label: "Beneficiaries", labelAr: "المستفيدون" },
          { key: "budget", label: "Budget", labelAr: "الموازنة" },
          { key: "status", label: "Status", labelAr: "الحالة" },
        ],
        rows: [
          { program: "إغاثة طارئة", beneficiaries: 4500, budget: 750000, status: "مستمر" },
          { program: "كفالة تعليم", beneficiaries: 3800, budget: 450000, status: "مكتمل" },
          { program: "رعاية صحية", beneficiaries: 2900, budget: 380000, status: "مستمر" },
          { program: "مياه نظيفة", beneficiaries: 3200, budget: 520000, status: "مستمر" },
        ],
      },
    ];
  }

  private getDonorTables(filter: ReportFilter): TableData[] {
    return [
      {
        id: "table-donor-segments",
        title: "Donor Segments",
        titleAr: "شرائح المتبرعين",
        headers: [
          { key: "segment", label: "Segment", labelAr: "الشريحة" },
          { key: "count", label: "Count", labelAr: "العدد" },
          { key: "total", label: "Total", labelAr: "الإجمالي" },
          { key: "average", label: "Average", labelAr: "المتوسط" },
        ],
        rows: [
          { segment: "المتبرعون الجدد", count: 450, total: 360000, average: 800 },
          { segment: "المتبرعون المنتظمون", count: 320, total: 640000, average: 2000 },
          { segment: "الشركاء الاستراتيجيون", count: 18, total: 900000, average: 50000 },
          { segment: "المتبرعون المؤسسيون", count: 25, total: 500000, average: 20000 },
        ],
      },
    ];
  }

  private getProjectTables(projectId?: string): TableData[] {
    return [
      {
        id: "table-project-tracking",
        title: "Project Tracking",
        titleAr: "متابعة المشاريع",
        headers: [
          { key: "project", label: "Project", labelAr: "المشروع" },
          { key: "progress", label: "Progress", labelAr: "التقدم" },
          { key: "budget", label: "Budget", labelAr: "الموازنة" },
          { key: "spent", label: "Spent", labelAr: "المنصرف" },
          { key: "completion", label: "Expected", labelAr: "تاريخ الإنجاز" },
        ],
        rows: [
          {
            project: "بئر ماء - الحديدة",
            progress: "85%",
            budget: 120000,
            spent: 102000,
            completion: "2025-03-15",
          },
          {
            project: "كفالة 500 يتيم",
            progress: "100%",
            budget: 600000,
            spent: 580000,
            completion: "2025-01-30",
          },
          {
            project: "مركز صحي مأرب",
            progress: "45%",
            budget: 450000,
            spent: 202500,
            completion: "2025-08-20",
          },
          {
            project: "حملة رمضان 2025",
            progress: "70%",
            budget: 350000,
            spent: 245000,
            completion: "2025-02-28",
          },
        ],
      },
    ];
  }
}

export const analyticsService = AnalyticsService.getInstance();

// Dashboard KPIs
export interface DashboardKPI {
  id: string;
  name: string;
  nameAr: string;
  value: number;
  previousValue: number;
  changePercent: number;
  trend: "up" | "down" | "stable";
  format?: "number" | "currency" | "percent" | "hours";
  icon: string;
}

export function getDashboardKPIs(): DashboardKPI[] {
  return [
    {
      id: "kpi-donations",
      name: "Total Donations",
      nameAr: "إجمالي التبرعات",
      value: 2450000,
      previousValue: 2100000,
      changePercent: 16.7,
      trend: "up",
      format: "currency",
      icon: "dollar-sign",
    },
    {
      id: "kpi-beneficiaries",
      name: "Beneficiaries",
      nameAr: "المستفيدون",
      value: 15200,
      previousValue: 12800,
      changePercent: 18.8,
      trend: "up",
      format: "number",
      icon: "users",
    },
    {
      id: "kpi-projects",
      name: "Active Projects",
      nameAr: "المشاريع النشطة",
      value: 24,
      previousValue: 20,
      changePercent: 20,
      trend: "up",
      format: "number",
      icon: "folder-open",
    },
    {
      id: "kpi-donors",
      name: "Active Donors",
      nameAr: "المتبرعون النشطون",
      value: 1250,
      previousValue: 980,
      changePercent: 27.6,
      trend: "up",
      format: "number",
      icon: "heart",
    },
    {
      id: "kpi-efficiency",
      name: "Program Efficiency",
      nameAr: "كفاءة البرامج",
      value: 91.5,
      previousValue: 90.8,
      changePercent: 0.8,
      trend: "up",
      format: "percent",
      icon: "target",
    },
    {
      id: "kpi-volunteers",
      name: "Volunteer Hours",
      nameAr: "ساعات التطوع",
      value: 24800,
      previousValue: 19600,
      changePercent: 26.5,
      trend: "up",
      format: "hours",
      icon: "clock",
    },
  ];
}
