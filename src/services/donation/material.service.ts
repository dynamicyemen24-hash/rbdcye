import { supabase } from '@/lib/supabase';
import type { MaterialDonation, MaterialItem } from './donation-types';

export interface MaterialDonationRecord {
  id: string;
  donation_id: string;
  item_name: string;
  item_category: string;
  quantity: number;
  unit: string;
  condition: string;
  estimated_value: number;
  currency: string;
  specifications?: string;
  warranty_info?: string;
  delivery_method?: string;
  delivery_address?: string;
  delivery_date?: string;
  installation_required: boolean;
  photos?: string[];
  status: 'pending' | 'confirmed' | 'in_transit' | 'delivered' | 'installed' | 'distributed';
  created_at: string;
}

class MaterialService {
  async submitMaterialDonation(
    donationId: string,
    material: MaterialDonation
  ): Promise<MaterialDonationRecord[]> {
    const records: MaterialDonationRecord[] = [];
    
    for (const item of material.items) {
      const { data, error } = await supabase!
        .from('material_donations')
        .insert({
          donation_id: donationId,
          item_name: item.name,
          item_category: item.category,
          quantity: item.quantity,
          unit: item.unit,
          condition: item.condition,
          estimated_value: item.estimated_value,
          currency: item.currency,
          specifications: item.specifications,
          warranty_info: item.warranty_info,
          delivery_method: material.delivery_method,
          delivery_address: material.delivery_address,
          delivery_date: material.preferred_delivery_date,
          installation_required: material.installation_required,
          status: 'pending',
        })
        .select()
        .single();
      
      if (error) throw error;
      records.push(data);
    }
    
    return records;
  }

  async getMaterialDonations(donationId: string): Promise<MaterialDonationRecord[]> {
    const { data, error } = await supabase!
      .from('material_donations')
      .select('*')
      .eq('donation_id', donationId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async updateStatus(id: string, status: string): Promise<void> {
    const { error } = await supabase!
      .from('material_donations')
      .update({ status })
      .eq('id', id);
    
    if (error) throw error;
  }

  async getStats(): Promise<{
    total_items: number;
    total_value: number;
    by_category: Record<string, number>;
  }> {
    const { data, error } = await supabase!
      .from('material_donations')
      .select('item_category, estimated_value');
    
    if (error) throw error;
    const items = data || [];
    
    return {
      total_items: items.length,
      total_value: items.reduce((sum, i) => sum + (i.estimated_value || 0), 0),
      by_category: items.reduce((acc, i) => {
        acc[i.item_category] = (acc[i.item_category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };
  }
}

export const materialService = new MaterialService();
