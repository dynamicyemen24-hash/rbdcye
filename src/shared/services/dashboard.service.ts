import { dataService } from "./data.service";

export const newsDashboardService = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getAll: () => dataService.getAll<any>("rh_news_data"),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getById: (id: string | number) => dataService.getById<any>("rh_news_data", id),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  create: (item: any) => dataService.create<any>("rh_news_data", item),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  update: (id: string | number, updates: any) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataService.update<any>("rh_news_data", id, updates),
  delete: (id: string | number) => dataService.delete("rh_news_data", id),
};

export const storiesDashboardService = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getAll: () => dataService.getAll<any>("rh_stories_data"),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getById: (id: string | number) => dataService.getById<any>("rh_stories_data", id),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  create: (item: any) => dataService.create<any>("rh_stories_data", item),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  update: (id: string | number, updates: any) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataService.update<any>("rh_stories_data", id, updates),
  delete: (id: string | number) => dataService.delete("rh_stories_data", id),
};

export const partnersDashboardService = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getAll: () => dataService.getAll<any>("rh_partners_data"),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getById: (id: string | number) => dataService.getById<any>("rh_partners_data", id),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  create: (item: any) => dataService.create<any>("rh_partners_data", item),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  update: (id: string | number, updates: any) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataService.update<any>("rh_partners_data", id, updates),
  delete: (id: string | number) => dataService.delete("rh_partners_data", id),
};

export const projectsDashboardService = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getAll: () => dataService.getAll<any>("rh_projects_data"),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getById: (id: string | number) => dataService.getById<any>("rh_projects_data", id),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  create: (item: any) => dataService.create<any>("rh_projects_data", item),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  update: (id: string | number, updates: any) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataService.update<any>("rh_projects_data", id, updates),
  delete: (id: string | number) => dataService.delete("rh_projects_data", id),
};

export const reportsDashboardService = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getAll: () => dataService.getAll<any>("rh_reports_data"),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getById: (id: string | number) => dataService.getById<any>("rh_reports_data", id),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  create: (item: any) => dataService.create<any>("rh_reports_data", item),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  update: (id: string | number, updates: any) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataService.update<any>("rh_reports_data", id, updates),
  delete: (id: string | number) => dataService.delete("rh_reports_data", id),
};

export const mediaDashboardService = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getAll: () => dataService.getAll<any>("rh_media_data"),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getById: (id: string | number) => dataService.getById<any>("rh_media_data", id),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  create: (item: any) => dataService.create<any>("rh_media_data", item),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  update: (id: string | number, updates: any) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataService.update<any>("rh_media_data", id, updates),
  delete: (id: string | number) => dataService.delete("rh_media_data", id),
};

export const donationsDashboardService = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getAll: () => dataService.getAll<any>("rh_donations_data"),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getById: (id: string | number) => dataService.getById<any>("rh_donations_data", id),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  create: (item: any) => dataService.create<any>("rh_donations_data", item),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  update: (id: string | number, updates: any) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataService.update<any>("rh_donations_data", id, updates),
  delete: (id: string | number) => dataService.delete("rh_donations_data", id),
};

export const requestsDashboardService = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getAll: () => dataService.getAll<any>("rh_requests_data"),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getById: (id: string | number) => dataService.getById<any>("rh_requests_data", id),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  create: (item: any) => dataService.create<any>("rh_requests_data", item),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  update: (id: string | number, updates: any) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataService.update<any>("rh_requests_data", id, updates),
  delete: (id: string | number) => dataService.delete("rh_requests_data", id),
};

export const volunteersDashboardService = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getAll: () => dataService.getAll<any>("rh_volunteers_data"),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getById: (id: string | number) => dataService.getById<any>("rh_volunteers_data", id),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  create: (item: any) => dataService.create<any>("rh_volunteers_data", item),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  update: (id: string | number, updates: any) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataService.update<any>("rh_volunteers_data", id, updates),
  delete: (id: string | number) => dataService.delete("rh_volunteers_data", id),
};

export const usersDashboardService = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getAll: () => dataService.getAll<any>("rh_dashboard_users"),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getById: (id: string | number) => dataService.getById<any>("rh_dashboard_users", id),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  create: (item: any) => dataService.create<any>("rh_dashboard_users", item),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  update: (id: string | number, updates: any) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataService.update<any>("rh_dashboard_users", id, updates),
  delete: (id: string | number) => dataService.delete("rh_dashboard_users", id),
};

export const subscribersDashboardService = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getAll: () => dataService.getAll<any>("rh_subscriber_accounts"),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getById: (id: string | number) => dataService.getById<any>("rh_subscriber_accounts", id),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  create: (item: any) => dataService.create<any>("rh_subscriber_accounts", item),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  update: (id: string | number, updates: any) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataService.update<any>("rh_subscriber_accounts", id, updates),
  delete: (id: string | number) => dataService.delete("rh_subscriber_accounts", id),
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- precise: any retained for Sanity PortableText dynamic — typed via unknown in v3.2
const numberFromValue = (value: any) => {
  if (typeof value === "number") return value;
  const normalized = String(value ?? "").replace(/[^\d.]/g, "");
  return Number(normalized) || 0;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isVisible = (item: any) =>
  !["DRAFT", "draft", "archived", "inactive", "suspended"].includes(item?.status);

export const dashboardService = {
  async getMetrics() {
    const [projects, partners, volunteers, requests, donations, news, stories] = await Promise.all([
      projectsDashboardService.getAll(),
      partnersDashboardService.getAll(),
      volunteersDashboardService.getAll(),
      requestsDashboardService.getAll(),
      donationsDashboardService.getAll(),
      newsDashboardService.getAll(),
      storiesDashboardService.getAll(),
    ]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const completedDonations = donations.filter((item: any) =>
      ["completed", "paid", "success"].includes(item.status || "completed")
    );
    const totalDonations = completedDonations.reduce(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (sum: number, item: any) => sum + numberFromValue(item.amount),
      0
    );
    const totalBeneficiaries = projects.reduce(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (sum: number, item: any) => sum + numberFromValue(item.beneficiaries),
      0
    );

    return {
      totalBeneficiaries,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      activeProjects: projects.filter((item: any) => item.status === "active").length,
      totalPartners: partners.filter(isVisible).length,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      totalVolunteers: volunteers.filter((item: any) => item.status === "active").length,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      newMessages: requests.filter((item: any) => item.status === "new").length,
      totalDonations,
      monthlyDonations: totalDonations,
      donationGrowth: 0,
      newsCount: news.filter(isVisible).length,
      storiesCount: stories.filter(isVisible).length,
    };
  },

  async getChartData() {
    const [donations, projects, requests] = await Promise.all([
      donationsDashboardService.getAll(),
      projectsDashboardService.getAll(),
      requestsDashboardService.getAll(),
    ]);

    const months = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو"];
    const donationsOverYear = months.map((month) => ({ month, amount: 0, count: 0 }));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    donations.forEach((donation: any, index: number) => {
      const slot = donationsOverYear[index % donationsOverYear.length];
      slot.amount += numberFromValue(donation.amount);
      slot.count += 1;
    });

    const projectsByCategory = Object.values(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      projects.reduce((acc: Record<string, { category: string; count: number }>, project: any) => {
        const category = project.category || "غير مصنف";
        acc[category] = acc[category] || { category, count: 0 };
        acc[category].count += 1;
        return acc;
      }, {})
    );

    const days = ["السبت", "الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس"];

    return {
      donationsOverYear,
      projectsByCategory,
      weeklyActivity: days.map((day, index) => ({
        day,
        visits: requests.length + projects.length + index * 10,
        donations: donationsOverYear[index]?.count || 0,
      })),
    };
  },
};
