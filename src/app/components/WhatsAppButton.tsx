import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X } from 'lucide-react';

interface WhatsAppButtonProps {
  phoneNumber?: string;
  defaultMessage?: string;
}

export function WhatsAppButton({
  phoneNumber = '967777888999',
  defaultMessage = 'السلام عليكم، أود الاستفسار عن برامج ومشاريع المؤسسة',
}: WhatsAppButtonProps) {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  const formattedUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <div className="fixed bottom-20 sm:bottom-6 left-4 sm:left-6 z-40 flex items-center gap-3 dir-rtl font-cairo">
      {/* Tooltip / Speech Bubble on Hover or Toggle */}
      <AnimatePresence>
        {isTooltipOpen && (
          <motion.div
            initial={{ opacity: 0, x: -10, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -10, scale: 0.9 }}
            className="hidden sm:flex items-center gap-2 bg-slate-900 text-white px-3.5 py-2 rounded-2xl shadow-xl text-xs font-bold border border-slate-800 whitespace-nowrap"
          >
            <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
            <span>تواصل معنا عبر واتساب للمساعدة المباشرة</span>
            <button
              onClick={() => setIsTooltipOpen(false)}
              className="mr-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Floating WhatsApp Button */}
      <motion.a
        href={formattedUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="تواصل معنا عبر واتساب"
        onMouseEnter={() => setIsTooltipOpen(true)}
        onMouseLeave={() => setIsTooltipOpen(false)}
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className="relative group flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 hover:bg-[#20bd5a] transition-all duration-300 cursor-pointer"
      >
        {/* Animated Pulse Outer Ring */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/40 animate-ping pointer-events-none" />

        {/* Official WhatsApp SVG Icon */}
        <svg
          className="w-6 h-6 sm:w-7 sm:h-7 fill-current relative z-10"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.99c-.002 5.45-4.437 9.884-9.885 9.884m0-18.016C6.326 3.769 1.5 8.595 1.5 14.502c0 2.02.563 3.99 1.63 5.71L1.5 22.5l2.368-1.597a10.686 10.686 0 005.69 1.612h.004c5.926 0 10.752-4.825 10.752-10.732 0-2.868-1.117-5.565-3.144-7.592A10.68 10.68 0 0012.051 3.77" />
        </svg>

        {/* Small Online Badge */}
        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-[#25D366] border-2 border-white shadow-xs" />
      </motion.a>
    </div>
  );
}

export default WhatsAppButton;
