import { dataService } from './data.service';

export const newsDashboardService = {
  getAll: () => dataService.getAll<any>('rh_news_data'),
  getById: (id: string | number) => dataService.getById<any>('rh_news_data', id),
  create: (item: any) => dataService.create<any>('rh_news_data', item),
  update: (id: string | number, updates: any) => dataService.update<any>('rh_news_data', id, updates),
  delete: (id: string | number) => dataService.delete('rh_news_data', id),
};

export const storiesDashboardService = {
  getAll: () => dataService.getAll<any>('rh_stories_data'),
  getById: (id: string | number) => dataService.getById<any>('rh_stories_data', id),
  create: (item: any) => dataService.create<any>('rh_stories_data', item),
  update: (id: string | number, updates: any) => dataService.update<any>('rh_stories_data', id, updates),
  delete: (id: string | number) => dataService.delete('rh_stories_data', id),
};

export const partnersDashboardService = {
  getAll: () => dataService.getAll<any>('rh_partners_data'),
  getById: (id: string | number) => dataService.getById<any>('rh_partners_data', id),
  create: (item: any) => dataService.create<any>('rh_partners_data', item),
  update: (id: string | number, updates: any) => dataService.update<any>('rh_partners_data', id, updates),
  delete: (id: string | number) => dataService.delete('rh_partners_data', id),
};

export const projectsDashboardService = {
  getAll: () => dataService.getAll<any>('rh_projects_data'),
  getById: (id: string | number) => dataService.getById<any>('rh_projects_data', id),
  create: (item: any) => dataService.create<any>('rh_projects_data', item),
  update: (id: string | number, updates: any) => dataService.update<any>('rh_projects_data', id, updates),
  delete: (id: string | number) => dataService.delete('rh_projects_data', id),
};

export const reportsDashboardService = {
  getAll: () => dataService.getAll<any>('rh_reports_data'),
  getById: (id: string | number) => dataService.getById<any>('rh_reports_data', id),
  create: (item: any) => dataService.create<any>('rh_reports_data', item),
  update: (id: string | number, updates: any) => dataService.update<any>('rh_reports_data', id, updates),
  delete: (id: string | number) => dataService.delete('rh_reports_data', id),
};

export const mediaDashboardService = {
  getAll: () => dataService.getAll<any>('rh_media_data'),
  getById: (id: string | number) => dataService.getById<any>('rh_media_data', id),
  create: (item: any) => dataService.create<any>('rh_media_data', item),
  update: (id: string | number, updates: any) => dataService.update<any>('rh_media_data', id, updates),
  delete: (id: string | number) => dataService.delete('rh_media_data', id),
};

export const donationsDashboardService = {
  getAll: () => dataService.getAll<any>('rh_donations_data'),
  getById: (id: string | number) => dataService.getById<any>('rh_donations_data', id),
  create: (item: any) => dataService.create<any>('rh_donations_data', item),
  update: (id: string | number, updates: any) => dataService.update<any>('rh_donations_data', id, updates),
  delete: (id: string | number) => dataService.delete('rh_donations_data', id),
};

export const requestsDashboardService = {
  getAll: () => dataService.getAll<any>('rh_requests_data'),
  getById: (id: string | number) => dataService.getById<any>('rh_requests_data', id),
  create: (item: any) => dataService.create<any>('rh_requests_data', item),
  update: (id: string | number, updates: any) => dataService.update<any>('rh_requests_data', id, updates),
  delete: (id: string | number) => dataService.delete('rh_requests_data', id),
};

export const volunteersDashboardService = {
  getAll: () => dataService.getAll<any>('rh_volunteers_data'),
  getById: (id: string | number) => dataService.getById<any>('rh_volunteers_data', id),
  create: (item: any) => dataService.create<any>('rh_volunteers_data', item),
  update: (id: string | number, updates: any) => dataService.update<any>('rh_volunteers_data', id, updates),
  delete: (id: string | number) => dataService.delete('rh_volunteers_data', id),
};

export const usersDashboardService = {
  getAll: () => dataService.getAll<any>('rh_dashboard_users'),
  getById: (id: string | number) => dataService.getById<any>('rh_dashboard_users', id),
  create: (item: any) => dataService.create<any>('rh_dashboard_users', item),
  update: (id: string | number, updates: any) => dataService.update<any>('rh_dashboard_users', id, updates),
  delete: (id: string | number) => dataService.delete('rh_dashboard_users', id),
};

export const subscribersDashboardService = {
  getAll: () => dataService.getAll<any>('rh_subscriber_accounts'),
  getById: (id: string | number) => dataService.getById<any>('rh_subscriber_accounts', id),
  create: (item: any) => dataService.create<any>('rh_subscriber_accounts', item),
  update: (id: string | number, updates: any) => dataService.update<any>('rh_subscriber_accounts', id, updates),
  delete: (id: string | number) => dataService.delete('rh_subscriber_accounts', id),
};

const numberFromValue = (value: unknown) => {
  if (typeof value === 'number') return value;
  const normalized = String(value ?? '').replace(/[^\d.]/g, '');
  return Number(normalized) || 0;
};

const isVisible = (item: any) => !['DRAFT', 'draft', 'archived', 'inactive', 'suspended'].includes(item?.status);

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

    const completedDonations = donations.filter((item: any) => ['completed', 'paid', 'success'].includes(item.status || 'completed'));
    const totalDonations = completedDonations.reduce((sum: number, item: any) => sum + numberFromValue(item.amount), 0);
    const totalBeneficiaries = projects.reduce((sum: number, item: any) => sum + numberFromValue(item.beneficiaries), 0);

    return {
      totalBeneficiaries,
      activeProjects: projects.filter((item: any) => item.status === 'active').length,
      totalPartners: partners.filter(isVisible).length,
      totalVolunteers: volunteers.filter((item: any) => item.status === 'active').length,
      newMessages: requests.filter((item: any) => item.status === 'new').length,
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

    const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'];
    const donationsOverYear = months.map((month) => ({ month, amount: 0, count: 0 }));
    donations.forEach((donation: any, index: number) => {
      const slot = donationsOverYear[index % donationsOverYear.length];
      slot.amount += numberFromValue(donation.amount);
      slot.count += 1;
    });

    const projectsByCategory = Object.values(
      projects.reduce((acc: Record<string, { category: string; count: number }>, project: any) => {
        const category = project.category || 'غير مصنف';
        acc[category] = acc[category] || { category, count: 0 };
        acc[category].count += 1;
        return acc;
      }, {})
    );

    const days = ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];

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


