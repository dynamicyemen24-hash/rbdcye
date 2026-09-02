// Shareable Impact Card - بطاقة الأثر القابلة للمشاركة
import { useState, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { Download, Share2, Heart, Check } from 'lucide-react';

interface ShareableImpactCardProps {
  donorName?: string;
  amount?: number;
  project?: string;
  impact?: string;
}

export function ShareableImpactCard({
  donorName = 'متبرع كريم',
  amount = 25000,
  project = 'سلة غذائية',
  impact = 'أطعمت أسرة لشهر كامل',
}: ShareableImpactCardProps) {
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleShare = useCallback(async () => {
    const text = `🤲 تبرعت لـ رحماء بينهم\n${impact}\n\nتبرعك يُحدث فرقاً真實\nrbdcye.org/donate`;
    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch {
        // Sharing can be cancelled by the user without requiring an error state.
      }
    } else {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [impact]);

  const handleDownload = useCallback(() => {
    if (!cardRef.current) return;
    
    // Create a canvas for the card
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 1080, 1080);
    gradient.addColorStop(0, '#0F4C3A');
    gradient.addColorStop(1, '#0A3527');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1080, 1080);

    // Gold accent
    ctx.fillStyle = '#C69E5A';
    ctx.fillRect(0, 0, 1080, 8);

    // Heart icon
    ctx.font = '80px serif';
    ctx.textAlign = 'center';
    ctx.fillText('🤲', 540, 200);

    // Main text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 48px Cairo, sans-serif';
    ctx.fillText(impact, 540, 400);

    // Donor name
    ctx.font = '36px Cairo, sans-serif';
    ctx.fillStyle = '#C69E5A';
    ctx.fillText(donorName, 540, 500);

    // Amount
    ctx.font = 'bold 64px Cairo, sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(`${amount.toLocaleString('ar-SA')} ر.ي`, 540, 620);

    // Project
    ctx.font = '32px Cairo, sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.globalAlpha = 0.7;
    ctx.fillText(project, 540, 700);

    // Footer
    ctx.globalAlpha = 1;
    ctx.font = 'bold 28px Cairo, sans-serif';
    ctx.fillStyle = '#C69E5A';
    ctx.fillText('رحماء بهم', 540, 900);
    ctx.font = '24px Cairo, sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.globalAlpha = 0.6;
    ctx.fillText('rbdcye.org', 540, 950);

    // Download
    const link = document.createElement('a');
    link.download = 'rahamaa-impact.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, [donorName, amount, project, impact]);

  return (
    <div className="relative">
      {/* Preview Card */}
      <div
        ref={cardRef}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--brand-green)] to-[var(--brand-green-dark)] p-8 text-center text-white aspect-square max-w-sm mx-auto"
      >
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-10 pattern-khatam-white pointer-events-none" />
        
        {/* Gold accent line */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[var(--brand-gold)] via-white to-[var(--brand-gold)]" />

        <div className="relative z-10 flex flex-col items-center justify-center h-full">
          {/* Heart icon */}
          <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-6">
            <Heart className="w-10 h-10 text-[var(--brand-gold-light)]" fill="currentColor" />
          </div>

          {/* Impact text */}
          <h3 className="text-2xl md:text-3xl font-bold mb-4 leading-relaxed">
            {impact}
          </h3>

          {/* Donor name */}
          <p className="text-[var(--brand-gold-light)] text-lg mb-2">
            {donorName}
          </p>

          {/* Amount */}
          <div className="text-4xl md:text-5xl font-black mb-2">
            {amount.toLocaleString('ar-SA')} ر.ي
          </div>

          {/* Project */}
          <p className="text-white/60 text-sm mb-8">
            {project}
          </p>

          {/* Footer */}
          <div className="mt-auto">
            <p className="text-[var(--brand-gold-light)] font-bold text-lg">رحماء بهم</p>
            <p className="text-white/50 text-sm">rbdcye.org</p>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 mt-4 justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDownload}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--brand-green)] text-white font-bold text-sm"
        >
          <Download className="w-4 h-4" />
          تحميل الصورة
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleShare}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-bold text-sm"
        >
          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
          {copied ? 'تم النسخ' : 'مشاركة'}
        </motion.button>
      </div>
    </div>
  );
}


