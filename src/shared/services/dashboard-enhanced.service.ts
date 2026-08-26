import { dashboardService as originalDashboardService } from './dashboard.service';
import { dataService } from './data.service';
import { fetchProjectsWithRetry, fetchNewsWithRetry, fetchSuccessStoriesWithRetry } from './sanityWithRetry';

// Fallback data for when all sources fail
const FALLBACK_DATA = {
  projects: [],
  news: [],
  stories: [],
  partners: [],
  donations: [],
  volunteers: [],
  requests: [],
  users: [],
  subscribers: [],
  reports: [],
  media: [],
};

/**
 * Enhanced dashboard service with improved connections and fallback strategies
 */
export const dashboardEnhancedService = {
  /**
   * Get metrics with multiple fallback sources
   */
  async getMetrics() {
    try {
      // Try original dashboard service first
      const metrics = await originalDashboardService.getMetrics();
      if (metrics && Object.keys(metrics).length > 0) {
        return metrics;
      }
    } catch {
      // Original dashboard service failed, trying Sanity
    }

    // Fallback to Sanity with retry
    try {
      const [projects, news, stories, partners] = await Promise.all([
        fetchProjectsWithRetry(),
        fetchNewsWithRetry(),
        fetchSuccessStoriesWithRetry(),
        dataService.getAll('rh_partners_data'),
      ]);

      return {
        totalBeneficiaries: projects.reduce((sum: number, p: any) => sum + (p.beneficiaries || 0), 0),
        activeProjects: projects.filter((p: any) => p.status === 'active').length,
        totalPartners: partners.length,
        totalVolunteers: FALLBACK_DATA.volunteers.length,
        newMessages: FALLBACK_DATA.requests.filter((r: any) => r.status === 'new').length,
        totalDonations: FALLBACK_DATA.donations.reduce((sum: number, d: any) => sum + (d.amount || 0), 0),
        newsCount: news.length,
        storiesCount: stories.length,
      };
    } catch (error) {
      console.error('All dashboard data sources failed:', error);
      // Return empty metrics as last resort
      return {
        totalBeneficiaries: 0,
        activeProjects: 0,
        totalPartners: 0,
        totalVolunteers: 0,
        newMessages: 0,
        totalDonations: 0,
        newsCount: 0,
        storiesCount: 0,
      };
    }
  },

  /**
   * Get chart data with fallback
   */
  async getChartData() {
    try {
      return await originalDashboardService.getChartData();
    } catch {
      return {
        donationsOverYear: [
          { month: 'يناير', amount: 0, count: 0 },
          { month: 'فبراير', amount: 0, count: 0 },
          { month: 'مارس', amount: 0, count: 0 },
          { month: 'أبريل', amount: 0, count: 0 },
          { month: 'مايو', amount: 0, count: 0 },
          { month: 'يونيو', amount: 0, count: 0 },
        ],
        projectsByCategory: [],
        weeklyActivity: [
          { day: 'السبت', visits: 0, donations: 0 },
          { day: 'الأحد', visits: 0, donations: 0 },
          { day: 'الإثنين', visits: 0, donations: 0 },
          { day: 'الثلاثاء', visits: 0, donations: 0 },
          { day: 'الأربعاء', visits: 0, donations: 0 },
          { day: 'الخميس', visits: 0, donations: 0 },
        ],
      };
    }
  },

  /**
   * Force refresh all dashboard data
   */
  async refreshAll() {
    const entities = [
      'rh_projects_data',
      'rh_news_data',
      'rh_stories_data',
      'rh_partners_data',
      'rh_donations_data',
      'rh_requests_data',
      'rh_volunteers_data',
    ];

    // Clear cache first
    dataService.clearAllCaches();

    // Refresh all entities in parallel
    const refreshPromises = entities.map(entity => 
      dataService.getAll(entity, true).catch((err) => {
        console.error(`Failed to refresh ${entity}:`, err);
        return [];
      })
    );

    await Promise.allSettled(refreshPromises);
  },
};

export { dataService };