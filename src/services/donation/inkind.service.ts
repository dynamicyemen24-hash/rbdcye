import { supabase } from '@/lib/supabase';
import type { InKindDonation, InKindItem } from './donation-types';

export interface InKindDonationRecord {
  id: string;
  donation_id: string;
  item_name: string;
  item_category: string;
  quantity: number;
  unit: string;
  condition: string;
  estimated_value: number;
  currency: string;
  delivery_method?: string;
  delivery_address?: string;
  delivery_date?: string;
  photos?: string[];
  notes?: string;
  status: 'pending' | 'confirmed' | 'picked_up' | 'delivered' | 'distributed';
  coordinator_name?: string;
  coordinator_phone?: string;
  created_at: string;
}

class InKindService {
  async submitInKindDonation(
    donationId: string,
    inKind: InKindDonation
  ): Promise<InKindDonationRecord[]> {
    const records: InKindDonationRecord[] = [];
    
    for (const item of inKind.items) {
      const { data, error } = await supabase!
        .from('in_kind_donations')
        .insert({
          donation_id: donationId,
          item_name: item.name,
          item_category: item.category,
          quantity: item.quantity,
          unit: item.unit,
          condition: item.condition,
          estimated_value: item.estimated_value,
          currency: item.currency,
          delivery_method: inKind.delivery_method,
          delivery_address: inKind.delivery_address,
          delivery_date: inKind.preferred_delivery_date,
          notes: item.description,
          status: 'pending',
        })
        .select()
        .single();
      
      if (error) throw error;
      records.push(data);
    }
    
    return records;
  }

  async getInKindDonations(donationId: string): Promise<InKindDonationRecord[]> {
    const { data, error } = await supabase!
      .from('in_kind_donations')
      .select('*')
      .eq('donation_id', donationId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async updateStatus(id: string, status: string, coordinator?: { name: string; phone: string }): Promise<void> {
    const updates: Record<string, unknown> = { status };
    if (coordinator) {
      updates.coordinator_name = coordinator.name;
      updates.coordinator_phone = coordinator.phone;
    }
    
    const { error } = await supabase!
      .from('in_kind_donations')
      .update(updates)
      .eq('id', id);
    
    if (error) throw error;
  }

  async getPendingDonations(): Promise<InKindDonationRecord[]> {
    const { data, error } = await supabase!
      .from('in_kind_donations')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async getStats(): Promise<{
    total_items: number;
    total_value: number;
    by_category: Record<string, number>;
    by_status: Record<string, number>;
  }> {
    const { data, error } = await supabase!
      .from('in_kind_donations')
      .select('item_category, estimated_value, status');
    
    if (error) throw error;
    const items = data || [];
    
    return {
      total_items: items.length,
      total_value: items.reduce((sum, i) => sum + (i.estimated_value || 0), 0),
      by_category: items.reduce((acc, i) => {
        acc[i.item_category] = (acc[i.item_category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      by_status: items.reduce((acc, i) => {
        acc[i.status] = (acc[i.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };
  }
}

export const inKindService = new InKindService();
