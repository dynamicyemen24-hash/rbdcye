import { Heart, CheckCircle, CreditCard, Smartphone, Building2 } from "lucide-react";
import { useState } from "react";

import { intakeService } from "@/shared/services/intake.service";

const amounts = [50, 100, 250, 500, 1000, 2500];
const projects = [
  { id: "general", label: "الصندوق العام لدعم البرامج" },
  { id: "relief", label: "الإغاثة الإنسانية" },
  { id: "education", label: "دعم التعليم" },
  { id: "development", label: "التنمية المجتمعية" },
  { id: "ramadan", label: "مشروع رمضان" },
];

export function DonatePage() {
  const [amount, setAmount] = useState<number | null>(100);
  const [customAmount, setCustomAmount] = useState("");
  const [project, setProject] = useState("general");
  const [donationType, setDonationType] = useState<"once" | "monthly">("once");
  const [payMethod, setPayMethod] = useState("card");
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const finalAmount = customAmount ? parseFloat(customAmount) : amount || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (finalAmount <= 0) return;
    setLoading(true);
    await intakeService.submitDonation({
      donor: form.name,
      email: form.email,
      phone: form.phone,
      amount: finalAmount,
      project: projects.find((p) => p.id === project)?.label || project,
      method: payMethod,
      type: donationType,
    });
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div
        className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4"
        style={{ direction: "rtl" }}
      >
        <div className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-xl border border-[var(--border)]">
          <div className="w-20 h-20 rounded-full bg-[var(--brand-green-pale)] flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-10 h-10 text-[var(--brand-green)]" />
          </div>
          <h2 className="text-[var(--foreground)] mb-3" style={{ fontWeight: 800 }}>
            جزاك الله خيرًا
          </h2>
          <p
            className="text-[var(--muted-foreground)] mb-2"
            style={{ fontSize: "0.9rem", lineHeight: "1.7" }}
          >
            تم استلام تبرعك بنجاح. ستصلك رسالة تأكيد على بريدك الإلكتروني.
          </p>
          <div
            className="mt-5 p-4 rounded-xl bg-[var(--brand-green-pale)] text-[var(--brand-green)]"
            style={{ fontSize: "0.9rem", fontWeight: 700 }}
          >
            مبلغ التبرع: {finalAmount.toLocaleString("ar-SA")} ريال
          </div>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-6 w-full py-3 bg-[var(--brand-green)] text-white rounded-xl hover:bg-[var(--brand-green-light)] transition-colors"
            style={{ fontWeight: 600 }}
          >
            تبرع مرة أخرى
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--secondary)] pt-24 pb-16" style={{ direction: "rtl" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-full bg-[var(--brand-green)] flex items-center justify-center mx-auto mb-4">
            <Heart className="w-7 h-7 text-white" fill="white" />
          </div>
          <h1 className="text-[var(--foreground)] mb-3" style={{ fontWeight: 800 }}>
            تبرع وشارك في صنع الأثر
          </h1>
          <p
            className="text-[var(--muted-foreground)] max-w-md mx-auto"
            style={{ fontSize: "0.9rem", lineHeight: "1.7" }}
          >
            تبرعك يصل مباشرة إلى المستحقين ويُحدث فرقًا حقيقيًا في حياتهم
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-5">
            {/* Donation Type */}
            <div className="bg-white rounded-2xl p-5 border border-[var(--border)]">
              <div style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: "1rem" }}>
                نوع التبرع
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: "once", label: "تبرع لمرة واحدة" },
                  { id: "monthly", label: "تبرع شهري منتظم" },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setDonationType(t.id as "once" | "monthly")}
                    className={`py-3 px-4 rounded-xl border-2 transition-all text-center ${
                      donationType === t.id
                        ? "border-[var(--brand-green)] bg-[var(--brand-green-pale)] text-[var(--brand-green)]"
                        : "border-[var(--border)] text-[var(--muted-foreground)]"
                    }`}
                    style={{ fontSize: "0.83rem", fontWeight: 600 }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount */}
            <div className="bg-white rounded-2xl p-5 border border-[var(--border)]">
              <div style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: "1rem" }}>
                اختر مبلغ التبرع (ريال)
              </div>
              <div className="grid grid-cols-3 gap-2.5 mb-4">
                {amounts.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => {
                      setAmount(a);
                      setCustomAmount("");
                    }}
                    className={`py-2.5 rounded-xl border-2 transition-all ${
                      amount === a && !customAmount
                        ? "border-[var(--brand-green)] bg-[var(--brand-green)] text-white"
                        : "border-[var(--border)] text-[var(--foreground)] hover:border-[var(--brand-green)]/40"
                    }`}
                    style={{ fontSize: "0.88rem", fontWeight: 700 }}
                  >
                    {a.toLocaleString("ar-SA")}
                  </button>
                ))}
              </div>
              <input
                type="number"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setAmount(null);
                }}
                placeholder="أو أدخل مبلغًا آخر..."
                className="w-full px-4 py-2.5 border-2 border-[var(--border)] rounded-xl focus:outline-none focus:border-[var(--brand-green)] transition-colors bg-[var(--input-background)]"
                style={{ fontSize: "0.9rem" }}
                dir="ltr"
                min="1"
              />
            </div>

            {/* Project */}
            <div className="bg-white rounded-2xl p-5 border border-[var(--border)]">
              <div style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: "1rem" }}>
                وجهة التبرع
              </div>
              <div className="space-y-2.5">
                {projects.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setProject(p.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-right ${
                      project === p.id
                        ? "border-[var(--brand-green)] bg-[var(--brand-green-pale)]"
                        : "border-[var(--border)]"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                        project === p.id
                          ? "border-[var(--brand-green)] bg-[var(--brand-green)]"
                          : "border-[var(--border)]"
                      }`}
                    >
                      {project === p.id && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <span
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        color: project === p.id ? "var(--brand-green)" : "var(--foreground)",
                      }}
                    >
                      {p.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Donor Info */}
            <div className="bg-white rounded-2xl p-5 border border-[var(--border)]">
              <div style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: "1rem" }}>
                بيانات المتبرع
              </div>
              <div className="space-y-3">
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="الاسم الكامل *"
                  className="w-full px-4 py-2.5 border border-[var(--border)] rounded-xl bg-[var(--input-background)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/30 focus:border-[var(--brand-green)]"
                  style={{ fontSize: "0.85rem" }}
                />
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="البريد الإلكتروني *"
                  className="w-full px-4 py-2.5 border border-[var(--border)] rounded-xl bg-[var(--input-background)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/30 focus:border-[var(--brand-green)]"
                  style={{ fontSize: "0.85rem" }}
                  dir="ltr"
                />
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="رقم الهاتف"
                  className="w-full px-4 py-2.5 border border-[var(--border)] rounded-xl bg-[var(--input-background)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/30 focus:border-[var(--brand-green)]"
                  style={{ fontSize: "0.85rem" }}
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl p-5 border border-[var(--border)]">
              <div style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: "1rem" }}>
                طريقة الدفع
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: "card", label: "بطاقة بنكية", icon: CreditCard },
                  { id: "mobile", label: "دفع إلكتروني", icon: Smartphone },
                  { id: "transfer", label: "تحويل بنكي", icon: Building2 },
                ].map((m) => {
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPayMethod(m.id)}
                      className={`flex flex-col items-center gap-2 py-3 px-2 rounded-xl border-2 transition-all ${
                        payMethod === m.id
                          ? "border-[var(--brand-green)] bg-[var(--brand-green-pale)]"
                          : "border-[var(--border)]"
                      }`}
                    >
                      <Icon
                        className="w-5 h-5"
                        style={{
                          color:
                            payMethod === m.id ? "var(--brand-green)" : "var(--muted-foreground)",
                        }}
                      />
                      <span
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: 600,
                          color:
                            payMethod === m.id ? "var(--brand-green)" : "var(--muted-foreground)",
                        }}
                      >
                        {m.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || finalAmount <= 0}
              className="w-full flex items-center justify-center gap-2.5 py-4 bg-[var(--brand-green)] text-white rounded-2xl hover:bg-[var(--brand-green-light)] transition-all shadow-lg hover:shadow-xl disabled:opacity-60"
              style={{ fontSize: "1rem", fontWeight: 700 }}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Heart className="w-5 h-5" fill="white" />
                  تبرع بمبلغ {finalAmount > 0 ? finalAmount.toLocaleString("ar-SA") : "..."} ريال
                </>
              )}
            </button>
          </form>

          {/* Summary */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-[var(--border)] sticky top-24">
              <h3 style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "1rem" }}>
                ملخص تبرعك
              </h3>
              <div className="space-y-3 mb-5">
                <div className="flex justify-between">
                  <span className="text-[var(--muted-foreground)]" style={{ fontSize: "0.82rem" }}>
                    المبلغ
                  </span>
                  <span
                    style={{ fontWeight: 700, fontSize: "0.88rem", color: "var(--brand-green)" }}
                  >
                    {finalAmount > 0 ? `${finalAmount.toLocaleString("ar-SA")} ريال` : "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--muted-foreground)]" style={{ fontSize: "0.82rem" }}>
                    النوع
                  </span>
                  <span style={{ fontWeight: 600, fontSize: "0.82rem" }}>
                    {donationType === "once" ? "مرة واحدة" : "شهري"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--muted-foreground)]" style={{ fontSize: "0.82rem" }}>
                    الوجهة
                  </span>
                  <span style={{ fontWeight: 600, fontSize: "0.8rem" }}>
                    {projects.find((p) => p.id === project)?.label}
                  </span>
                </div>
              </div>

              <div className="border-t border-[var(--border)] pt-4">
                <div className="flex justify-between items-center">
                  <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>الإجمالي</span>
                  <span
                    style={{ fontWeight: 800, fontSize: "1.1rem", color: "var(--brand-green)" }}
                  >
                    {finalAmount > 0 ? `${finalAmount.toLocaleString("ar-SA")} ريال` : "—"}
                  </span>
                </div>
              </div>

              <div className="mt-5 p-3 rounded-xl bg-[var(--brand-green-pale)]">
                <p
                  className="text-[var(--brand-green)]"
                  style={{ fontSize: "0.75rem", lineHeight: "1.6" }}
                >
                  ✓ تبرعك محمي بأعلى معايير الأمان
                  <br />
                  ✓ ستصلك إيصالات إلكترونية
                  <br />✓ يمكن الإلغاء في أي وقت (للشهري)
                </p>
              </div>
            </div>

            {/* Impact */}
            <div className="bg-white rounded-2xl p-5 border border-[var(--border)]">
              <div style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: "0.75rem" }}>
                أثر تبرعك
              </div>
              <div className="space-y-2.5">
                {[
                  { amount: 50, label: "توفير وجبات لأسرة لأسبوع" },
                  { amount: 100, label: "دعم طالب لشهر كامل" },
                  { amount: 250, label: "تجهيز حقيبة مدرسية لـ٥ أطفال" },
                  { amount: 500, label: "رعاية أسرة نازحة لثلاثة أشهر" },
                ].map((impact) => (
                  <div
                    key={impact.amount}
                    className={`flex gap-3 p-3 rounded-xl transition-colors ${
                      finalAmount >= impact.amount
                        ? "bg-[var(--brand-green-pale)] border border-[var(--brand-green)]/20"
                        : "opacity-50"
                    }`}
                  >
                    <span
                      className="text-[var(--brand-green)] flex-shrink-0"
                      style={{ fontSize: "0.8rem", fontWeight: 800 }}
                    >
                      {impact.amount.toLocaleString("ar-SA")}
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "var(--foreground)" }}>
                      {impact.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
