// Ayah Band - شريط الآية القرآنية
// جسر روحي بين برهان الأرقام والذروة العاطفية للقصة
import { Section } from "@/app/components/layout/Section";
import { Reveal } from "@/app/components/layout/Reveal";
import { IslamicDivider } from "@/app/components/decor/IslamicPattern";

export function AyahBand() {
  return (
    <Section tone="white" pattern="arabesque" className="!py-14 md:!py-16">
      <Reveal>
        <figure className="max-w-3xl mx-auto text-center">
          <IslamicDivider tone="gold" className="mb-8" />

          <blockquote
            className="leading-[2.2] mb-4"
            style={{
              fontSize: "clamp(1.15rem, 1rem + 1.4vw, 1.7rem)",
              fontWeight: 700,
              color: "var(--brand-green-dark)",
            }}
          >
            ﴿ مَثَلُ الَّذِينَ يُنفِقُونَ أَمْوَالَهُمْ فِي سَبِيلِ اللَّهِ كَمَثَلِ حَبَّةٍ
            أَنبَتَتْ سَبْعَ سَنَابِلَ فِي كُلِّ سُنبُلَةٍ مِّائَةُ حَبَّةٍ ﴾
          </blockquote>

          <figcaption
            className="inline-block px-4 py-1 rounded-full"
            style={{
              fontSize: "var(--fs-xs)",
              fontWeight: 700,
              color: "var(--brand-gold)",
              background: "var(--brand-gold-pale)",
              border: "1px solid rgba(var(--brand-gold-rgb),0.3)",
            }}
          >
            سورة البقرة ۝ ٢٦١
          </figcaption>

          <IslamicDivider tone="gold" className="mt-8" />
        </figure>
      </Reveal>
    </Section>
  );
}
