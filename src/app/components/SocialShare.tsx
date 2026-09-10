import { useState, memo } from 'react';
import { Share2, Copy, Check, MessageCircle, Send } from 'lucide-react';

interface SocialShareProps {
  title: string;
  message: string;
  url?: string;
  via?: string;
  hashtags?: string[];
}

const PLATFORMS = [
  {
    id: 'whatsapp',
    name: 'واتساب',
    color: 'bg-green-600',
    icon: MessageCircle,
    getUrl: (url: string, text: string) => `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`,
  },
  {
    id: 'twitter',
    name: 'تويتر',
    color: 'bg-sky-500',
    icon: Send,
    getUrl: (url: string, text: string, via?: string, hashtags?: string[]) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}${via ? `&via=${via}` : ''}${hashtags ? `&hashtags=${hashtags.join(',')}` : ''}`,
  },
  {
    id: 'facebook',
    name: 'فيسبوك',
    color: 'bg-blue-600',
    icon: Share2,
    getUrl: (url: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    id: 'telegram',
    name: 'تيليجرام',
    color: 'bg-blue-400',
    icon: Send,
    getUrl: (url: string, text: string) => `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
  },
];

export const SocialShare = memo(function SocialShare({
  title, message, url, via = 'RohamaaBaynahum', hashtags = ['رحماء', 'إغاثة', 'يمن']
}: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`${message}\n${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2" dir="rtl">
      {PLATFORMS.map(platform => (
        <a
          key={platform.id}
          href={platform.getUrl(shareUrl, `${title} — ${message}`, via, hashtags)}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex h-10 w-10 items-center justify-center rounded-xl text-white transition-all hover:-translate-y-0.5 hover:shadow-lg ${platform.color}`}
          title={`مشاركة عبر ${platform.name}`}
          aria-label={`مشاركة عبر ${platform.name}`}
        >
          <platform.icon className="h-5 w-5" />
        </a>
      ))}
      <button
        onClick={handleCopy}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--card)] transition-all hover:-translate-y-0.5 hover:shadow-lg"
        title="نسخ الرابط"
        aria-label="نسخ الرابط"
      >
        {copied ? <Check className="h-5 w-5 text-green-600" /> : <Copy className="h-5 w-5" />}
      </button>
    </div>
  );
});
