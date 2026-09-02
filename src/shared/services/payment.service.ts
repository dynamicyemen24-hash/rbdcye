// Payment Service - Stripe Integration
// هذا الملف يوفر دمج Stripe للتبرعات الحقيقية

import { useState } from "react";

// استعارة لأنواع Stripe على النافذ
declare global {
  interface Window {
    Stripe: any;
  }
}

interface PaymentConfig {
  publicKey: string;
  currency: string;
  country: string;
}

interface DonationData {
  amount: number;
  donor: string;
  email?: string;
  phone?: string;
  project?: string;
  type?: 'once' | 'monthly' | 'yearly';
  message?: string;
}

// تكوين Stripe (يجب إضافة المفاتيح في .env)
const getStripeConfig = (): PaymentConfig => ({
  publicKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY || '',
  currency: 'usd',
  country: 'YE', // اليمن
});

// تحميل Stripe.js
const loadStripe = async () => {
  const config = getStripeConfig();
  if (!config.publicKey) {
    throw new Error('Stripe public key not configured. Please add VITE_STRIPE_PUBLIC_KEY to your .env file');
  }
  
  // تحقق من التحميل مسبقاً
  if (window.Stripe) {
    return window.Stripe;
  }
  
  // تحميل Stripe من CDN
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/';
    script.async = true;
    
    script.onload = () => {
      if (window.Stripe) {
        resolve(window.Stripe);
      } else {
        reject(new Error('Failed to load Stripe from window'));
      }
    };
    script.onerror = () => reject(new Error('Failed to load Stripe script'));
    
    document.head.appendChild(script);
  });
};

// إنشاء Checkout Session على الخادم
export async function createCheckoutSession(data: DonationData): Promise<string> {
  const response = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: Math.round(data.amount * 100), // Stripe يستخدم السنتات
      currency: getStripeConfig().currency,
      donor: data.donor,
      email: data.email,
      phone: data.phone,
      project: data.project,
      type: data.type,
      successUrl: `${window.location.origin}/donate?success=1`,
      cancelUrl: `${window.location.origin}/donate`,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create checkout session: ${errorText}`);
  }

  const { sessionId } = await response.json();
  return sessionId;
}

// فتح نافذة الدفع
export async function openPaymentModal(data: DonationData): Promise<void> {
  const StripeConstructor = await loadStripe();
  const stripe = StripeConstructor(getStripeConfig().publicKey);

  // إنشاء Checkout Session
  const sessionId = await createCheckoutSession(data);
  
  // التوجه إلى Stripe Checkout
  const result = await stripe.redirectToCheckout({ sessionId });
  
  if (result.error) {
    throw new Error(result.error.message);
  }
}

// معالجة التبرع
export async function processDonation(data: DonationData): Promise<void> {
  await openPaymentModal(data);
}

// Hook لاستخدام الخدمة
export function usePayment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const donate = async (data: DonationData) => {
    setLoading(true);
    setError(null);
    try {
      await processDonation(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return { donate, loading, error };
}

