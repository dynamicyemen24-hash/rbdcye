// About Page - من نحن - الهوية الموحدة
import { motion } from "motion/react";
import {
  Heart,
  Globe,
  Users,
  Target,
  Star,
  Shield,
  Sparkles,
  Quote,
  Compass,
  Award,
  Calendar,
  CheckCircle2,
  Crown,
  Layers,
  BadgeCheck,
  Gem,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useSEO } from "@/utils/seoAdvanced";
import {
  scrollFadeUp,
  staggerContainer,
  viewportOnce,
  hoverLift,
} from "@/utils/animations";

function SectionLabel({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <div
      className={`mb-6 inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.16em] ${light ? "text-[var(--brand-gold-light)]" : "text-[var(--brand-gold-dark)]"}`}
    >
      <span className="h-px w-8 bg-[var(--brand-gold)]" />
      <span>{children}</span>
    </div>
  );
}

// Use centralized scrollFadeUp and staggerContainer from @/utils/animations

export default function AboutPage() {
  useSEO({
    title: "من نحن - حملة رحماء بينهم للإغاثة والتنمية",
    description:
      "حملة رحماء بينهم للإغاثة والتنمية بالجمهورية اليمنية؛ حملة إنسانية تنموية مستقلة مرخصة برقم ٤٨٢. انطلقت استجابةً للاحتياج الإنساني وتعمل على صون كرامة الإنسان وصناعة الأثر المستدام منذ ٢٠١٤م.",
    keywords: ["من نحن", "حملة رحماء بينهم", "إغاثة اليمن", "تنمية", "ترخيص 482"],
    url: "https://rbdcye.org/about",
  });

  const navigate = useNavigate();
  const go = (page: string) => {
    navigate(page === "home" ? "/" : `/${page}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const aboutText =
    'حملة "رحماء بينهم" للإغاثة والتنمية بالجمهورية اليمنية؛ حملة دعوية وإنسانية وتنموية مستقلة مرخصة رسمياً برقم (٤٨٢). انطلقت مسيرة عطائها استجابةً للاحتياج الإنساني ومعاناة المجتمع اليمني، وتسعى الحملة – بدعم شركاء الخير والعطاء – إلى صون حياة الإنسان وإغاثته وتنميته عبر برامج تعليمية وتنموية وإغاثية مستدامة، مستهدفةً الفئات الأكثر احتياجاً بروح الإخاء والمسؤولية التامة.';

  const supervisorMessage = `إنه لمن دواعي سرورنا اليوم وبعد ما يقارب عشرة أعوام من العطاء المستمر والجهود الدؤوبة، وبما يتوافق مع رؤيتنا وأهدافنا، يطيب لنا أن نقف شاكرين لله تعالى، وممتنين لكل صاحب يد سخية وجهد مبارك رسمنا سويا بصمات شريفة وأثرا حميدا، مما جعل حملة رحماء بينهم تحقق نجاحات مبهرة في مجالات متنوعة على مساحات واسعة، عبر ما يزيد عقد من الزمن.`;

  const supervisorMessagePart2 = `فشكرًا لكل داعمٍ ومحسن، وشكرًا لكل عاملٍ وداعية، وشكرًا لكل من جعل العطاء هويته ورسالة حياته.`;

  const partnersText = `"إلى أولئك الأخفياء الأتقياء الأصفياء، والذين ما كان لنا أن نحقق شيئاً من مشاريعنا، مؤمنين أن ما تعلّم متعلّم ولا حفظ حافظ ولا طعِم جائع ولا ارتوى ظامئ ولا اكتسى عارٍ ولا ارتسمت على محيّا حزين بسمة وكُفّت عنه دمعة إلا بفضل الله ثم بفضل الراغبين فيما عند الكريم، مَن يرون أن إصلاح المسلمين والإحسان إليهم مطلباً ربانياً ومسؤولية مجتمعية واجباً قيمياً وأخلاقياً."`;

  return (
    <div className="min-h-screen bg-[var(--background)]" dir="rtl">

      {/* ═══════════════════════════════════════════
          Hero Banner
          ═══════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[var(--brand-green-dark)] py-28 text-white sm:py-40 bg-islamic-star">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "var(--pattern-rub-el-hizb)", backgroundSize: "200px 200px" }} />
        <div className="relative mx-auto max-w-5xl px-5 text-center sm:px-8">
          <motion.div initial="initial" animate="visible" variants={staggerContainer}>
            <motion.div variants={scrollFadeUp} className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70 backdrop-blur-sm">
              <BadgeCheck className="h-3.5 w-3.5 text-[var(--brand-gold)]" />
              مرخصة رسمياً برقم ٤٨٢ — منذ ٢٠١٤م
            </motion.div>
            <motion.h1 variants={scrollFadeUp} className="text-3xl font-bold leading-[1.35] sm:text-5xl lg:text-6xl">
              من <span className="text-[var(--brand-gold-light)]">نحن</span>
            </motion.h1>
            <motion.p variants={scrollFadeUp} className="mx-auto mt-6 max-w-3xl text-base leading-[2] text-white/55 sm:text-lg">
              حملة رحماء بينهم للإغاثة والتنمية — حملة دعوية وإنسانية وتنموية
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ═══════ آية قرآنية ═══════ */}
      <div className="my-8 rounded-2xl border border-[var(--brand-gold)]/20 bg-gradient-to-l from-[var(--brand-gold)]/5 to-transparent p-6 text-center">
        <p className="font-amiri text-xl leading-loose text-[var(--foreground)] md:text-2xl" dir="rtl">
          ﴿ وَتَعَاوَنُوا عَلَى الْبِرِّ وَالتَّقْوَىٰ ﴾
        </p>
        <p className="mt-3 text-sm text-[var(--muted-foreground)]">سورة المائدة، الآية ٢</p>
      </div>

      {/* ═══════════════════════════════════════════
          تعريف بالحملة
          ═══════════════════════════════════════════ */}
      <section className="bg-[var(--background)] py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial="initial" whileInView="visible" viewport={viewportOnce} variants={scrollFadeUp}>
            <SectionLabel>
              <Gem className="h-3.5 w-3.5" />
              نبذة عنا
            </SectionLabel>
            <h2 className="max-w-3xl text-3xl font-bold leading-[1.4] text-[var(--brand-green)] sm:text-4xl">
              تعريف <span className="text-[var(--brand-gold)]">بالحملة</span>
            </h2>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="visible"
            viewport={viewportOnce}
            variants={scrollFadeUp}
            className="mt-10 rounded-[24px] border border-[var(--brand-green)]/8 bg-[var(--background)] p-6 sm:p-8"
          >
            <Quote className="mb-6 h-10 w-10 text-[var(--brand-green)]/15" />
            <p className="text-lg leading-[2] text-[var(--foreground)] sm:text-xl">
              {aboutText}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-6 border-t border-[var(--border)] pt-6">
              {[
                { icon: Calendar, label: "انطلقت ٢٠١٤م" },
                { icon: Target, label: "برامج متنوعة" },
                { icon: Globe, label: "تغطية واسعة" },
                { icon: BadgeCheck, label: "ترخيص رسمي ٤٨٢" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                  <item.icon className="h-4 w-4 text-[var(--brand-green)]" />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          كلمة المشرف العام
          ═══════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[var(--secondary)] py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial="initial" whileInView="visible" viewport={viewportOnce} variants={scrollFadeUp}>
            <SectionLabel>
              <Crown className="h-3.5 w-3.5" />
              كلمة القيادة
            </SectionLabel>
            <h2 className="max-w-3xl text-3xl font-bold leading-[1.4] text-[var(--brand-green)] sm:text-4xl">
              كلمة <span className="text-[var(--brand-gold)]">المشرف العام</span>
            </h2>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="visible"
            viewport={viewportOnce}
            variants={scrollFadeUp}
            className="mt-10 rounded-[24px] border-r-[6px] border-[var(--brand-green)] bg-[var(--card)] p-6 sm:p-8 shadow-lg"
          >
            <Quote className="mb-6 h-10 w-10 text-[var(--brand-green)]/15" />
            <motion.p
              className="text-lg leading-[2] text-[var(--foreground)] sm:text-xl"
              initial="initial"
              whileInView="visible"
              viewport={viewportOnce}
              variants={scrollFadeUp}
              transition={{ delay: 0.2 }}
            >
              {supervisorMessage}
            </motion.p>
            <motion.p
              className="mt-6 text-lg leading-[2] text-[var(--foreground)] sm:text-xl"
              initial="initial"
              whileInView="visible"
              viewport={viewportOnce}
              variants={scrollFadeUp}
              transition={{ delay: 0.3 }}
            >
              {supervisorMessagePart2}
            </motion.p>

            <div className="mt-8 flex items-center gap-4 border-t border-[var(--border)] pt-6">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-[var(--brand-green)]/10 text-[var(--brand-green)]">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-lg font-bold text-[var(--foreground)]">المشرف العام</p>
                <p className="text-sm text-[var(--muted-foreground)]">حملة رحماء بينهم</p>
              </div>
              <div className="mr-auto flex items-center gap-2 text-sm text-[var(--brand-green)]">
                <BadgeCheck className="h-4 w-4" />
                <span>عقد من العطاء</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          الهوية التنموية — الرؤية والرسالة والقيم
          ═══════════════════════════════════════════ */}
      <section className="bg-[var(--background)] py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial="initial" whileInView="visible" viewport={viewportOnce} variants={scrollFadeUp}>
            <SectionLabel>
              <Layers className="h-3.5 w-3.5" />
              هوية
            </SectionLabel>
            <h2 className="max-w-3xl text-3xl font-bold leading-[1.4] text-[var(--brand-green)] sm:text-4xl">
              هويتنا <span className="text-[var(--brand-gold)]">التنموية</span>
            </h2>
          </motion.div>

          <div className="mt-14 grid gap-8 sm:grid-cols-2">
            {/* الرؤية */}
            <motion.div
              initial="initial"
              whileInView="visible"
              viewport={viewportOnce}
              variants={scrollFadeUp}
              whileHover={hoverLift.whileHover}
              className="rounded-[24px] border border-[var(--brand-green)]/8 bg-[var(--background)] p-6 sm:p-8 transition hover:shadow-lg"
            >
              <div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-[var(--brand-green)]/8 text-[var(--brand-green)]">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-[var(--foreground)]">رؤيتنا</h3>
              <p className="mt-4 text-base leading-[1.9] text-[var(--muted-foreground)] flex-1">
                الريادة والشمولية في المجال الدعوي والإنساني والتنموي.
              </p>
            </motion.div>

            {/* الرسالة */}
            <motion.div
              initial="initial"
              whileInView="visible"
              viewport={viewportOnce}
              variants={scrollFadeUp}
              whileHover={hoverLift.whileHover}
              className="rounded-[24px] border border-[var(--brand-green)]/8 bg-[var(--background)] p-6 sm:p-8 transition hover:shadow-lg"
            >
              <div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-[var(--brand-gold)]/10 text-[var(--brand-gold-dark)]">
                <Heart className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-[var(--foreground)]">رسالتنا</h3>
              <p className="mt-4 text-base leading-[1.9] text-[var(--muted-foreground)] flex-1">
                الإسهام في إصلاح المجتمع روحاً وسلوكاً، ومد يد العون لتوفير حياة كريمة يعيشها،
                بالشراكة مع المهتمين والخيرين في الداخل والخارج.
              </p>
            </motion.div>
          </div>

          {/* القيم */}
          <motion.div
            initial="initial"
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerContainer}
            className="mt-14"
          >
            <div className="mb-8 flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--brand-green)]/8 text-[var(--brand-green)]">
                <Award className="h-5 w-5" />
              </div>
              <h3 className="text-2xl font-bold text-[var(--foreground)]">قيمها الناظمة</h3>
            </div>

            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
              {[
                { icon: Star, label: "الإخلاص", desc: "نية صادقة" },
                { icon: Shield, label: "الشفافية", desc: "وضوح تام" },
                { icon: Award, label: "الإتقان", desc: "إتقان العمل" },
                { icon: Users, label: "المسؤولية", desc: "تحمل المسؤولية" },
                { icon: Sparkles, label: "المبادرة", desc: "روح المبادرة" },
              ].map((value) => (
                <motion.div
                  key={value.label}
                  variants={scrollFadeUp}
                  whileHover={hoverLift.whileHover}
                  className="rounded-2xl border border-[var(--brand-green)]/8 bg-[var(--card)] p-6 sm:p-8 text-center transition hover:shadow-md"
                >
                  <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-[var(--brand-green)]/8 text-[var(--brand-green)]">
                    <value.icon className="h-5 w-5" />
                  </div>
                  <p className="font-bold text-[var(--foreground)]">{value.label}</p>
                  <p className="mt-1 text-xs text-[var(--muted-foreground)]">{value.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          أهدافنا
          ═══════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[var(--secondary)] py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial="initial" whileInView="visible" viewport={viewportOnce} variants={scrollFadeUp}>
            <SectionLabel>
              <Target className="h-3.5 w-3.5" />
              طموحاتنا
            </SectionLabel>
            <h2 className="max-w-3xl text-3xl font-bold leading-[1.4] text-[var(--brand-green)] sm:text-4xl">
              أهدافنا <span className="text-[var(--brand-gold)]">وطموحاتنا</span>
            </h2>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerContainer}
            className="mt-14 grid gap-6 sm:grid-cols-2"
          >
            {[
              "تحقيق مبدأ التعاون على البر والتقوى، وخلق روح التكافل بين أفراد الأمة المسلمة",
              "إحياء دور المسجد في التربية والإصلاح، وإبرار رسالة العلم، والمحافظة على أوقات المسلم",
              "الإسهام في توفير حياة كريمة لشريحة المستفيدين وصيانتهم من مذلة السؤال",
              "تحقيق الاكتفاء التنموي الذاتي لضمان بقاء المشاريع وديمومة أدائها",
            ].map((goal, index) => (
              <motion.div
                key={`goal-${index}`}
                variants={scrollFadeUp}
                whileHover={{ x: -4 }}
                className="flex items-start gap-5 rounded-2xl border border-[var(--brand-green)]/8 bg-[var(--card)] p-6 sm:p-8 transition hover:shadow-lg shadow-md"
              >
                <div className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-full bg-[var(--brand-green)] text-sm font-bold text-white">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-base leading-[1.9] text-[var(--foreground)]">{goal}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-px w-12 bg-[var(--brand-green)]/20" />
                    <span className="text-xs text-[var(--brand-green)]">هدف استراتيجي</span>
                  </div>
                </div>
                <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-[var(--brand-green)]/30" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          الفئات المستهدفة
          ═══════════════════════════════════════════ */}
      <section className="bg-[var(--background)] py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial="initial" whileInView="visible" viewport={viewportOnce} variants={scrollFadeUp}>
            <SectionLabel>
              <Users className="h-3.5 w-3.5" />
              من نستهدف
            </SectionLabel>
            <h2 className="max-w-3xl text-3xl font-bold leading-[1.4] text-[var(--brand-green)] sm:text-4xl">
              الفئات <span className="text-[var(--brand-gold)]">المستهدفة</span>
            </h2>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerContainer}
            className="mt-14 grid gap-6 sm:grid-cols-2"
          >
            {[
              {
                icon: Heart,
                title: "الأيتام والأرامل والأسر المتعففة",
                desc: "مستفيدو الكفالات المادية، الكسوة، وتفريج كرب الغارمين",
              },
              {
                icon: Compass,
                title: "المحتاجون والنازحون",
                desc: "مستفيدو السلال الغذائية، المطابخ الخيرية، واللحوم وتفطير الصائمين",
              },
              {
                icon: Star,
                title: "طلاب وحفظة القرآن والمعلمون",
                desc: "مستفيدو كفالات الحلقات، طباعة المصاحف والكتب العلمية",
              },
              {
                icon: Globe,
                title: "سكان المناطق النائية والجافة",
                desc: "مستفيدو حفر الآبار، شبكات السقيا، وبناء المساجد ودور القرآن",
              },
              {
                icon: Target,
                title: "الأسر الباحثة عن الدخل",
                desc: "مستفيدو تمليك الأدوات الإنتاجية للتحوّل إلى أسر منتجة",
              },
            ].map((group, index) => (
              <motion.div
                key={group.title}
                variants={scrollFadeUp}
                whileHover={hoverLift.whileHover}
                className="flex items-start gap-5 rounded-2xl border border-[var(--brand-green)]/8 bg-[var(--background)] p-6 sm:p-8 transition hover:shadow-lg shadow-md min-h-[140px]"
              >
                <div className="grid h-13 w-13 flex-shrink-0 place-items-center rounded-2xl bg-[var(--brand-green)]/8 text-[var(--brand-green)]">
                  <group.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-[var(--foreground)]">{group.title}</h3>
                  <p className="mt-3 text-sm leading-[1.9] text-[var(--muted-foreground)]">{group.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          شركاء النجاح
          ═══════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[var(--brand-green)] py-24 text-white sm:py-32">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div initial="initial" whileInView="visible" viewport={viewportOnce} variants={scrollFadeUp}>
            <SectionLabel light>شراكات</SectionLabel>
            <h2 className="text-3xl font-bold leading-[1.4] sm:text-4xl">
              شركاء <span className="text-[var(--brand-gold-light)]">النجاح</span>
            </h2>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="visible"
            viewport={viewportOnce}
            variants={scrollFadeUp}
            className="mt-10 rounded-[24px] border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur-sm"
          >
            <Quote className="mx-auto mb-6 h-10 w-10 text-white/10" />
            <p className="text-lg leading-[2] text-white/70 sm:text-xl">
              {partnersText}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-6 border-t border-white/10 pt-6">
              {[
                { icon: Heart, label: "شركاء النجاح" },
                { icon: Star, label: "داعمون أوفياء" },
                { icon: Target, label: "صناع الأثر" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-sm text-white/60">
                  <div className="h-1.5 w-1.5 rounded-full bg-[var(--brand-gold)]" />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
