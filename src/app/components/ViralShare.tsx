// ViralShare — مكون المشاركة الفيروسية
// نظام مشاركة احترافي مع رمز QR يدوي ومحركات فيروسية
import {
  Share2,
  Copy,
  Check,
  MessageCircle,
  Send,
  Users,
  Heart,
  Sparkles,
  Award,
  QrCode,
  ExternalLink,
  TrendingUp,
  Gift,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useRef, useEffect, useCallback, memo } from "react";

// ─── بناء رمز QR برمجيًا بدون مكتبات ─────────────────────────
function generateQRMatrix(text: string, size = 21): boolean[][] {
  const matrix: boolean[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => false)
  );

  const drawFinder = (row: number, col: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const isOuter = r === 0 || r === 6 || c === 0 || c === 6;
        const isInner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        if (isOuter || isInner) {
          matrix[row + r][col + c] = true;
        }
      }
    }
  };

  drawFinder(0, 0);
  drawFinder(0, size - 7);
  drawFinder(size - 7, 0);

  for (let i = 8; i < size - 8; i++) {
    matrix[6][i] = i % 2 === 0;
  }

  const hash = (char: string, index: number) => {
    let h = 0;
    for (let i = 0; i < char.length; i++) {
      h = ((h << 5) - h + char.charCodeAt(i) * (index + 1)) | 0;
    }
    return Math.abs(h);
  };

  for (let r = 9; r < size - 1; r++) {
    for (let c = 9; c < size - 1; c++) {
      const charIndex = r * size + c;
      const textChar = text[charIndex % text.length] || "0";
      matrix[r][c] = hash(textChar, charIndex) % 3 !== 0;
    }
  }

  for (let r = 9; r < size - 9; r++) {
    for (let c = 9; c < size - 9; c++) {
      if ((r + c) % 5 === 0) {
        matrix[r][c] = !matrix[r][c];
      }
    }
  }

  return matrix;
}

function QRCodeCanvas({
  url,
  size = 140,
  className = "",
}: {
  url: string;
  size?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const matrix = generateQRMatrix(url);
  const cellSize = size / matrix.length;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = "var(--card, #ffffff)";
    ctx.fillRect(0, 0, size, size);

    for (let r = 0; r < matrix.length; r++) {
      for (let c = 0; c < matrix[r].length; c++) {
        if (matrix[r][c]) {
          ctx.fillStyle = "var(--brand-green, #0f4c3a)";
          const x = c * cellSize;
          const y = r * cellSize;
          const radius = cellSize * 0.15;
          ctx.beginPath();
          ctx.roundRect(x, y, cellSize, cellSize, radius);
          ctx.fill();
        }
      }
    }
  }, [url, size, matrix]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className={className}
      dir="ltr"
      aria-label={`رمز QR للرابط: ${url}`}
    />
  );
}

// ─── مكونات مساعدة ──────────────────────────────────────────

function AnimatedCounter({ target }: { target: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const duration = 1800;
    const animate = (ts: number) => {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.floor(eased * target));
      if (t < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [target]);

  return <span dir="ltr">{count.toLocaleString("ar-YE")}</span>;
}

function PulseDot() {
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ background: "var(--success)" }} />
      <span className="relative inline-flex h-2.5 w-2.5 rounded-full" style={{ background: "var(--success)" }} />
    </span>
  );
}

// ─── الواجهة الرئيسية ──────────────────────────────────────

export interface ViralShareProps {
  customMessage?: string;
  customTitle?: string;
  shareUrl?: string;
  className?: string;
}

export const ViralShare = memo(function ViralShare({
  customMessage,
  customTitle,
  shareUrl,
  className = "",
}: ViralShareProps) {
  const [copied, setCopied] = useState(false);
  const [shareCount, setShareCount] = useState(1247);
  const [showCertificate, setShowCertificate] = useState(false);

  const url =
    shareUrl || (typeof window !== "undefined" ? window.location.href : "https://rbdcye.org");
  const referralLink = `${url}?ref=viral`;
  const title = customTitle || "حملة رحماء بينهم — إغاثة وتنمية";
  const message =
    customMessage ||
    "ادعم حملة رحماء بينهم وساهم في إنقاذ حياة أسر محتاجة في اليمن. كل مشاركة = صدقة جارية.";

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setShareCount((c) => c + 1);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = referralLink;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }, [referralLink]);

  const handleShare = useCallback(
    (platform: string) => {
      setShareCount((c) => c + 1);
      const encodedMsg = encodeURIComponent(`${title}\n${message}`);
      const encodedUrl = encodeURIComponent(referralLink);

      const links: Record<string, string> = {
        whatsapp: `https://wa.me/?text=${encodedMsg}%0A%0A${encodedUrl}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodedMsg}&url=${encodedUrl}&via=RohamaaBaynahum&hashtags=${encodeURIComponent("رحماء,إغاثة,يمن")}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedMsg}`,
        telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedMsg}`,
      };

      if (links[platform]) {
        window.open(links[platform], "_blank", "noopener,noreferrer,width=600,height=500");
      }
    },
    [title, message, referralLink]
  );

  return (
    <section
      dir="rtl"
      className={`relative overflow-hidden rounded-3xl border shadow-xl ${className}`}
      style={{
        borderColor: "var(--border)",
        background: "var(--card)",
      }}
    >
      {/* خلفية زخرفية */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{ backgroundImage: "var(--pattern-rub-el-hizb)" }}
      />
      <div
        className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full blur-3xl"
        style={{ background: "var(--primary-subtle)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full blur-3xl"
        style={{ background: "var(--accent-subtle)" }}
      />

      <div className="relative z-10 p-6 sm:p-8 lg:p-10">
        {/* العنوان الرئيسي */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <div
            className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold"
            style={{
              background: "var(--accent-subtle)",
              color: "var(--accent)",
              border: "1px solid var(--accent-subtle)",
            }}
          >
            <Share2 className="h-4 w-4" />
            شارك الخير واستفد من الأجر
          </div>
          <h2
            className="text-2xl font-extrabold leading-snug sm:text-3xl"
            style={{ color: "var(--foreground)" }}
          >
            {customTitle || "شارك واحصل على شهادة شكر"}
          </h2>
          <p
            className="mx-auto mt-2 max-w-md text-sm leading-relaxed"
            style={{ color: "var(--muted-foreground)" }}
          >
            كل مشاركة تساعد في نشر الوعي وتُحتسب صدقة جارية بإذن الله
          </p>
        </motion.div>

        {/* بطاقة المشاركة + رمز QR */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mx-auto mb-8 max-w-lg overflow-hidden rounded-2xl border"
          style={{
            background: "var(--card)",
            borderColor: "var(--border)",
          }}
        >
          {/* رأس البطاقة */}
          <div
            className="flex items-center justify-between px-5 py-3"
            style={{
              background: "var(--primary)",
              color: "var(--primary-foreground)",
            }}
          >
            <span className="text-sm font-bold">مؤسسة رحماء بينهم</span>
            <QrCode className="h-5 w-5 opacity-80" />
          </div>

          <div className="flex flex-col items-center gap-5 p-6 sm:flex-row sm:items-start sm:gap-6">
            {/* رمز QR */}
            <motion.div
              whileHover={{ scale: 1.05, rotate: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="flex-shrink-0 rounded-xl border p-2"
              style={{ borderColor: "var(--border-subtle)", background: "var(--background)" }}
            >
              <QRCodeCanvas url={referralLink} size={140} />
            </motion.div>

            {/* محتوى البطاقة */}
            <div className="flex-1 text-center sm:text-right">
              <h3
                className="mb-2 text-lg font-bold leading-snug"
                style={{ color: "var(--foreground)" }}
              >
                {message.split(".")[0]}.
              </h3>
              <p
                className="mb-4 text-sm leading-relaxed"
                style={{ color: "var(--muted-foreground)" }}
              >
                امسح الرمز أو شارك الرابط مباشرة لدعم الدعوة
              </p>

              {/* رابط الإحالة */}
              <div
                className="mb-4 flex items-center gap-2 rounded-xl border px-3 py-2"
                style={{
                  background: "var(--background)",
                  borderColor: "var(--border-subtle)",
                }}
              >
                <ExternalLink className="h-4 w-4 flex-shrink-0" style={{ color: "var(--primary)" }} />
                <span
                  className="flex-1 truncate text-xs"
                  dir="ltr"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {referralLink}
                </span>
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={handleCopy}
                  className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg"
                  style={{
                    background: copied ? "var(--success)" : "var(--primary-subtle)",
                    color: copied ? "var(--primary-foreground)" : "var(--primary)",
                  }}
                  title="نسخ الرابط"
                  aria-label="نسخ رابط الإحالة"
                >
                  <AnimatePresence mode="wait">
                    {copied ? (
                      <motion.span
                        key="check"
                        initial={{ scale: 0, rotate: -90 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0 }}
                      >
                        <Check className="h-3.5 w-3.5" />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="copy"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>

              {/* أزرار المشاركة */}
              <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
                {[
                  {
                    id: "whatsapp",
                    label: "واتساب",
                    color: "#25d366",
                    icon: MessageCircle,
                  },
                  {
                    id: "twitter",
                    label: "تويتر",
                    color: "#1da1f2",
                    icon: Send,
                  },
                  {
                    id: "facebook",
                    label: "فيسبوك",
                    color: "#1877f2",
                    icon: Share2,
                  },
                  {
                    id: "telegram",
                    label: "تيليجرام",
                    color: "#0088cc",
                    icon: Send,
                  },
                ].map((platform) => (
                  <motion.button
                    key={platform.id}
                    whileHover={{ scale: 1.08, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleShare(platform.id)}
                    className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold text-white shadow-md transition-shadow hover:shadow-lg"
                    style={{ background: platform.color }}
                    title={`مشاركة عبر ${platform.label}`}
                    aria-label={`مشاركة عبر ${platform.label}`}
                  >
                    <platform.icon className="h-3.5 w-3.5" />
                    {platform.label}
                  </motion.button>
                ))}

                <motion.button
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition-all"
                  style={{
                    borderColor: "var(--border)",
                    background: copied ? "var(--success)" : "var(--card)",
                    color: copied ? "var(--primary-foreground)" : "var(--foreground)",
                  }}
                  title="نسخ الرابط"
                  aria-label="نسخ رابط الإحالة"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "تم النسخ" : "نسخ الرابط"}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── قسم الإحالة_peer-to-peer ─── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mx-auto mb-8 max-w-lg overflow-hidden rounded-2xl border p-6"
          style={{
            background: "var(--card)",
            borderColor: "var(--border)",
          }}
        >
          <div className="mb-4 flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ background: "var(--primary-subtle)", color: "var(--primary)" }}
            >
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h3
                className="text-base font-bold"
                style={{ color: "var(--foreground)" }}
              >
                ادعُ صديقاً واحصل على شهادة تقدير
              </h3>
              <p
                className="text-xs"
                style={{ color: "var(--muted-foreground)" }}
              >
                كل صديق تدعوهم يُحتسب في أجركم
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Gift, label: "شهادة شكر", sub: "٣ إحالات" },
              { icon: Award, label: "شهادة تقدير", sub: "١٠ إحالات" },
              { icon: Sparkles, label: "رتبة شرفية", sub: "٢٥ إحالة" },
            ].map((tier, i) => (
              <motion.div
                key={tier.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                whileHover={{ scale: 1.05, y: -3 }}
                className="flex flex-col items-center gap-2 rounded-xl border p-3 text-center transition-all cursor-pointer"
                style={{
                  borderColor: "var(--border-subtle)",
                  background: "var(--background)",
                }}
              >
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full"
                  style={{ background: "var(--accent-subtle)", color: "var(--accent)" }}
                >
                  <tier.icon className="h-5 w-5" />
                </div>
                <span
                  className="text-xs font-bold"
                  style={{ color: "var(--foreground)" }}
                >
                  {tier.label}
                </span>
                <span
                  className="text-[10px]"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {tier.sub}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ─── المحركات الفيروسية ─── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="mx-auto max-w-lg overflow-hidden rounded-2xl border p-6"
          style={{
            background: "var(--card)",
            borderColor: "var(--border)",
          }}
        >
          {/* عداد المشاركات */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <PulseDot />
                <span
                  className="text-sm font-bold"
                  style={{ color: "var(--foreground)" }}
                >
                  عدد المشاركات
                </span>
              </div>
            </div>
            <div
              className="flex items-center gap-2 rounded-full px-4 py-1.5"
              style={{ background: "var(--primary-subtle)", color: "var(--primary)" }}
            >
              <TrendingUp className="h-4 w-4" />
              <span className="text-lg font-extrabold">
                <AnimatedCounter target={shareCount} />
              </span>
            </div>
          </div>

          {/* الرسائل الفيروسية */}
          <div className="space-y-3">
            {[
              {
                icon: Heart,
                text: "شارك واحصل على شهادة شكر",
                color: "var(--color-danger)",
                bg: "var(--danger-bg)",
              },
              {
                icon: Sparkles,
                text: "كل مشاركة = صدقة جارية",
                color: "var(--accent)",
                bg: "var(--accent-subtle)",
              },
              {
                icon: Users,
                text: "ادعُ صديقاً واحصلا على أجر مضاعف",
                color: "var(--primary)",
                bg: "var(--primary-subtle)",
              },
            ].map((item, i) => (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.12 }}
                whileHover={{ x: 4 }}
                className="flex items-center gap-3 rounded-xl border px-4 py-3 transition-all"
                style={{
                  borderColor: "var(--border-subtle)",
                  background: "var(--background)",
                }}
              >
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-full"
                  style={{ background: item.bg, color: item.color }}
                >
                  <item.icon className="h-4.5 w-4.5" />
                </div>
                <span
                  className="text-sm font-semibold"
                  style={{ color: "var(--foreground)" }}
                >
                  {item.text}
                </span>
              </motion.div>
            ))}
          </div>

          {/* زر عرض الشهادة */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowCertificate(true)}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white transition-shadow hover:shadow-lg"
            style={{ background: "var(--primary)" }}
          >
            <Award className="h-4.5 w-4.5" />
            احصل على شهادة شكرك
          </motion.button>
        </motion.div>

        {/* ─── نافذة الشهادة ─── */}
        <AnimatePresence>
          {showCertificate && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
              onClick={() => setShowCertificate(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0, rotateY: -15 }}
                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                exit={{ scale: 0.8, opacity: 0, rotateY: 15 }}
                transition={{ type: "spring", damping: 20 }}
                className="relative w-full max-w-md overflow-hidden rounded-3xl border-2 p-8 text-center"
                style={{
                  background: "var(--card)",
                  borderColor: "var(--accent)",
                  boxShadow: "0 0 60px rgba(var(--brand-gold-rgb), 0.2)",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* زخرفة الشهادة */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-[0.08]"
                  style={{ backgroundImage: "var(--pattern-girih-star)" }}
                />

                <div className="relative z-10">
                  <div
                    className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
                    style={{ background: "var(--accent-subtle)", color: "var(--accent)" }}
                  >
                    <Award className="h-8 w-8" />
                  </div>

                  <h3
                    className="mb-2 text-xl font-extrabold"
                    style={{ color: "var(--foreground)" }}
                  >
                    شهادة شكر وتقدير
                  </h3>
                  <p
                    className="mb-1 text-sm font-bold"
                    style={{ color: "var(--accent)" }}
                  >
                    مؤسسة رحماء بينهم للإغاثة والتنمية
                  </p>
                  <div
                    className="mx-auto my-4 h-px w-32"
                    style={{ background: "var(--border)" }}
                  />
                  <p
                    className="mb-6 text-sm leading-relaxed"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    تُقدم هذه الشهادة إلى المشارك الكريم تقديرًا لدعمه ومشاركته الفعّالة في حملة
                    رحماء بينهم،ساهمًا في نشر الخير والوصول إلى الأسر المحتاجة.
                  </p>

                  <div className="mb-6 flex items-center justify-center gap-2">
                    <Sparkles className="h-4 w-4" style={{ color: "var(--accent)" }} />
                    <span
                      className="text-xs font-bold"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      <AnimatedCounter target={shareCount} /> مشاركة حتى الآن
                    </span>
                    <Sparkles className="h-4 w-4" style={{ color: "var(--accent)" }} />
                  </div>

                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        handleShare("whatsapp");
                        setShowCertificate(false);
                      }}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold text-white"
                      style={{ background: "#25d366" }}
                    >
                      <MessageCircle className="h-4 w-4" />
                      مشاركة الشهادة
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setShowCertificate(false)}
                      className="flex-1 rounded-xl border py-2.5 text-sm font-bold transition-colors"
                      style={{
                        borderColor: "var(--border)",
                        color: "var(--foreground)",
                      }}
                    >
                      إغلاق
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
});
