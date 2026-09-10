// Complete Donation Type System
// Supports: Financial (مالي), In-Kind (عيني), Material (مادي)

export type DonationType = 'financial' | 'in_kind' | 'material';
export type PaymentMethod = 'card' | 'apple_pay' | 'google_pay' | 'bank_transfer' | 'cash' | 'mobile_wallet';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled';
export type RecurringInterval = 'once' | 'monthly' | 'quarterly' | 'yearly';
export type InKindCategory = 'clothing' | 'food' | 'blankets' | 'medical' | 'stationery' | 'electronics' | 'other';
export type MaterialCategory = 'construction' | 'furniture' | 'vehicles' | 'equipment' | 'tools' | 'other';
export type DeliveryMethod = 'pickup' | 'dropoff' | 'shipping';
export type ItemCondition = 'new' | 'good' | 'acceptable' | 'needs_repair';

export interface DonationProject {
  id: string;
  slug: string;
  title_ar: string;
  description_ar: string;
  icon: string;
  color: string;
  target_amount: number;
  current_amount: number;
  currency: string;
  is_active: boolean;
  is_featured: boolean;
  category: string;
  display_order: number;
  image_url?: string;
  beneficiaries_count?: number;
  deadline?: string;
  created_at: string;
  updated_at: string;
}

export interface FinancialDonation {
  type: 'financial';
  amount: number;
  currency: string;
  project_id?: string;
  payment_method: PaymentMethod;
  is_recurring: boolean;
  recurring_interval: RecurringInterval;
}

export interface InKindDonation {
  type: 'in_kind';
  items: InKindItem[];
  project_id?: string;
  donation_id?: string;
  item_name?: string;
  item_category?: string;
  quantity?: number;
  unit?: string;
  condition?: string;
  estimated_value?: number;
  currency?: string;
  delivery_method: DeliveryMethod;
  delivery_address?: string;
  preferred_delivery_date?: string;
  photos?: string[];
}

export interface InKindItem {
  name: string;
  category: InKindCategory;
  quantity: number;
  unit: string;
  condition: ItemCondition;
  estimated_value: number;
  currency: string;
  description?: string;
}

export interface MaterialDonation {
  type: 'material';
  items: MaterialItem[];
  project_id?: string;
  delivery_method: DeliveryMethod;
  delivery_address?: string;
  preferred_delivery_date?: string;
  installation_required: boolean;
  photos?: string[];
}

export interface MaterialItem {
  name: string;
  category: MaterialCategory;
  quantity: number;
  unit: string;
  condition: ItemCondition;
  estimated_value: number;
  currency: string;
  specifications?: string;
  warranty_info?: string;
}

export interface DonationSubmission {
  donor_name?: string;
  donor_email: string;
  donor_phone: string;
  donation: FinancialDonation | InKindDonation | MaterialDonation;
  message?: string;
  is_anonymous: boolean;
  receipt_method: 'email' | 'whatsapp' | 'both';
  metadata?: Record<string, unknown>;
}

export interface DonationReceipt {
  receipt_number: string;
  donation_id: string;
  amount?: number;
  currency?: string;
  items?: Array<{ name: string; quantity: number; estimated_value: number }>;
  date: string;
  project?: string;
  qr_code?: string;
}

export interface DonationPolicy {
  key: string;
  value: unknown;
  description: string;
  is_active: boolean;
}

// Policy keys
export const POLICY_KEYS = {
  MIN_AMOUNT: 'min_donation_amount',
  ENABLE_RECURRING: 'enable_recurring',
  ENABLE_ANONYMOUS: 'enable_anonymous',
  ENABLE_IN_KIND: 'enable_in_kind',
  ENABLE_MATERIAL: 'enable_material',
  REQUIRE_PHONE: 'require_phone',
  RECEIPT_EMAIL: 'receipt_email',
  MAX_IN_KIND_ITEMS: 'max_in_kind_items',
  MAX_MATERIAL_ITEMS: 'max_material_items',
  DELIVERY_RADIUS: 'delivery_radius_km',
} as const;

// Currency configurations
export const CURRENCIES = [
  { code: 'YER', symbol: 'ر.ي', name: 'ريال يمني', rate: 1 },
  { code: 'SAR', symbol: 'ر.س', name: 'ريال سعودي', rate: 67 },
  { code: 'USD', symbol: '$', name: 'دولار أمريكي', rate: 250 },
  { code: 'AED', symbol: 'د.إ', name: 'درهم إماراتي', rate: 68 },
  { code: 'EUR', symbol: '€', name: 'يورو', rate: 270 },
  { code: 'GBP', symbol: '£', name: 'جنيه إسترليني', rate: 315 },
] as const;

// Project categories
export const PROJECT_CATEGORIES = [
  { id: 'general', label: 'عام', icon: 'Heart' },
  { id: 'food', label: 'غذاء', icon: 'Utensils' },
  { id: 'water', label: 'مياه', icon: 'Droplets' },
  { id: 'education', label: 'تعليم', icon: 'BookOpen' },
  { id: 'orphans', label: 'أيتام', icon: 'Users' },
  { id: 'zakat', label: 'زكاة', icon: 'Coins' },
  { id: 'winter', label: 'شتاء', icon: 'Thermometer' },
  { id: 'medical', label: 'صحي', icon: 'Stethoscope' },
] as const;
