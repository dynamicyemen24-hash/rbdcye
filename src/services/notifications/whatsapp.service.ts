// WhatsApp Service — روابط wa.me (تعمل دائماً) + إرسال عبر الخادم عند توفر مفتاح API
// مفتاح API لا يُخزَّن أبداً في المتصفح — الإرسال المباشر يتم عبر /api/whatsapp (server-side).

import { backgroundSync, fetchWithRetry } from "@/utils/offline";

export type WhatsAppTemplate = "donation-thanks" | "volunteer-welcome" | "general";

const DEFAULT_NUMBER = "+967780777007";

function digitsOnly(phone: string): string {
  return phone.replace(/[^\d]/g, "");
}

/** تطبيع أرقام اليمن: 77xxxxxxx → ‎+96777xxxxxxx */
export function normalizeYePhone(phone: string): string {
  const digits = digitsOnly(phone);
  if (digits.startsWith("967") && digits.length >= 12) return `+${digits}`;
  if (digits.length === 9 && digits.startsWith("7")) return `+967${digits}`;
  if (digits.startsWith("00")) return `+${digits.slice(2)}`;
  return phone.startsWith("+") ? phone : `+${digits}`;
}

/** تحقق أساسي من صيغة الرقم (E.164 مبسّط) */
export function isValidPhone(phone: string): boolean {
  const digits = digitsOnly(phone);
  return digits.length >= 9 && digits.length <= 15;
}

export function buildWhatsAppLink(phone: string, message: string): string {
  const normalized = normalizeYePhone(phone);
  return `https://wa.me/${digitsOnly(normalized)}?text=${encodeURIComponent(message)}`;
}

export function buildTemplateMessage(
  template: WhatsAppTemplate,
  vars: { name?: string; amount?: number; question?: string } = {},
): string {
  const name = (vars.name ?? "").trim() || "صديقنا الكريم";
  switch (template) {
    case "donation-thanks":
      return `شكراً لك ${name} على تبرعك الكريم${vars.amount ? ` بمبلغ ${vars.amount} دولار` : ""}. مساهمتك تصنع فرقاً حقيقياً في حياة الأسر اليمنية. #رحماء_بينهم`;
    case "volunteer-welcome":
      return `أهلاً ${name}، تم تسجيلك كمتطوع في مؤسسة رحماء بينهم. سنتواصل معك قريباً بشأن الفرص المتاحة.`;
    case "general":
    default:
      return `مرحباً ${name}${vars.question ? `، استلمنا استفسارك: "${vars.question}". سنرد عليك خلال 24 ساعة.` : ". كيف نخدمك؟"}`;
  }
}

export interface WhatsAppSendResult {
  ok: boolean;
  queued: boolean;
  error?: string;
}

class WhatsAppService {
  institutionNumber(): string {
    if (typeof import.meta !== "undefined" && import.meta.env?.VITE_WHATSAPP_NUMBER) {
      return String(import.meta.env.VITE_WHATSAPP_NUMBER);
    }
    return DEFAULT_NUMBER;
  }

  /** فتح محادثة واتساب — يعمل أوفلاين كرابط، ويُفتح عند الاتصال */
  openChat(phone: string, message: string, target: "_blank" | "_self" = "_blank"): boolean {
    if (typeof window === "undefined" || !isValidPhone(phone)) return false;
    try {
      const url = buildWhatsAppLink(phone, message);
      const win = window.open(url, target, "noopener");
      if (win && target === "_blank") win.opener = null;
      return true;
    } catch {
      return false;
    }
  }

  /**
   * إرسال عبر الخادم (يتطلب VITE_WHATSAPP_API_KEY server-side فقط).
   * عند انقطاع الاتصال يُحفَظ في طابور bg-sync للمزامنة لاحقاً.
   */
  async sendViaServer(
    phone: string,
    template: WhatsAppTemplate,
    vars: { name?: string; amount?: number; question?: string } = {},
  ): Promise<WhatsAppSendResult> {
    if (!isValidPhone(phone)) return { ok: false, queued: false, error: "invalid-phone" };
    const payload = {
      to: normalizeYePhone(phone),
      template,
      message: buildTemplateMessage(template, vars),
      queuedAt: new Date().toISOString(),
    };
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      await backgroundSync("whatsapp-send", payload);
      return { ok: false, queued: true };
    }
    try {
      await fetchWithRetry<{ ok: boolean }>("/api/whatsapp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        timeoutMs: 12000,
      }, 2);
      return { ok: true, queued: false };
    } catch {
      await backgroundSync("whatsapp-send", payload);
      return { ok: false, queued: true, error: "queued-offline" };
    }
  }
}

export const whatsappService = new WhatsAppService();
