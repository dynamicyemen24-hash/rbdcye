// ============================================================
// Multi-Project Donation Engine - Enterprise Grade
// يربط الموقع بقاعدة البيانات ويسمح بالتبرع لمشاريع متعددة
// ============================================================

import { analyticsService } from "./analytics.service";
import { auditService } from "./audit.service";
import {
  paymentGateway,
  type PaymentMethod,
  type PaymentCurrency,
} from "./payment-gateway.service";
import { supabase, DB_SCHEMA } from "./supabase.client";

// ============================================================
// Types
// ============================================================
export interface ProjectAllocation {
  projectId: string;
  projectName: string;
  projectImage?: string;
  amount: number;
  percentage?: number;
  isCustom: boolean;
}

export interface MultiProjectDonationRequest {
  donorId?: string;
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  donorCountry?: string;
  allocations: ProjectAllocation[];
  totalAmount: number;
  currency: PaymentCurrency;
  paymentMethod: PaymentMethod;
  paymentType: "once" | "monthly" | "yearly" | "zakat" | "sadaqah" | "waqf";
  isAnonymous: boolean;
  dedication?: string;
  dedicationType?: "general" | "specific" | "memorial";
  notes?: string;
  source?: "web" | "mobile" | "sms" | "whatsapp" | "in_person";
  metadata?: Record<string, unknown>;
  agreeToTerms: boolean;
  agreeToContact: boolean;
}

export interface DonationReceipt {
  id: string;
  transactionId: string;
  donorName: string;
  donorEmail: string;
  totalAmount: number;
  currency: PaymentCurrency;
  paymentMethod: string;
  allocations: ProjectAllocation[];
  status: "pending" | "completed" | "failed" | "refunded";
  createdAt: string;
  completedAt?: string;
  receiptNumber: string;
  qrData?: string;
  organizationInfo: {
    name: string;
    nameAr: string;
    taxNumber: string;
    licenseNumber: string;
    address: string;
    phone: string;
    email: string;
  };
}

export interface DonationSummary {
  id: string;
  transactionId: string;
  totalAmount: number;
  currency: string;
  projectCount: number;
  projects: string[];
  status: string;
  createdAt: string;
  receiptNumber: string;
}

// ============================================================
// Available Projects (synced with database)
// ============================================================
const DEFAULT_PROJECTS: ProjectAllocation[] = [
  {
    projectId: "p1",
    projectName: "بئر ماء - الحديدة",
    projectImage: "/images/defaults/project-water.svg",
    amount: 0,
    isCustom: true,
  },
  {
    projectId: "p2",
    projectName: "كفالة يتيم",
    projectImage: "/images/defaults/project-relief.svg",
    amount: 0,
    isCustom: true,
  },
  {
    projectId: "p3",
    projectName: "سلة غذائية رمضان",
    projectImage: "/images/defaults/project-default.svg",
    amount: 0,
    isCustom: true,
  },
  {
    projectId: "p4",
    projectName: "الوقف التعليمي",
    projectImage: "/images/defaults/project-education.svg",
    amount: 0,
    isCustom: true,
  },
  {
    projectId: "p5",
    projectName: "الرعاية الصحية",
    projectImage: "/images/defaults/project-development.svg",
    amount: 0,
    isCustom: true,
  },
  {
    projectId: "p6",
    projectName: "إغاثة طارئة",
    projectImage: "/images/defaults/project-infrastructure.svg",
    amount: 0,
    isCustom: true,
  },
  { projectId: "p7", projectName: "دعم المشاريع التنموية", amount: 0, isCustom: true },
  { projectId: "p8", projectName: "عام - حيث تحتاج المؤسسة", amount: 0, isCustom: true },
];

// ============================================================
// Receipt Generator
// ============================================================
const ORGANIZATION_INFO = {
  name: "Rahmaa Bainahum Foundation",
  nameAr: "مؤسسة رحماء بينهم الخيرية",
  taxNumber: "TX-2024-ROH-001",
  licenseNumber: "LIC-2024-CF-789",
  address: "مسقط، سلطنة عمان",
  phone: "+968-777888194",
  email: "info@rbdcye.org",
};

function generateReceiptNumber(): string {
  const year = new Date().getFullYear();
  const sequential = Math.floor(Math.random() * 99999)
    .toString()
    .padStart(5, "0");
  return `RCP-${year}-${sequential}`;
}

function generateTransactionId(): string {
  const prefix = "TXN";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

// ============================================================
// Multi-Project Donation Service
// ============================================================
class MultiProjectDonationService {
  private static instance: MultiProjectDonationService;
  private receipts: DonationReceipt[] = [];
  private pendingAllocations: Map<string, ProjectAllocation[]> = new Map();

  static getInstance(): MultiProjectDonationService {
    if (!MultiProjectDonationService.instance) {
      MultiProjectDonationService.instance = new MultiProjectDonationService();
    }
    return MultiProjectDonationService.instance;
  }

  // ============================================================
  // 1. Project Discovery - يجلب المشاريع من قاعدة البيانات
  // ============================================================
  async getAvailableProjects(): Promise<ProjectAllocation[]> {
    try {
      // Try Supabase first
      if (supabase) {
        const { data, error } = await supabase
          .schema(DB_SCHEMA)
          .from("projects")
          .select("id, title, image, status, category")
          .eq("status", "active")
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          return data.map((p: any) => ({
            projectId: p.id,
            projectName: p.title,
            projectImage: p.image || undefined,
            amount: 0,
            isCustom: true,
          }));
        }
      }
    } catch {
      // Fallback to default projects
    }

    // Try API
    try {
      const response = await fetch("/api/projects?status=active");
      if (response.ok) {
        const projects = await response.json();
        if (Array.isArray(projects) && projects.length > 0) {
          return projects.map((p: any) => ({
            projectId: p.id,
            projectName: p.title,
            projectImage: p.image || undefined,
            amount: 0,
            isCustom: true,
          }));
        }
      }
    } catch {
      // Fallback to default
    }

    return DEFAULT_PROJECTS;
  }

  // ============================================================
  // 2. Split Donation Across Projects
  // ============================================================
  splitDonationEqually(totalAmount: number, projects: ProjectAllocation[]): ProjectAllocation[] {
    if (projects.length === 0) return [];
    const equalShare = Math.floor(totalAmount / projects.length);
    const remainder = totalAmount - equalShare * projects.length;

    return projects.map((p, i) => ({
      ...p,
      amount: i === 0 ? equalShare + remainder : equalShare,
      percentage:
        Math.round(((i === 0 ? equalShare + remainder : equalShare) / totalAmount) * 100 * 100) /
        100,
    }));
  }

  splitDonationByPercentage(
    totalAmount: number,
    allocations: { projectId: string; percentage: number }[]
  ): ProjectAllocation[] {
    const totalPercent = allocations.reduce((sum, a) => sum + a.percentage, 0);
    if (Math.abs(totalPercent - 100) > 1) {
      throw new Error("مجموع النسب المئوية يجب أن يساوي 100%");
    }

    return allocations.map((a) => {
      const project = DEFAULT_PROJECTS.find((p) => p.projectId === a.projectId);
      return {
        projectId: a.projectId,
        projectName: project?.projectName || "مشروع غير معروف",
        amount: Math.floor((totalAmount * a.percentage) / 100),
        percentage: a.percentage,
        isCustom: true,
      };
    });
  }

  // ============================================================
  // 3. Process Multi-Project Donation
  // ============================================================
  async processDonation(request: MultiProjectDonationRequest): Promise<DonationReceipt> {
    // Validate
    if (!request.agreeToTerms) {
      throw new Error("يجب الموافقة على شروط التبرع");
    }
    if (request.allocations.length === 0) {
      throw new Error("يجب اختيار مشروع واحد على الأقل");
    }
    if (request.totalAmount <= 0) {
      throw new Error("مبلغ التبرع يجب أن يكون أكبر من صفر");
    }

    // Validate allocation sums
    const allocatedTotal = request.allocations.reduce((sum, a) => sum + a.amount, 0);
    if (allocatedTotal !== request.totalAmount) {
      throw new Error(
        `مجموع المبالغ الموزعة (${allocatedTotal}) لا يساوي المبلغ الإجمالي (${request.totalAmount})`
      );
    }

    const transactionId = generateTransactionId();
    const receiptNumber = generateReceiptNumber();

    // Save pending allocations
    this.pendingAllocations.set(transactionId, request.allocations);

    // Process through payment gateway
    let paymentResult;
    try {
      paymentResult = await paymentGateway.initiatePayment({
        amount: request.totalAmount,
        currency: request.currency,
        method: request.paymentMethod,
        type: request.paymentType,
        donorName: request.donorName,
        donorEmail: request.donorEmail,
        donorPhone: request.donorPhone,
        description: `تبرع لـ ${request.allocations.length} مشاريع: ${request.allocations.map((a) => a.projectName).join(", ")}`,
        metadata: {
          transactionId,
          receiptNumber,
          isMultiProject: true,
          projectCount: request.allocations.length,
          allocations: request.allocations.map((a) => ({
            projectId: a.projectId,
            amount: a.amount,
          })),
        },
      });
    } catch (error) {
      // Save failed donation locally
      const failedReceipt = this.createReceipt(request, transactionId, receiptNumber, "failed");
      this.receipts.push(failedReceipt);
      throw error;
    }

    // Create receipt
    const receipt = this.createReceipt(
      request,
      transactionId,
      receiptNumber,
      paymentResult.status === "completed" ? "completed" : "pending",
      paymentResult
    );

    this.receipts.push(receipt);

    // Save to database
    try {
      await this.saveDonationToDatabase(receipt, request);
    } catch (dbError) {
      console.error("Failed to save donation to database:", dbError);
      // Don't throw - the receipt is still valid locally
    }

    // Audit log
    try {
      const userId = request.donorId || "anonymous";
      await auditService.logCrud(
        "CREATE",
        "donation",
        receipt.id,
        `تبرع جديد بقيمة ${receipt.totalAmount} ${receipt.currency} لـ ${request.allocations.length} مشاريع`,
        userId,
        request.donorName,
        "DONOR",
        { transactionId, projectCount: request.allocations.length }
      );
    } catch {
      // Audit log failure is non-critical
    }

    return receipt;
  }

  private createReceipt(
    request: MultiProjectDonationRequest,
    transactionId: string,
    receiptNumber: string,
    status: DonationReceipt["status"],
    paymentResult?: any
  ): DonationReceipt {
    return {
      id: `don_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      transactionId,
      donorName: request.isAnonymous ? "متبرع كريم" : request.donorName,
      donorEmail: request.donorEmail,
      totalAmount: request.totalAmount,
      currency: request.currency,
      paymentMethod: request.paymentMethod,
      allocations: request.allocations,
      status,
      createdAt: new Date().toISOString(),
      completedAt: status === "completed" ? new Date().toISOString() : undefined,
      receiptNumber,
      qrData: JSON.stringify({ receiptNumber, transactionId, totalAmount: request.totalAmount }),
      organizationInfo: ORGANIZATION_INFO,
    };
  }

  // ============================================================
  // 4. Save to Database (Postgres/Supabase + LocalStorage)
  // ============================================================
  private async saveDonationToDatabase(
    receipt: DonationReceipt,
    request: MultiProjectDonationRequest
  ): Promise<void> {
    // Save each project allocation separately
    const allocationPromises = request.allocations.map((allocation) =>
      this.saveProjectAllocation(receipt, allocation, request)
    );

    // Save master donation record
    const masterPromise = this.saveMasterDonation(receipt, request);

    await Promise.all([...allocationPromises, masterPromise]);
  }

  private async saveProjectAllocation(
    receipt: DonationReceipt,
    allocation: ProjectAllocation,
    request: MultiProjectDonationRequest
  ): Promise<void> {
    const donationRecord = {
      id: `alloc_${receipt.id}_${allocation.projectId}`,
      receipt_id: receipt.id,
      transaction_id: receipt.transactionId,
      receipt_number: receipt.receiptNumber,
      donor_name: request.isAnonymous ? "متبرع كريم" : request.donorName,
      donor_email: request.donorEmail,
      donor_phone: request.donorPhone || null,
      donor_country: request.donorCountry || null,
      project_id: allocation.projectId,
      project_name: allocation.projectName,
      amount: allocation.amount,
      currency: request.currency,
      payment_method: request.paymentMethod,
      payment_type: request.paymentType,
      is_anonymous: request.isAnonymous,
      dedication: request.dedication || null,
      dedication_type: request.dedicationType || null,
      notes: request.notes || null,
      source: request.source || "web",
      status: receipt.status,
      created_at: receipt.createdAt,
      completed_at: receipt.completedAt || null,
      is_multi_project: true,
      total_donation_amount: request.totalAmount,
      project_count: request.allocations.length,
    };

    // Try Supabase
    try {
      if (supabase) {
        const { error } = await supabase
          .schema(DB_SCHEMA)
          .from("donations")
          .insert([donationRecord]);

        if (!error) return;
      }
    } catch {
      // Fallback
    }

    // Try API
    try {
      const response = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(donationRecord),
      });
      if (response.ok) return;
    } catch {
      // Fallback to local
    }

    // Save locally
    this.saveDonationLocally(donationRecord);
  }

  private async saveMasterDonation(
    receipt: DonationReceipt,
    request: MultiProjectDonationRequest
  ): Promise<void> {
    const masterRecord = {
      id: receipt.id,
      transaction_id: receipt.transactionId,
      receipt_number: receipt.receiptNumber,
      donor_name: request.isAnonymous ? "متبرع كريم" : request.donorName,
      donor_email: request.donorEmail,
      total_amount: request.totalAmount,
      currency: request.currency,
      payment_method: request.paymentMethod,
      payment_type: request.paymentType,
      is_anonymous: request.isAnonymous,
      project_count: request.allocations.length,
      projects: request.allocations.map((a) => a.projectName).join(", "),
      source: request.source || "web",
      status: receipt.status,
      created_at: receipt.createdAt,
    };

    try {
      if (supabase) {
        await supabase.schema(DB_SCHEMA).from("donation_masters").insert([masterRecord]);
      }
    } catch {
      // Master record is non-critical
    }
  }

  private saveDonationLocally(record: any): void {
    try {
      const existing = JSON.parse(localStorage.getItem("rh_donations_data") || "[]");
      existing.unshift(record);
      localStorage.setItem("rh_donations_data", JSON.stringify(existing.slice(0, 500)));
    } catch {
      // Silently fail
    }
  }

  // ============================================================
  // 5. Receipt & History Management
  // ============================================================
  getReceipt(transactionId: string): DonationReceipt | null {
    return this.receipts.find((r) => r.transactionId === transactionId) || null;
  }

  async getDonorHistory(email: string): Promise<DonationSummary[]> {
    const localHistory = this.receipts
      .filter((r) => r.donorEmail === email)
      .map((r) => ({
        id: r.id,
        transactionId: r.transactionId,
        totalAmount: r.totalAmount,
        currency: r.currency,
        projectCount: r.allocations.length,
        projects: r.allocations.map((a) => a.projectName),
        status: r.status,
        createdAt: r.createdAt,
        receiptNumber: r.receiptNumber,
      }));

    // Try database for additional history
    try {
      if (supabase) {
        const { data, error } = await supabase
          .schema(DB_SCHEMA)
          .from("donations")
          .select("*")
          .eq("donor_email", email)
          .order("created_at", { ascending: false })
          .limit(50);

        if (!error && data) {
          const dbHistory = data.map((d: any) => ({
            id: d.id,
            transactionId: d.transaction_id,
            totalAmount: d.total_donation_amount || d.amount,
            currency: d.currency,
            projectCount: d.project_count || 1,
            projects: d.project_name ? [d.project_name] : [],
            status: d.status,
            createdAt: d.created_at,
            receiptNumber: d.receipt_number || "",
          }));
          return [...localHistory, ...dbHistory].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }
      }
    } catch {
      // Return local history
    }

    return localHistory;
  }

  async getUserDonorId(email: string): Promise<string | null> {
    try {
      // Try to find existing donor
      if (supabase) {
        const { data } = await supabase
          .schema(DB_SCHEMA)
          .from("subscribers")
          .select("id")
          .eq("email", email)
          .maybeSingle();

        if (data?.id) return data.id;
      }
    } catch {
      // Continue
    }
    return null;
  }

  // ============================================================
  // 6. Dashboard & Analytics Integration
  // ============================================================
  async getDonationStats(): Promise<{
    totalDonations: number;
    totalAmount: number;
    averageDonation: number;
    projectBreakdown: Record<string, number>;
    monthlyTrend: { month: string; amount: number; count: number }[];
    topProjects: { name: string; amount: number; count: number }[];
  }> {
    const allReceipts = this.receipts.filter((r) => r.status === "completed");
    const totalAmount = allReceipts.reduce((sum, r) => sum + r.totalAmount, 0);
    const projectBreakdown: Record<string, number> = {};
    const monthlyMap: Record<string, { amount: number; count: number }> = {};
    const projectCount: Record<string, { amount: number; count: number }> = {};

    allReceipts.forEach((receipt) => {
      receipt.allocations.forEach((allocation) => {
        projectBreakdown[allocation.projectName] =
          (projectBreakdown[allocation.projectName] || 0) + allocation.amount;

        const key = receipt.createdAt.substring(0, 7); // YYYY-MM
        monthlyMap[key] = monthlyMap[key] || { amount: 0, count: 0 };
        monthlyMap[key].amount += allocation.amount;
        monthlyMap[key].count += 1;

        projectCount[allocation.projectName] = projectCount[allocation.projectName] || {
          amount: 0,
          count: 0,
        };
        projectCount[allocation.projectName].amount += allocation.amount;
        projectCount[allocation.projectName].count += 1;
      });
    });

    const monthlyTrend = Object.entries(monthlyMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({ month, ...data }));

    const topProjects = Object.entries(projectCount)
      .sort(([, a], [, b]) => b.amount - a.amount)
      .slice(0, 5)
      .map(([name, data]) => ({ name, ...data }));

    return {
      totalDonations: allReceipts.length,
      totalAmount,
      averageDonation: allReceipts.length > 0 ? totalAmount / allReceipts.length : 0,
      projectBreakdown,
      monthlyTrend,
      topProjects,
    };
  }

  // ============================================================
  // 7. Generate Impact Certificate
  // ============================================================
  generateImpactCertificate(receipt: DonationReceipt): string {
    const beneficiaries = receipt.allocations.map((a) => {
      const impactMap: Record<string, { metric: string; value: string }> = {
        "بئر ماء - الحديدة": {
          metric: "أسر تستفيد من المياه",
          value: `${Math.floor(a.amount / 30)}`,
        },
        "كفالة يتيم": { metric: "أطفال مكفولون", value: `${Math.floor(a.amount / 8000)}` },
        "سلة غذائية رمضان": { metric: "أسر تتغذى", value: `${Math.floor(a.amount / 7000)}` },
        "الوقف التعليمي": { metric: "طلاب يتعلمون", value: `${Math.floor(a.amount / 5000)}` },
        "الرعاية الصحية": { metric: "مرضى يعالجون", value: `${Math.floor(a.amount / 3000)}` },
        "إغاثة طارئة": { metric: "متضررون يستفيدون", value: `${Math.floor(a.amount / 2000)}` },
        "دعم المشاريع التنموية": { metric: "أسر متمكنة", value: `${Math.floor(a.amount / 10000)}` },
      };
      const impact = impactMap[a.projectName] || {
        metric: "مستفيدون",
        value: `${Math.floor(a.amount / 1000)}`,
      };
      return `${a.projectName}: ${impact.value} ${impact.metric}`;
    });

    return `
      ============================================
      شهادة أثر - مؤسسة رحماء بينهم
      ============================================
      رقم الإيصال: ${receipt.receiptNumber}
      التاريخ: ${new Date(receipt.createdAt).toLocaleDateString("ar-SA")}
      المتبرع: ${receipt.donorName}
      
      تم توزيع تبرعك على ${receipt.allocations.length} مشاريع:
      ${beneficiaries.join("\n      ")}
      
      إجمالي المبلغ: ${receipt.totalAmount.toLocaleString("ar-SA")} ${receipt.currency}
      
      "مثل المؤمنين في توادهم وتراحمهم وتعاطفهم مثل الجسد الواحد"
      ============================================
    `;
  }
}

// ============================================================
// React Hook for Multi-Project Donation
// ============================================================
export function useMultiProjectDonation() {
  const service = MultiProjectDonationService.getInstance();

  return {
    processDonation: (request: MultiProjectDonationRequest) => service.processDonation(request),
    getAvailableProjects: () => service.getAvailableProjects(),
    splitEqually: (amount: number, projects: ProjectAllocation[]) =>
      service.splitDonationEqually(amount, projects),
    splitByPercentage: (amount: number, allocations: { projectId: string; percentage: number }[]) =>
      service.splitDonationByPercentage(amount, allocations),
    getReceipt: (transactionId: string) => service.getReceipt(transactionId),
    getDonorHistory: (email: string) => service.getDonorHistory(email),
    getDonationStats: () => service.getDonationStats(),
    generateImpactCertificate: (receipt: DonationReceipt) =>
      service.generateImpactCertificate(receipt),
  };
}

export const multiProjectDonationService = MultiProjectDonationService.getInstance();
