import { describe, it, expect } from "vitest";

import {
  sanitizeProviderRequest,
  hasForbiddenReasoningFields,
  assertNoForbiddenReasoning,
} from "@/shared/utils/provider-request";

describe("provider-request — منع تسريب reasoning.encrypted_content", () => {
  it("يكشف وجود encrypted_content في أي عمق", () => {
    expect(hasForbiddenReasoningFields({ reasoning: { encrypted_content: "abc" } })).toBe(true);
    expect(hasForbiddenReasoningFields({ a: { b: { reasoning: { encryptedContent: "x" } } } })).toBe(true);
    expect(hasForbiddenReasoningFields({ reasoning: { summary: "ok" } })).toBe(false);
    expect(hasForbiddenReasoningFields({ messages: [{ role: "user", content: "hi" }] })).toBe(false);
  });

  it("لا يعيد إرسال reasoning output كـ encrypted input — التنظيف يزيله", () => {
    const payload = {
      model: "muse-spark-1.2",
      messages: [{ role: "user", content: "مرحبا" }],
      reasoning: { encrypted_content: "PROVIDER_ISSUED", summary: "should keep summary only" },
      stream: true,
    };
    const cleaned = sanitizeProviderRequest(payload);
    const cleanedReasoning = (cleaned as unknown as Record<string, unknown>).reasoning as Record<string, unknown> | undefined;
    // مسموح يبقي summary أو يحذف reasoning كاملاً، لكن لا encrypted_content أبداً
    expect(cleanedReasoning?.encrypted_content).toBeUndefined();
    expect(cleanedReasoning?.encryptedContent).toBeUndefined();
    expect(hasForbiddenReasoningFields(cleaned)).toBe(false);
    const withSummary = sanitizeProviderRequest({
      reasoning: { encrypted_content: "x", summary: "hello" },
    } as never);
    const r = (withSummary as unknown as Record<string, unknown>).reasoning as Record<string, unknown> | undefined;
    if (r) expect(r.encrypted_content).toBeUndefined();
    expect(hasForbiddenReasoningFields(cleaned)).toBe(false);
  });

  it("continuation يعمل بدون تمرير encrypted_content — لا يلقي بعد التنظيف", () => {
    const continuationPayload = {
      model: "muse-spark-1.2",
      messages: [
        { role: "user", content: "ابدأ" },
        { role: "assistant", content: "أهلاً", reasoning: { encrypted_content: "OLD_ENCRYPTED" } },
        { role: "user", content: "continue" },
      ],
      previous_response_id: "resp_123",
    };
    const cleaned = sanitizeProviderRequest(continuationPayload);
    expect(() => assertNoForbiddenReasoning(cleaned)).not.toThrow();
    expect(hasForbiddenReasoningFields(cleaned)).toBe(false);
  });

  it("يلقي خطأ واضح إذا حاول التطبيق إرسال encrypted_content دون تنظيف", () => {
    const bad = { reasoning: { encrypted_content: "SHOULD_NOT_SEND" } };
    expect(() => assertNoForbiddenReasoning(bad)).toThrow(/provider-managed reasoning field/);
  });

  it("لا يتأثر السلوك الطبيعي — payload نظيف يمر كما هو", () => {
    const normal = {
      model: "muse-spark-1.2",
      messages: [{ role: "user", content: "احسب الزكاة" }],
      temperature: 0.7,
      metadata: { locale: "ar" },
    };
    const cleaned = sanitizeProviderRequest(normal);
    expect(cleaned).toEqual(normal);
  });

  it("يزيل encrypted_content حتى لو كان top-level", () => {
    const payload = { encrypted_content: "top", messages: [] } as never;
    const cleaned = sanitizeProviderRequest(payload);
    expect((cleaned as unknown as Record<string, unknown>).encrypted_content).toBeUndefined();
    expect(hasForbiddenReasoningFields(payload)).toBe(true);
    expect(hasForbiddenReasoningFields(cleaned)).toBe(false);
  });
});
