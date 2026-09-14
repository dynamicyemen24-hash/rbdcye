/**
 * Provider Request Sanitizer — يمنع تسريب حقول reasoning المشفّرة
 *
 * السبب الجذري للخطأ:
 * `reasoning.encrypted_content` حقل تديره جهة الـ provider داخلياً (مشفّر بمفتاح جلسة).
 * إعادة إرساله من caller مختلف أو من request لاحق (continuation) يعطي:
 * `[invalid_request_error] reasoning encrypted_content was not issued to this caller`
 *
 * القاعدة: لا يجوز للتطبيق إعادة إرسال reasoning output كـ input.
 * هذه الوحدة تضمن ذلك بأقل تغيير: تنظيف عميق لأي payload قبل إرساله للـ provider.
 */

// الحقول المحظورة التي لا يجوز للتطبيق إرسالها
const FORBIDDEN_REASONING_KEYS = new Set([
  "encrypted_content",
  "encryptedContent",
  "reasoning_encrypted_content",
]);

const FORBIDDEN_TOP_LEVEL_KEYS = new Set([
  "reasoning", // كامل كائن reasoning provider-managed
  "reasoning_details",
  "reasoningDetails",
]);

export interface SanitizeOptions {
  /** إزالة حتى summary النصي للـ reasoning إن وُجد (افتراضي false: يبقي summary المسموح) */
  stripReasoningSummary?: boolean;
}

/**
 * يفحص هل الكائن يحتوي على حقل محظور في أي عمق
 */
export function hasForbiddenReasoningFields(obj: unknown, depth = 0, maxDepth = 12): boolean {
  if (obj === null || obj === undefined || typeof obj !== "object" || depth > maxDepth) return false;
  if (Array.isArray(obj)) return obj.some((v) => hasForbiddenReasoningFields(v, depth + 1, maxDepth));
  const record = obj as Record<string, unknown>;
  for (const key of Object.keys(record)) {
    if (FORBIDDEN_REASONING_KEYS.has(key)) return true;
    // reasoning وحده ليس محظورًا — المحظور هو reasoning الذي يحمل encrypted_content
    if (key === "reasoning" && record[key] !== null && record[key] !== undefined && typeof record[key] === "object") {
      const inner = record[key] as Record<string, unknown>;
      if ("encrypted_content" in inner || "encryptedContent" in inner || "reasoning_encrypted_content" in inner) return true;
      // summary فقط مسموح
      if (depth === 0 && ("reasoning_details" in inner || "reasoningDetails" in inner)) return true;
    }
    if (FORBIDDEN_TOP_LEVEL_KEYS.has(key)) {
      // reasoning_details على المستوى الأعلى محظور دائمًا
      if (key !== "reasoning") return true;
      // reasoning على المستوى الأعلى محظور فقط إذا يحمل حقل محظور — تم التعامل أعلاه
      continue;
    }
    if (hasForbiddenReasoningFields(record[key], depth + 1, maxDepth)) return true;
  }
  return false;
}

/**
 * يزيل الحقول المحظورة بعمق ويعيد نسخة نظيفة (غير mutating)
 */
export function sanitizeProviderRequest<T>(payload: T, opts: SanitizeOptions = {}): T {
  if (payload === null || payload === undefined || typeof payload !== "object") return payload;
  if (Array.isArray(payload)) {
    return (payload as unknown[]).map((v) => sanitizeProviderRequest(v, opts)) as unknown as T;
  }
  const src = payload as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(src)) {
    if (FORBIDDEN_REASONING_KEYS.has(key)) continue;
    if (FORBIDDEN_TOP_LEVEL_KEYS.has(key)) {
      // نسمح بتمرير summary كنص فقط إن أراد المطوّر، لكن نزيله افتراضياً إذا طلب stripReasoningSummary
      if (key === "reasoning" && opts.stripReasoningSummary !== true && value !== null && value !== undefined && typeof value === "object") {
        const r = value as Record<string, unknown>;
        // نُبقي summary النصي فقط إن وُجد، ونحذف encrypted_content
        if (typeof r.summary === "string" && r.summary) {
          out[key] = { summary: r.summary };
        }
        // وإلا نحذف reasoning كاملاً
        continue;
      }
      continue;
    }
    if (value !== null && value !== undefined && typeof value === "object") {
      // معالجة خاصة لـ reasoning المتداخل
      if (key === "reasoning") {
        const r = value as Record<string, unknown>;
        const cleaned: Record<string, unknown> = {};
        for (const [rk, rv] of Object.entries(r)) {
          if (FORBIDDEN_REASONING_KEYS.has(rk)) continue;
          cleaned[rk] = rv !== null && rv !== undefined && typeof rv === "object" ? sanitizeProviderRequest(rv as never, opts) : rv;
        }
        if (Object.keys(cleaned).length === 0) continue;
        // إذا بقي summary فقط أبقه، وإلا احذف reasoning إن لم يبق شيء مفيد
        if (Object.keys(cleaned).length === 1 && "summary" in cleaned && opts.stripReasoningSummary !== true) {
          out[key] = cleaned;
        } else if (Object.keys(cleaned).length > 0 && opts.stripReasoningSummary === true) {
          continue;
        } else if (Object.keys(cleaned).length > 0) {
          out[key] = cleaned;
        }
        continue;
      }
      out[key] = sanitizeProviderRequest(value as never, opts);
    } else {
      out[key] = value;
    }
  }
  return out as T;
}

/**
 * يتحقق ثم يلقي خطأ واضح إن وُجد حقل محظور (للاستخدام في طبقة API client قبل الإرسال)
 */
export function assertNoForbiddenReasoning(payload: unknown): void {
  if (hasForbiddenReasoningFields(payload)) {
    throw new Error(
      "[provider-request] Refusing to send provider-managed reasoning field (encrypted_content). " +
        "reasoning.encrypted_content is provider-managed and must not be replayed by the caller. " +
        "Use sanitizeProviderRequest() or omit reasoning entirely."
    );
  }
}
