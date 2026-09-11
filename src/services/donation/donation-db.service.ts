import { supabase } from '@/lib/supabase';

import type { DonationProject, InKindDonation, DonationPolicy } from './donation-types';

export interface Donation {
  id: string;
  donor_name?: string;
  donor_email: string;
  donor_phone?: string;
  donation_type: 'financial' | 'in_kind' | 'material';
  amount: number;
  currency: string;
  project_id?: string;
  payment_method?: string;
  payment_status: string;
  receipt_number: string;
  message?: string;
  is_recurring: boolean;
  recurring_interval?: string;
  is_anonymous: boolean;
  metadata?: Record<string, any>;
  created_at: string;
}

class DonationDBService {
  async getActiveProjects(): Promise<DonationProject[]> {
    const { data, error } = await supabase!
      .from('donation_projects')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });
    if (error) throw error;
    return data || [];
  }

  async getFeaturedProjects(): Promise<DonationProject[]> {
    const { data, error } = await supabase!
      .from('donation_projects')
      .select('*')
      .eq('is_active', true)
      .eq('is_featured', true)
      .order('display_order', { ascending: true });
    if (error) throw error;
    return data || [];
  }

  async getPolicies(): Promise<DonationPolicy[]> {
    const { data, error } = await supabase!
      .from('donation_policies')
      .select('*')
      .eq('is_active', true);
    if (error) throw error;
    return data || [];
  }

  async getPolicy(key: string): Promise<any> {
    const { data, error } = await supabase!
      .from('donation_policies')
      .select('value')
      .eq('key', key)
      .eq('is_active', true)
      .single();
    if (error) throw error;
    return data?.value;
  }

  async createDonation(donation: Omit<Donation, 'id' | 'receipt_number' | 'created_at'>): Promise<Donation> {
    const receiptNumber = `RB-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const { data, error } = await supabase!
      .from('donations')
      .insert({ ...donation, receipt_number: receiptNumber })
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async createInKindDonation(inKind: Omit<InKindDonation, 'id'>): Promise<InKindDonation> {
    const { data, error } = await supabase!
      .from('in_kind_donations')
      .insert(inKind)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async getDonorDonations(email: string): Promise<Donation[]> {
    const { data, error } = await supabase!
      .from('donations')
      .select('*')
      .eq('donor_email', email)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  async updateDonationStatus(id: string, status: string): Promise<void> {
    const { error } = await supabase!
      .from('donations')
      .update({ payment_status: status, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
  }

  async getDonationStats(): Promise<{ total: number; totalAmount: number; byType: Record<string, number> }> {
    const { data, error } = await supabase!
      .from('donations')
      .select('donation_type, amount');
    if (error) throw error;
    const donations = data || [];
    return {
      total: donations.length,
      totalAmount: donations.reduce((sum, d) => sum + (d.amount || 0), 0),
      byType: donations.reduce((acc, d) => {
        acc[d.donation_type] = (acc[d.donation_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };
  }
}

export const donationDBService = new DonationDBService();
