// Why Us - قسم «لماذا رحماء بينهم» المكثف
// الرسالة والرؤية والقيم في ثلاثة أعمدة بزخارف مؤسسية
import { Compass, Eye, Gem, ArrowLeft } from "lucide-react";

import { Section, SectionHeader } from "@/app/components/layout/Section";
import { Reveal } from "@/app/components/layout/Reveal";
import { StarMedallion } from "@/app/components/decor/IslamicPattern";

interface WhyUsProps {
  setCurrentPage?: (page: string) => void;
}

const PILLARS = [
  {
    icon: Compass,
    title: "رسالتنا",
    text: "نصل إلى الأسر المتضررة في أصعب اللحظات — ونبقى معها حتى تنهض على قدميها. لا نكتفي بالسلال الغذائية؛ نبني قدرات المجتمع ليُطعم نفسه.",
  },
  {
    icon: Eye,
    title: "رؤيتنا",
    text: "مجتمع يمني يعيش بكرامة — لا ينتظر المساعدة، بل يملك أدواتها. أطفال في المدارس، أمهات في سوق العمل، أسر تدير مشروعها الصغير. هذا هو اليمن الذي نعمل لبناءه.",
  },
  {
    icon: Gem,
    title: "قيمنا",
    text: "الأمانة: كل ريال يصل إلى صاحبه. الإتقان: لا عمل ناقص. الشفافية: ننشر تقاريرنا للجميع. الرحمة: ليست شعاراً — إنها كيف نتعامل مع كل إنسان نلمسه.",
  },
];

export function WhyUs({ setCurrentPage = () => {} }: WhyUsProps) {
  return (
    <Section tone="pale" pattern="khatam">
      <SectionHeader
        badge="لماذا رحماء بينهم"
        badgeIcon={Gem}
        title="هويةٌ رسالةٌ"
        highlight="قبل أن نكون منظمة"
        subtitle="ولدت رحماء بينهم من قناعة راسخة: أن العمل الإنساني أمانة قبل أن يكون نشاطاً، وأن كل ريال وكل ساعة تطوع يجب أن يصل كاملةً لمن يستحقه"
      />

      <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
        {PILLARS.map((pillar, i) => (
          <Reveal key={pillar.title} delay={i * 0.1}>
            <article className="group h-full rounded-3xl p-8 bg-white/85 backdrop-blur-sm border border-[var(--border)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl hover:border-[var(--brand-gold)]/40">
              <StarMedallion size={76} color="var(--brand-gold)" className="mb-6">
                <pillar.icon
                  className="w-8 h-8 transition-transform duration-500 group-hover:scale-110"
                  style={{ color: "var(--brand-green)" }}
                />
              </StarMedallion>

              <h3
                className="font-extrabold mb-3"
                style={{ fontSize: "1.2rem", color: "var(--foreground)" }}
              >
                {pillar.title}
              </h3>
              <p
                className="leading-loose"
                style={{ fontSize: "0.92rem", color: "var(--muted-foreground)" }}
              >
                {pillar.text}
              </p>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.35}>
        <div className="mt-12 text-center">
          <button
            onClick={() => setCurrentPage("about")}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-bold transition-all hover:-translate-y-0.5 hover:shadow-lg"
            style={{
              background: "linear-gradient(135deg, var(--brand-green), var(--brand-green-light))",
              color: "#FFFFFF",
            }}
          >
            تعرّف على قصتنا وفريقنا
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </Reveal>
    </Section>
  );
}
