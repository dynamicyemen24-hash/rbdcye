import { MessageCircle } from 'lucide-react';

interface WhatsAppShareProps {
  message: string;
  url?: string;
  className?: string;
}

export function WhatsAppShare({ message, url, className = '' }: WhatsAppShareProps) {
  const shareUrl = `https://wa.me/?text=${encodeURIComponent(`${message}\n${url || window.location.href}`)}`;
  
  return (
    <a
      href={shareUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg ${className}`}
    >
      <MessageCircle className="h-4 w-4" />
      مشاركة عبر واتساب
    </a>
  );
}
