import { supabase } from '@/lib/supabase';

import type { DonationProject } from './donation-types';

class AdminProjectService {
  async getAllProjects(): Promise<DonationProject[]> {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- precise: non-null asserted after explicit null check above
    const { data, error } = await supabase!
      .from('donation_projects')
      .select('*')
      .order('display_order', { ascending: true });
    if (error) throw error;
    return data || [];
  }

  async createProject(project: Partial<DonationProject>): Promise<DonationProject> {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- precise: non-null asserted after explicit null check above
    const { data, error } = await supabase!
      .from('donation_projects')
      .insert(project)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async updateProject(id: string, updates: Partial<DonationProject>): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- precise: non-null asserted after explicit null check above
    const { error } = await supabase!
      .from('donation_projects')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
  }

  async toggleProjectActive(id: string, isActive: boolean): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- precise: non-null asserted after explicit null check above
    const { error } = await supabase!
      .from('donation_projects')
      .update({ is_active: isActive, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
  }

  async toggleProjectFeatured(id: string, isFeatured: boolean): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- precise: non-null asserted after explicit null check above
    const { error } = await supabase!
      .from('donation_projects')
      .update({ is_featured: isFeatured, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
  }

  async deleteProject(id: string): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- precise: non-null asserted after explicit null check above
    const { error } = await supabase!
      .from('donation_projects')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }

  async reorderProjects(ids: string[]): Promise<void> {
    const updates = ids.map((id, index) =>
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- precise: non-null asserted after explicit null check above
      supabase!
        .from('donation_projects')
        .update({ display_order: index })
        .eq('id', id)
    );
    await Promise.all(updates);
  }
}

export const adminProjectService = new AdminProjectService();
