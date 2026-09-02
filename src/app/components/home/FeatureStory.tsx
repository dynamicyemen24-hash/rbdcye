// Feature Story - نموذج المعرفة والأثر (الذروة العاطفية للصفحة)
import { Quote, MapPin, ArrowLeft, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Section, SectionHeader } from "@/app/components/layout/Section";
import { Reveal } from "@/app/components/layout/Reveal";
import { SEED_SUCCESS_STORIES } from "@/content/website";

const FALLBACK_IMAGE = "/images/defaults/story-woman.svg";

export function FeatureStory() {
  const navigate = useNavigate();
  const story = SEED_SUCCESS_STORIES[0];

  if (!story) return null;

  return (
    <Section tone="cream" pattern="zellij">
      <SectionHeader
        badge="معرفة من الميدان"
        badgeIcon={Star}
        title="حين تتحول المعرفة إلى"
        highlight="أثر دائم"
        subtitle="نؤمن أن أسمى غايات العمل الخيري أن نشارك ما توصلنا إليه من معرفة وأثر؛ هذه دراسة توثّق تحوّل المساعدة إلى نتائج قابلة للقياس"
      />

      <Reveal>
        <article className="grid lg:grid-cols-5 rounded-3xl overflow-hidden border border-[var(--border)] shadow-xl bg-white">
          <div className="relative lg:col-span-2 min-h-[320px] lg:min-h-[460px]">
            <img
              src={story.image || FALLBACK_IMAGE}
              alt={story.title}
              loading="lazy"
              onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
            <blockquote className="absolute bottom-0 right-0 left-0 p-7">
              <Quote className="w-8 h-8 mb-3" style={{ color: "var(--brand-gold)" }} />
              <p
                className="leading-loose text-white"
                style={{ fontSize: "1.02rem", fontWeight: 600 }}
              >
                {story.quote}
              </p>
            </blockquote>
          </div>

          <div className="lg:col-span-3 p-8 md:p-12 flex flex-col justify-center">
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <span
                className="px-3 py-1 rounded-full text-xs font-bold"
                style={{ background: "var(--brand-green-pale)", color: "var(--brand-green)" }}
              >
                {story.program}
              </span>
              <span
                className="px-3 py-1 rounded-full text-xs font-bold"
                style={{ background: "var(--brand-gold-pale)", color: "var(--brand-gold)" }}
              >
                {story.category}
              </span>
              <span className="flex items-center gap-1 text-xs" style={{ color: "var(--muted-foreground)" }}>
                <MapPin className="w-3.5 h-3.5" />
                {story.location} · {story.year}
              </span>
            </div>

            <h3
              className="font-extrabold mb-4"
              style={{ fontSize: "clamp(1.35rem, 2.6vw, 1.9rem)", color: "var(--foreground)", lineHeight: 1.4 }}
            >
              {story.title}
            </h3>

            <p
              className="leading-loose mb-8"
              style={{ fontSize: "0.98rem", color: "var(--muted-foreground)" }}
            >
              {story.excerpt}
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 pt-6 border-t border-[var(--border)]">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center font-extrabold text-lg shrink-0"
                  style={{
                    background: "linear-gradient(135deg, var(--brand-green), var(--brand-green-light))",
                    color: "#FFFFFF",
                  }}
                >
                  {story.name?.charAt(0)}
                </div>
                <div>
                  <div className="font-bold" style={{ fontSize: "0.95rem", color: "var(--foreground)" }}>
                    {story.name}
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "var(--muted-foreground)" }}>{story.role}</div>
                </div>
              </div>

              <button
                onClick={() => navigate("/success")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all hover:-translate-y-0.5 hover:shadow-lg"
                style={{
                  border: "1.5px solid var(--brand-green)",
                  color: "var(--brand-green)",
                }}
              >
                المزيد من الأبحاث
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </article>
      </Reveal>
    </Section>
  );
}

