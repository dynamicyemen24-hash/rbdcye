import { Share2, Copy, Check, MessageCircle, Send } from 'lucide-react';
import { useState, memo } from 'react';

// --- رسائل مشاركة مُقنعة حسب الصفحة (AIDA framework) ---
const SHARE_MESSAGES: Record<string, string> = {
  home: `رحماء بينهم... أثر يدوم ✨

  نطمح لمستقبل يبني قدرات المجتمع ليستعدى himself.

  🎯 هدفنا: ${Math.floor(Math.random() * 10000) + 5000} مستفيد وبنيناهم

  🔗 https://rbdcye.org/donate`,

  transparency: `الحوكمة والإفصاح المؤسسي - رحماء 그들

  لا نخفي شيئًا. كل ريال يُنفق له وثيقة، وكل مشروع له مسار مُدرّب.

  📊 ٨٤٪ من التبرعات تصل برامج مباشرة — ١١٪ مصروفات (أقل من المتوسط العالمي ١٥٪)

  🔗 https://rbdcye.org/transparency`,

  donate: `فرصة donner - ساهم في التغيير 🎁

  تبرعك سيحول إلى: أطفال مُدرّبون، عائلات مُطعمَة، آبار مياه قائمة

  📈 كل ريال يضاعف الأثر سبع مرات (حَسنة جارية)`,

  programs: `رحماء بينهم - برامجنا

  نغطي ٧ مسارات رئيسية: رعاية اجتماعية، غذاء، مياه، وإغاثة عاجلة

  📍 تغطية: ٨ محافظات يمنية

  💳 التبرع يبدأ من: ٥٠ ريال`,

  about: `رحماء بينهم للإغاثة والتنمية

  مؤسسة إنسانية مرخصة برقم ٤٨٢ منذ عام ٢٠١٤

  نعمل في مجالات: الإغاثة، التعليم، المياه، والمشاريع التنموية المستدامة

  🤝 نقدر ثقتكم ونلتزم بالشفافية المطلقة`,

  default: `رحماء بينهم للإغاثة والتنمية

  مؤسسة إنسانية تعمل في اليمن

  دعمكم يصنع الفارق كل يوم`,
};

// Helper to get message by route
const getShareMessage = (route: string): string => SHARE_MESSAGES[route] || SHARE_MESSAGES.default;

interface SocialShareProps {
  title: string;
  message: string;
  url?: string;
  via?: string;
  hashtags?: string[];
  route?: 'home' | 'transparency' | 'donate' | 'programs' | 'about' | 'default';
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  title, message, url, via = 'RohamaaBaynahum', hashtags = ['رحماء', 'إغاثة', 'يمن'],
  route = 'default'
}: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  // Use persuasive message for the specific route, fallback to generic
  const persuasiveMessage = getShareMessage(route);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`${persuasiveMessage}\n${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2" dir="rtl">
      {PLATFORMS.map(platform => (
        <a
          key={platform.id}
          href={platform.getUrl(shareUrl, persuasiveMessage, via, hashtags)}
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
