import { supabase } from '@/lib/supabase';

export interface BeneficiaryRequest {
  id?: string;
  request_number?: number;
  full_name: string;
  phone: string;
  email?: string;
  governorate: string;
  district?: string;
  address?: string;
  request_type: string;
  priority?: string;
  description: string;
  family_size?: number;
  status?: string;
  admin_notes?: string;
  assigned_to?: string;
  created_at?: string;
}

export interface ComplaintSuggestion {
  id?: string;
  entry_number?: number;
  type: string;
  full_name: string;
  phone?: string;
  email?: string;
  subject: string;
  description: string;
  department?: string;
  status?: string;
  admin_response?: string;
  satisfaction_rating?: number;
  created_at?: string;
}

export interface ServiceCatalog {
  id?: string;
  name: string;
  description: string;
  category: string;
  eligibility?: string;
  required_documents?: string;
  available_governorates?: string[];
  is_active?: boolean;
  application_count?: number;
}

export interface ServiceApplication {
  id?: string;
  service_id: string;
  applicant_name: string;
  applicant_phone: string;
  applicant_email?: string;
  applicant_governorate: string;
  applicant_address?: string;
  family_size?: number;
  monthly_income?: number;
  additional_info?: string;
  status?: string;
}

const GOVERNORATES = [
  'صنعاء', 'عدن', 'تعز', 'مسقط', 'إب', 'حضرموت', 'صعدة', 'حجة', 'الحديدة', 'مأرب', 'البيضاء', 'شبوة', 'لحج', 'أبين'
];

const REQUEST_TYPES = [
  { value: 'assistance', label: 'مساعدة إنسانية', icon: '🤝', color: 'bg-[var(--brand-green)]' },
  { value: 'medical', label: 'مساعدة طبية', icon: '🏥', color: 'bg-red-500' },
  { value: 'educational', label: 'مساعدة تعليمية', icon: '📚', color: 'bg-blue-500' },
  { value: 'food', label: 'مساعدة غذائية', icon: '🍲', color: 'bg-amber-500' },
  { value: 'shelter', label: 'مساعدة سكنية', icon: '🏠', color: 'bg-purple-500' },
  { value: 'water', label: 'مساعدة مياه', icon: '💧', color: 'bg-cyan-500' },
  { value: 'other', label: 'أخرى', icon: '📋', color: 'bg-gray-500' },
];

class ServicesDBService {
  // Beneficiary Requests
  async submitRequest(request: BeneficiaryRequest): Promise<{ success: boolean; id?: string; request_number?: number }> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- precise: non-null asserted after explicit null check above
      const { data, error } = await supabase!
        .from('beneficiary_requests')
        .insert({
          ...request,
          priority: request.priority || 'normal',
          status: 'pending',
        })
        .select('id, request_number')
        .single();

      if (error) throw error;
      return { success: true, id: data.id, request_number: data.request_number };
    } catch (err) {
      console.error('[ServicesDB] Submit request failed:', err);
      return { success: false };
    }
  }

  async getRequests(filters?: { status?: string; type?: string; governorate?: string }): Promise<BeneficiaryRequest[]> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- precise: non-null asserted after explicit null check above
      let query = supabase!.from('beneficiary_requests').select('*');
      if (filters?.status) query = query.eq('status', filters.status);
      if (filters?.type) query = query.eq('request_type', filters.type);
      if (filters?.governorate) query = query.eq('governorate', filters.governorate);
      query = query.order('created_at', { ascending: false });
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch {
      return [];
    }
  }

  async updateRequestStatus(id: string, status: string, admin_notes?: string): Promise<boolean> {
    try {
      const update: Record<string, unknown> = { status, updated_at: new Date().toISOString() };
      if (admin_notes) update.admin_notes = admin_notes;
      if (status === 'completed') update.resolved_at = new Date().toISOString();
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- precise: non-null asserted after explicit null check above
      const { error } = await supabase!.from('beneficiary_requests').update(update).eq('id', id);
      return !error;
    } catch {
      return false;
    }
  }

  async getRequestStats(): Promise<{ total: number; pending: number; completed: number; byType: Record<string, number> }> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- precise: non-null asserted after explicit null check above
      const { data } = await supabase!.from('beneficiary_requests').select('status, request_type');
      if (!data) return { total: 0, pending: 0, completed: 0, byType: {} };
      return {
        total: data.length,
        pending: data.filter(r => r.status === 'pending').length,
        completed: data.filter(r => r.status === 'completed').length,
        byType: data.reduce((acc, r) => { acc[r.request_type] = (acc[r.request_type] || 0) + 1; return acc; }, {} as Record<string, number>),
      };
    } catch {
      return { total: 0, pending: 0, completed: 0, byType: {} };
    }
  }

  // Complaints & Suggestions
  async submitFeedback(feedback: ComplaintSuggestion): Promise<{ success: boolean; id?: string; entry_number?: number }> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- precise: non-null asserted after explicit null check above
      const { data, error } = await supabase!
        .from('complaints_suggestions')
        .insert({ ...feedback, status: 'new' })
        .select('id, entry_number')
        .single();
      if (error) throw error;
      return { success: true, id: data.id, entry_number: data.entry_number };
    } catch (err) {
      console.error('[ServicesDB] Submit feedback failed:', err);
      return { success: false };
    }
  }

  async getFeedback(filters?: { type?: string; status?: string }): Promise<ComplaintSuggestion[]> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- precise: non-null asserted after explicit null check above
      let query = supabase!.from('complaints_suggestions').select('*');
      if (filters?.type) query = query.eq('type', filters.type);
      if (filters?.status) query = query.eq('status', filters.status);
      query = query.order('created_at', { ascending: false });
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch {
      return [];
    }
  }

  async updateFeedbackStatus(id: string, status: string, admin_response?: string): Promise<boolean> {
    try {
      const update: Record<string, unknown> = { status, updated_at: new Date().toISOString() };
      if (admin_response) update.admin_response = admin_response;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- precise: non-null asserted after explicit null check above
      const { error } = await supabase!.from('complaints_suggestions').update(update).eq('id', id);
      return !error;
    } catch {
      return false;
    }
  }

  async getFeedbackStats(): Promise<{ total: number; complaints: number; suggestions: number; resolved: number }> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- precise: non-null asserted after explicit null check above
      const { data } = await supabase!.from('complaints_suggestions').select('type, status');
      if (!data) return { total: 0, complaints: 0, suggestions: 0, resolved: 0 };
      return {
        total: data.length,
        complaints: data.filter(f => f.type === 'complaint').length,
        suggestions: data.filter(f => f.type === 'suggestion').length,
        resolved: data.filter(f => f.status === 'resolved' || f.status === 'closed').length,
      };
    } catch {
      return { total: 0, complaints: 0, suggestions: 0, resolved: 0 };
    }
  }

  // Services Catalog
  async getServices(): Promise<ServiceCatalog[]> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- precise: non-null asserted after explicit null check above
      const { data, error } = await supabase!
        .from('services_catalog')
        .select('*')
        .eq('is_active', true)
        .order('name');
      if (error) throw error;
      return data || [];
    } catch {
      return [];
    }
  }

  async submitApplication(application: ServiceApplication): Promise<{ success: boolean; id?: string }> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- precise: non-null asserted after explicit null check above
      const { data, error } = await supabase!
        .from('service_applications')
        .insert({ ...application, status: 'submitted' })
        .select('id')
        .single();
      if (error) throw error;
      return { success: true, id: data.id };
    } catch (err) {
      console.error('[ServicesDB] Submit application failed:', err);
      return { success: false };
    }
  }

  async getApplications(filters?: { service_id?: string; status?: string }): Promise<ServiceApplication[]> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- precise: non-null asserted after explicit null check above
      let query = supabase!.from('service_applications').select('*, services_catalog(name, category)');
      if (filters?.service_id) query = query.eq('service_id', filters.service_id);
      if (filters?.status) query = query.eq('status', filters.status);
      query = query.order('created_at', { ascending: false });
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch {
      return [];
    }
  }

  async updateApplicationStatus(id: string, status: string, admin_notes?: string): Promise<boolean> {
    try {
      const update: Record<string, unknown> = { status, updated_at: new Date().toISOString() };
      if (admin_notes) update.admin_notes = admin_notes;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- precise: non-null asserted after explicit null check above
      const { error } = await supabase!.from('service_applications').update(update).eq('id', id);
      return !error;
    } catch {
      return false;
    }
  }

  // Constants
  getGovernorates() { return GOVERNORATES; }
  getRequestTypes() { return REQUEST_TYPES; }
}

export const servicesDBService = new ServicesDBService();
