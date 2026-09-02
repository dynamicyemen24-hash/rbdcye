// ============================================================
// PostgreSQL Service - الاتصال المباشر بقاعدة البيانات
// ============================================================
import { supabase } from './supabase.client';

// أنواع البيانات
export interface PostgresProject {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'active' | 'completed' | 'pending';
  progress: number;
  budget?: number;
  beneficiaries: number;
  location: string;
  image?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PostgresNews {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  category_color?: string;
  category_bg?: string;
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
  image?: string;
  date: string;
  views: number;
  tags: string[];
}

export interface PostgresDonation {
  id: string;
  donor: string;
  email: string;
  phone: string;
  amount: number;
  project: string;
  method: 'card' | 'bank' | 'cash';
  type: 'once' | 'monthly' | 'yearly';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  date: string;
}

export interface PostgresRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  date: string;
}

export interface PostgresVolunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  field: string;
  motivation?: string;
  status: 'active' | 'inactive';
  hours: number;
  date: string;
}

export interface PostgresPartner {
  id: string;
  name: string;
  type: string;
  description?: string;
  logo?: string;
  status: 'active' | 'inactive';
}

export interface PostgresMedia {
  id: string;
  title: string;
  type: 'صورة' | 'فيديو' | 'وثيقة';
  url: string;
  size?: string;
  date: string;
}

export interface PostgresReport {
  id: string;
  title: string;
  type: string;
  file_url: string;
  size?: string;
  status: 'published' | 'draft';
  date: string;
}

export interface PostgresUser {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'EDITOR' | 'VIEWER';
  status: 'active' | 'inactive';
  created_at: string;
  last_login: string;
}

export interface PostgresSubscriber {
  id: string;
  name: string;
  email: string;
  phone?: string;
  source: 'contact' | 'donation' | 'volunteer';
  status: 'pending' | 'active';
  last_request_id?: string;
  created_at: string;
  updated_at: string;
}

// ============================================================
// PostgreSQL Service Class
// ============================================================
class PostgresService {
  private supabase: typeof supabase;

  constructor() {
    this.supabase = supabase;
  }

  // ============ PROJECTS ============
  async getProjects(): Promise<PostgresProject[]> {
    const { data, error } = await this.supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getProjectById(id: string): Promise<PostgresProject | null> {
    const { data, error } = await this.supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async createProject(project: Omit<PostgresProject, 'id' | 'created_at' | 'updated_at'>): Promise<PostgresProject> {
    const { data, error } = await this.supabase
      .from('projects')
      .insert([{ ...project, id: `proj_${Date.now()}` }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateProject(id: string, updates: Partial<PostgresProject>): Promise<PostgresProject> {
    const { data, error } = await this.supabase
      .from('projects')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteProject(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // ============ NEWS ============
  async getNews(): Promise<PostgresNews[]> {
    const { data, error } = await this.supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getPublishedNews(): Promise<PostgresNews[]> {
    const { data, error } = await this.supabase
      .from('posts')
      .select('*')
      .eq('status', 'PUBLISHED')
      .order('published_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async createNews(news: Omit<PostgresNews, 'id' | 'date' | 'views'>): Promise<PostgresNews> {
    const { data, error } = await this.supabase
      .from('posts')
      .insert([{
        ...news,
        id: `news_${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        views: 0,
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateNews(id: string, updates: Partial<PostgresNews>): Promise<PostgresNews> {
    const { data, error } = await this.supabase
      .from('posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteNews(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // ============ DONATIONS ============
  async getDonations(): Promise<PostgresDonation[]> {
    const { data, error } = await this.supabase
      .from('donations')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async createDonation(donation: Omit<PostgresDonation, 'id' | 'date'>): Promise<PostgresDonation> {
    const { data, error } = await this.supabase
      .from('donations')
      .insert([{ ...donation, id: `don_${Date.now()}`, date: new Date().toISOString().split('T')[0] }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateDonationStatus(id: string, status: PostgresDonation['status']): Promise<void> {
    const { error } = await this.supabase
      .from('donations')
      .update({ status })
      .eq('id', id);

    if (error) throw error;
  }

  // ============ REQUESTS ============
  async getRequests(): Promise<PostgresRequest[]> {
    const { data, error } = await this.supabase
      .from('service_requests')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async createRequest(request: Omit<PostgresRequest, 'id' | 'date' | 'status'>): Promise<PostgresRequest> {
    const { data, error } = await this.supabase
      .from('service_requests')
      .insert([{
        ...request,
        id: `req_${Date.now()}`,
        status: 'new',
        date: new Date().toISOString().split('T')[0],
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateRequestStatus(id: string, status: PostgresRequest['status']): Promise<void> {
    const { error } = await this.supabase
      .from('service_requests')
      .update({ status })
      .eq('id', id);

    if (error) throw error;
  }

  // ============ VOLUNTEERS ============
  async getVolunteers(): Promise<PostgresVolunteer[]> {
    const { data, error } = await this.supabase
      .from('volunteers')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async createVolunteer(volunteer: Omit<PostgresVolunteer, 'id' | 'date' | 'hours' | 'status'>): Promise<PostgresVolunteer> {
    const { data, error } = await this.supabase
      .from('volunteers')
      .insert([{
        ...volunteer,
        id: `vol_${Date.now()}`,
        status: 'pending',
        hours: 0,
        date: new Date().toISOString().split('T')[0],
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateVolunteerStatus(id: string, status: PostgresVolunteer['status']): Promise<void> {
    const { error } = await this.supabase
      .from('volunteers')
      .update({ status })
      .eq('id', id);

    if (error) throw error;
  }

  // ============ PARTNERS ============
  async getPartners(): Promise<PostgresPartner[]> {
    const { data, error } = await this.supabase
      .from('partners')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async createPartner(partner: Omit<PostgresPartner, 'id'>): Promise<PostgresPartner> {
    const { data, error } = await this.supabase
      .from('partners')
      .insert([{ ...partner, id: `par_${Date.now()}` }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updatePartner(id: string, updates: Partial<PostgresPartner>): Promise<PostgresPartner> {
    const { data, error } = await this.supabase
      .from('partners')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deletePartner(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('partners')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // ============ MEDIA ============
  async getMedia(): Promise<PostgresMedia[]> {
    const { data, error } = await this.supabase
      .from('media_library')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async createMedia(media: Omit<PostgresMedia, 'id'>): Promise<PostgresMedia> {
    const { data, error } = await this.supabase
      .from('media_library')
      .insert([{ ...media, id: `med_${Date.now()}` }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteMedia(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('media_library')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // ============ REPORTS ============
  async getReports(): Promise<PostgresReport[]> {
    const { data, error } = await this.supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async createReport(report: Omit<PostgresReport, 'id' | 'date'>): Promise<PostgresReport> {
    const { data, error } = await this.supabase
      .from('reports')
      .insert([{ ...report, id: `rep_${Date.now()}`, date: new Date().toISOString().split('T')[0] }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateReport(id: string, updates: Partial<PostgresReport>): Promise<PostgresReport> {
    const { data, error } = await this.supabase
      .from('reports')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteReport(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('reports')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // ============ USERS ============
  async getUsers(): Promise<PostgresUser[]> {
    const { data, error } = await this.supabase
      .from('dashboard_users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async createUser(user: Omit<PostgresUser, 'id' | 'created_at' | 'last_login'>): Promise<PostgresUser> {
    const { data, error } = await this.supabase
      .from('dashboard_users')
      .insert([{
        ...user,
        id: `usr_${Date.now()}`,
        created_at: new Date().toISOString(),
        last_login: 'جديد',
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateUserRole(id: string, role: PostgresUser['role']): Promise<void> {
    const { error } = await this.supabase
      .from('dashboard_users')
      .update({ role })
      .eq('id', id);

    if (error) throw error;
  }

  async updateUserStatus(id: string, status: PostgresUser['status']): Promise<void> {
    const { error } = await this.supabase
      .from('dashboard_users')
      .update({ status })
      .eq('id', id);

    if (error) throw error;
  }

  // ============ SUBSCRIBERS ============
  async getSubscribers(): Promise<PostgresSubscriber[]> {
    const { data, error } = await this.supabase
      .from('subscribers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async updateSubscriberStatus(id: string, status: PostgresSubscriber['status']): Promise<void> {
    const { error } = await this.supabase
      .from('subscribers')
      .update({ status })
      .eq('id', id);

    if (error) throw error;
  }

  // ============ SUCCESS STORIES ============
  async getSuccessStories(): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('success_stories')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async createSuccessStory(story: any): Promise<any> {
    const { data, error } = await this.supabase
      .from('success_stories')
      .insert([{ ...story, id: `story_${Date.now()}` }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateSuccessStory(id: string, updates: any): Promise<any> {
    const { data, error } = await this.supabase
      .from('success_stories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteSuccessStory(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('success_stories')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // ============ REPORTS/DASHBOARD METRICS ============
  async getDashboardMetrics(): Promise<any> {
    const [projects, partners, volunteers, requests, donations, news, stories] = await Promise.all([
      this.getProjects(),
      this.getPartners(),
      this.getVolunteers(),
      this.getRequests(),
      this.getDonations(),
      this.getNews(),
      this.getSuccessStories(),
    ]);

    const totalDonations = donations
      .filter(d => d.status === 'completed')
      .reduce((sum, d) => sum + d.amount, 0);

    const totalBeneficiaries = projects.reduce((sum, p) => sum + p.beneficiaries, 0);

    return {
      totalBeneficiaries,
      activeProjects: projects.filter(p => p.status === 'active').length,
      totalPartners: partners.filter(p => p.status === 'active').length,
      totalVolunteers: volunteers.filter(v => v.status === 'active').length,
      newMessages: requests.filter(r => r.status === 'new').length,
      totalDonations,
      monthlyDonations: totalDonations,
      donationGrowth: 0,
      newsCount: news.filter(n => n.status === 'PUBLISHED').length,
      storiesCount: stories.filter(s => s.status === 'published').length,
    };
  }

  async getChartData(): Promise<any> {
    const donations = await this.getDonations();
    const projects = await this.getProjects();

    const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'];
    const donationsOverYear = months.map((month) => ({ month, amount: 0, count: 0 }));
    
    donations.forEach((donation, index) => {
      const slot = donationsOverYear[index % donationsOverYear.length];
      slot.amount += donation.amount;
      slot.count += 1;
    });

    const projectsByCategory = Object.values(
      projects.reduce((acc: Record<string, { category: string; count: number }>, project) => {
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
        visits: projects.length + index * 10,
        donations: donationsOverYear[index]?.count || 0,
      })),
    };
  }
}

// Export singleton instance
export const postgresService = new PostgresService();

