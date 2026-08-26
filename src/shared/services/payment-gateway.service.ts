// ============================================================
// Payment Gateway Service - Enterprise Grade
// Supports: Stripe, PayPal, Bank Transfer, Local Methods
// ============================================================

export type PaymentMethod = 'card' | 'bank' | 'cash' | 'stripe' | 'paypal' | 'moyasar' | 'tabby' | 'tamara';
export type PaymentCurrency = 'YER' | 'SAR' | 'USD' | 'AED' | 'OMR';
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'cancelled';
export type PaymentType = 'once' | 'monthly' | 'yearly' | 'zakat' | 'sadaqah' | 'waqf';

interface PaymentRequest {
  amount: number;
  currency: PaymentCurrency;
  method: PaymentMethod;
  type: PaymentType;
  projectId?: string;
  donorName?: string;
  donorEmail?: string;
  donorPhone?: string;
  description?: string;
  metadata?: Record<string, unknown>;
  recurring?: boolean;
  recurringInterval?: 'monthly' | 'yearly';
}

interface PaymentResponse {
  id: string;
  transactionId: string;
  status: PaymentStatus;
  amount: number;
  currency: PaymentCurrency;
  method: PaymentMethod;
  receiptUrl?: string;
  confirmationCode?: string;
  paymentUrl?: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

interface PaymentMethodInfo {
  id: PaymentMethod;
  name: string;
  nameAr: string;
  icon: string;
  fee: number;
  minAmount: number;
  maxAmount: number;
  processingTime: string;
  supported: boolean;
  requiresKYC: boolean;
}

// Payment methods configuration
const PAYMENT_METHODS: PaymentMethodInfo[] = [
  {
    id: 'card',
    name: 'Credit/Debit Card',
    nameAr: 'بطاقة ائتمان/خصم',
    icon: 'credit-card',
    fee: 2.5,
    minAmount: 1,
    maxAmount: 50000,
    processingTime: 'فوري',
    supported: true,
    requiresKYC: false,
  },
  {
    id: 'bank',
    name: 'Bank Transfer',
    nameAr: 'تحويل بنكي',
    icon: 'bank',
    fee: 0,
    minAmount: 100,
    maxAmount: 1000000,
    processingTime: '1-3 أيام',
    supported: true,
    requiresKYC: true,
  },
  {
    id: 'stripe',
    name: 'Stripe',
    nameAr: 'Stripe',
    icon: 'stripe',
    fee: 2.9,
    minAmount: 1,
    maxAmount: 50000,
    processingTime: 'فوري',
    supported: true,
    requiresKYC: false,
  },
  {
    id: 'moyasar',
    name: 'Moyasar',
    nameAr: 'Moyasar - مدى/فيزا',
    icon: 'credit-card',
    fee: 2.7,
    minAmount: 1,
    maxAmount: 50000,
    processingTime: 'فوري',
    supported: true,
    requiresKYC: false,
  },
  {
    id: 'cash',
    name: 'Cash',
    nameAr: 'نقدي',
    icon: 'cash',
    fee: 0,
    minAmount: 1,
    maxAmount: 100000,
    processingTime: 'حسب التنسيق',
    supported: true,
    requiresKYC: true,
  },
  {
    id: 'paypal',
    name: 'PayPal',
    nameAr: 'PayPal',
    icon: 'paypal',
    fee: 3.4,
    minAmount: 1,
    maxAmount: 10000,
    processingTime: 'فوري',
    supported: false,
    requiresKYC: false,
  },
  {
    id: 'tabby',
    name: 'Tabby (BNPL)',
    nameAr: 'تابي - اشتر الآن',
    icon: 'credit-card',
    fee: 0,
    minAmount: 100,
    maxAmount: 5000,
    processingTime: 'فوري',
    supported: false,
    requiresKYC: true,
  },
];

class PaymentGatewayService {
  private static instance: PaymentGatewayService;
  private pendingTransactions: Map<string, PaymentRequest> = new Map();
  private completedTransactions: PaymentResponse[] = [];

  static getInstance(): PaymentGatewayService {
    if (!PaymentGatewayService.instance) {
      PaymentGatewayService.instance = new PaymentGatewayService();
    }
    return PaymentGatewayService.instance;
  }

  getAvailableMethods(): PaymentMethodInfo[] {
    return PAYMENT_METHODS.filter(m => m.supported);
  }

  async initiatePayment(request: PaymentRequest): Promise<PaymentResponse> {
    // Validate amount
    const method = PAYMENT_METHODS.find(m => m.id === request.method);
    if (!method) throw new Error(`طريقة الدفع ${request.method} غير مدعومة`);
    if (request.amount < method.minAmount) throw new Error(`الحد الأدنى للتبرع ${method.minAmount} ${request.currency}`);
    if (request.amount > method.maxAmount) throw new Error(`الحد الأقصى للتبرع ${method.maxAmount} ${request.currency}`);

    const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const response: PaymentResponse = {
      id: `pay_${Date.now()}`,
      transactionId,
      status: 'pending',
      amount: request.amount,
      currency: request.currency,
      method: request.method,
      createdAt: new Date().toISOString(),
    };

    // Store pending transaction
    this.pendingTransactions.set(transactionId, request);

    // Route to appropriate handler
    switch (request.method) {
      case 'stripe':
        return this.handleStripePayment(request, response);
      case 'moyasar':
        return this.handleMoyasarPayment(request, response);
      case 'card':
        return this.handleCardPayment(request, response);
      case 'bank':
        return this.handleBankTransfer(request, response);
      case 'cash':
        return this.handleCashPayment(request, response);
      default:
        response.status = 'processing';
        response.confirmationCode = transactionId;
        return response;
    }
  }

  private async handleStripePayment(request: PaymentRequest, base: PaymentResponse): Promise<PaymentResponse> {
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: request.amount * 100, // Convert to cents
          currency: request.currency.toLowerCase(),
          description: request.description || 'تبرع لمؤسسة رحماء بينهم',
          metadata: {
            projectId: request.projectId,
            donorName: request.donorName,
            donorEmail: request.donorEmail,
          },
        }),
      });

      if (!response.ok) throw new Error('فشل إنشاء جلسة الدفع');

      const data = await response.json();
      return {
        ...base,
        status: 'processing',
        paymentUrl: data.url,
        transactionId: data.sessionId || base.transactionId,
      };
    } catch (error) {
      return {
        ...base,
        status: 'failed',
        confirmationCode: error instanceof Error ? error.message : 'خطأ في الدفع',
      };
    }
  }

  private async handleMoyasarPayment(request: PaymentRequest, base: PaymentResponse): Promise<PaymentResponse> {
    // Moyasar handles Mada/Visa/MasterCard in Saudi Arabia
    return {
      ...base,
      status: 'processing',
      paymentUrl: `https://api.moyasar.com/v1/payments?amount=${request.amount * 100}&currency=${request.currency}&description=${encodeURIComponent(request.description || 'تبرع')}`,
    };
  }

  private async handleCardPayment(request: PaymentRequest, base: PaymentResponse): Promise<PaymentResponse> {
    // Simulate card processing - in production, integrate with real gateway
    return {
      ...base,
      status: 'completed',
      receiptUrl: `/receipts/${base.transactionId}.pdf`,
      confirmationCode: base.transactionId,
      createdAt: new Date().toISOString(),
    };
  }

  private async handleBankTransfer(request: PaymentRequest, base: PaymentResponse): Promise<PaymentResponse> {
    // ⚠️ بيانات الحساب البنكي يجب أن تأتي من الخادم فقط — لا تُخزَّن في الكود الأمامي
    return {
      ...base,
      status: 'pending',
      confirmationCode: `BNK_${base.transactionId}`,
      metadata: {
        message: 'يرجى التواصل مع المؤسسة للحصول على التفاصيل البنكية',
        contactEmail: 'info@rbdcye.org',
      },
    };
  }

  private async handleCashPayment(request: PaymentRequest, base: PaymentResponse): Promise<PaymentResponse> {
    return {
      ...base,
      status: 'pending',
      confirmationCode: `CSH_${base.transactionId}`,
      metadata: {
        message: 'يرجى التواصل مع المؤسسة لتنسيق استلام التبرع النقدي',
        contactEmail: 'info@rbdcye.org',
      },
    };
  }

  async confirmPayment(transactionId: string, status: PaymentStatus): Promise<PaymentResponse> {
    const request = this.pendingTransactions.get(transactionId);
    if (!request) throw new Error('المعاملة غير موجودة');

    const response: PaymentResponse = {
      id: `pay_${Date.now()}`,
      transactionId,
      status,
      amount: request.amount,
      currency: request.currency,
      method: request.method,
      receiptUrl: status === 'completed' ? `/receipts/${transactionId}.pdf` : undefined,
      confirmationCode: transactionId,
      createdAt: new Date().toISOString(),
    };

    this.completedTransactions.push(response);
    this.pendingTransactions.delete(transactionId);

    return response;
  }

  async getTransaction(transactionId: string): Promise<PaymentResponse | null> {
    const completed = this.completedTransactions.find(t => t.transactionId === transactionId);
    if (completed) return completed;

    const pending = this.pendingTransactions.get(transactionId);
    if (pending) {
      return {
        id: `pay_${Date.now()}`,
        transactionId,
        status: 'pending',
        amount: pending.amount,
        currency: pending.currency,
        method: pending.method,
        createdAt: new Date().toISOString(),
      };
    }

    return null;
  }

  async refundPayment(transactionId: string, reason?: string): Promise<PaymentResponse> {
    const transaction = this.completedTransactions.find(t => t.transactionId === transactionId);
    if (!transaction) throw new Error('المعاملة غير موجودة');

    transaction.status = 'refunded';
    transaction.metadata = { ...transaction.metadata, refundReason: reason, refundedAt: new Date().toISOString() };

    return transaction;
  }

  getPaymentHistory(): PaymentResponse[] {
    return [...this.completedTransactions].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async generateReceipt(transactionId: string): Promise<string> {
    const transaction = this.completedTransactions.find(t => t.transactionId === transactionId);
    if (!transaction) throw new Error('المعاملة غير موجودة');

    return `/receipts/${transactionId}.pdf`;
  }

  getStats() {
    const completed = this.completedTransactions.filter(t => t.status === 'completed');
    const totalRevenue = completed.reduce((sum, t) => sum + t.amount, 0);
    const byMethod = completed.reduce((acc: Record<string, number>, t) => {
      acc[t.method] = (acc[t.method] || 0) + t.amount;
      return acc;
    }, {});

    return {
      totalTransactions: this.completedTransactions.length,
      completedTransactions: completed.length,
      pendingTransactions: this.pendingTransactions.size,
      totalRevenue,
      averageDonation: completed.length > 0 ? totalRevenue / completed.length : 0,
      revenueByMethod: byMethod,
    };
  }
}

// Zakat calculation
export function calculateZakat(amount: number, assetType: 'cash' | 'gold' | 'silver' | 'business' | 'stocks' = 'cash'): number {
  const nisabThresholds = {
    cash: 5000, // Approximate SAR
    gold: 850, // Grams
    silver: 5950, // Grams
    business: 5000,
    stocks: 5000,
  };

  const threshold = nisabThresholds[assetType];
  if (amount < threshold) return 0;

  return amount * 0.025; // 2.5% Zakat
}

export const paymentGateway = PaymentGatewayService.getInstance();