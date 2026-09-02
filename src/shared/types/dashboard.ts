// ========== Dashboard Types ==========

export interface DashboardUser {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "EDITOR" | "VIEWER" | "MANAGER";
  status: "active" | "inactive" | "suspended";
  permissions: string[];
  createdAt: string;
  lastLogin?: string;
  phone?: string;
  avatar?: string;
}

export interface DashboardDonation {
  id: string;
  donor: string;
  email?: string;
  phone?: string;
  amount: number;
  project: string;
  method: "card" | "mobile" | "transfer";
  date: string;
  status: "completed" | "pending" | "failed" | "refunded";
  type: "once" | "monthly";
  notes?: string;
}

export interface DashboardRequest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  type: "منظمة داعمة" | "فاعل خير" | "متبرع" | "شريك" | "متطوع" | "إعلامي" | "أخرى";
  message: string;
  date: string;
  status: "new" | "read" | "replied" | "archived";
  assignedTo?: string;
  priority?: "low" | "medium" | "high";
}

export interface DashboardVolunteer {
  id: string;
  name: string;
  phone: string;
  email: string;
  field: string;
  status: "active" | "inactive" | "pending";
  hours: number;
  joinDate: string;
  skills?: string[];
  availability?: string;
  city?: string;
}

export interface DashboardReport {
  id: string;
  title: string;
  type: "تقرير سنوي" | "نشرة دورية" | "تقرير مالي" | "دراسة" | "تقرير أداء";
  date: string;
  file: string;
  size: string;
  status: "published" | "draft" | "archived";
  description?: string;
}

export interface DashboardMedia {
  id: string;
  title: string;
  type: "image" | "video" | "document" | "audio";
  url: string;
  date: string;
  size: string;
  alt?: string;
  tags?: string[];
}

export interface DashboardMetrics {
  totalBeneficiaries: number;
  activeProjects: number;
  totalPartners: number;
  totalVolunteers: number;
  newMessages: number;
  totalDonations: number;
  monthlyDonations: number;
  donationGrowth: number;
  newsCount: number;
  storiesCount: number;
}
