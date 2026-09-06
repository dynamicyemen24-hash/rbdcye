// Unified Development Sectors & Linked Impact Showcase Data
// بيانات القطاعات التنموية الموحدة والمشاريع وقصص الأثر

export interface SectorProject {
  id: string;
  title: string;
  description: string;
  beneficiariesCount: string;
  budget: string;
  progressPercentage: number;
  location: string;
  status: "قيد التنفيذ" | "مكتمل" | "مجدول";
  image: string;
}

export interface SectorStory {
  id: string;
  beneficiaryName: string;
  storyTitle: string;
  quote: string;
  transformationBadge: string;
  location: string;
  image: string;
}

export interface SectorItem {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  categoryTag: string;
  iconName: "Heart" | "BookOpen" | "Users" | "Mic" | "Droplet" | "Sprout";
  themeColor: string;
  themeBg: string;
  summary: string;
  impactMetrics: {
    totalBeneficiaries: string;
    completedProjects: number;
    activeProjects: number;
    governoratesCount: number;
  };
  projects: SectorProject[];
  stories: SectorStory[];
}

export const SECTORS_SHOWCASE_DATA: SectorItem[] = [
  {
    id: "sector-relief",
    code: "RELIEF",
    title: "قطاع الإغاثة والاستجابة الإنسانية العاجلة",
    subtitle: "استجابة فورية تحفظ كرامة الأسر وتوفر الاحتياجات الأساسية المنقذة للحياة",
    categoryTag: "إغاثة عاجلة",
    iconName: "Heart",
    themeColor: "var(--brand-green)",
    themeBg: "var(--success-bg)",
    summary:
      "يركز هذا القطاع على توفير السلال الغذائية الطارئة والمأوى والكساء الشتوي للأسر المتضررة والنازحة في مختلف المحافظات اليمنية الأشد احتياجاً.",
    impactMetrics: {
      totalBeneficiaries: "٢٥٬٠٠٠+",
      completedProjects: 96,
      activeProjects: 24,
      governoratesCount: 8,
    },
    projects: [
      {
        id: "p-relief-1",
        title: "مشروع السلال الغذائية الرمضانية",
        description: "تأمين المواد الغذائية الأساسية للأسر المتعففة والنازحة طيلة شهر رمضان المبارك.",
        beneficiariesCount: "٣٬٠٠٠ أسرة",
        budget: "٥٠٠٬٠٠٠ ر.ي",
        progressPercentage: 88,
        location: "صنعاء، تعز، الحديدة",
        status: "قيد التنفيذ",
        image: "/images/defaults/project-relief.svg",
      },
      {
        id: "p-relief-2",
        title: "مشروع الكساء والبطانيات الشتوية",
        description: "توزيع الأغطية والملابس الدافئة للأطفال وكبار السن في المناطق الجبلية الباردة.",
        beneficiariesCount: "٢٬٠٠٠ أسرة",
        budget: "٣٥٠٬٠٠٠ ر.ي",
        progressPercentage: 75,
        location: "عمران، حجة، ذمار",
        status: "قيد التنفيذ",
        image: "/images/defaults/project-relief.svg",
      },
    ],
    stories: [
      {
        id: "story-relief-1",
        beneficiaryName: "أم محمد - ريف تعز",
        storyTitle: "من المعاناة اليومية إلى الأمان الغذائي",
        quote: "كانت السلة الغذائية عوناً كبيراً لأطفالي بعد فقدان معيلنا، وأعادت لبيتنا الاستقرار والأمل.",
        transformationBadge: "استقرار معيشي",
        location: "محافظة تعز",
        image: "/images/defaults/story-woman.svg",
      },
    ],
  },
  {
    id: "sector-education",
    code: "EDUCATION",
    title: "قطاع التعليم والتمكين المعرفي",
    subtitle: "إعادة بناء الأمل وبناء الإنسان من خلال التعليم والتأهيل المستمر",
    categoryTag: "تعليم وتأهيل",
    iconName: "BookOpen",
    themeColor: "var(--brand-gold)",
    themeBg: "var(--brand-gold-pale)",
    summary:
      "نهدف إلى دعم العملية التعليمية وتوفير الحقائب المدرسية وتأهيل الفصول الدراسية وتدريب المعلمين لضمان بيئة تعليمية محفزة للأجيال.",
    impactMetrics: {
      totalBeneficiaries: "١٢٬٥٠٠+",
      completedProjects: 45,
      activeProjects: 12,
      governoratesCount: 6,
    },
    projects: [
      {
        id: "p-edu-1",
        title: "مشروع الحقيبة المدرسية والزي المدرسي",
        description: "توزيع المستلزمات المدرسية الشاملة لطلاب المدارس الابتدائية في القرى النائية.",
        beneficiariesCount: "٥٬٠٠٠ طالب",
        budget: "١٨٠٬٠٠٠ ر.ي",
        progressPercentage: 92,
        location: "عدة محافظات",
        status: "قيد التنفيذ",
        image: "/images/defaults/project-education.svg",
      },
      {
        id: "p-edu-2",
        title: "تأهيل وتجهيز المدارس الريفية",
        description: "ترميم الفصول وتوفير المقاعد الدراسية والألواح التعليمية للمدارس المتضررة.",
        beneficiariesCount: "١٬٢٠٠ طالب",
        budget: "٢٨٠٬٠٠٠ ر.ي",
        progressPercentage: 60,
        location: "حجة، المحويت",
        status: "قيد التنفيذ",
        image: "/images/defaults/project-education.svg",
      },
    ],
    stories: [
      {
        id: "story-edu-1",
        beneficiaryName: "الطالب عبد الرحمن",
        storyTitle: "العودة إلى مقاعد الدراسة بعد الانقطاع",
        quote: "بفضل توفير الحقيبة والكتب، استطعت العودة للدراسة وأحلم بأن أصبح طبيباً لأخدم قريتي.",
        transformationBadge: "تفوق دراسي",
        location: "محافظة حجة",
        image: "/images/defaults/story-community.svg",
      },
    ],
  },
  {
    id: "sector-community",
    code: "COMMUNITY",
    title: "قطاع التنمية والتمكين الاقتصادي",
    subtitle: "تحويل الأسر المستهلكة إلى أسر منتجة تمتلك مصادر دخل مستدامة",
    categoryTag: "تمكين وتنمية",
    iconName: "Users",
    themeColor: "var(--brand-green-light)",
    themeBg: "var(--brand-green-pale)",
    summary:
      "برامج تدريبية وتأهيلية في الحرف والمهن اليدوية وريادة الأعمال المصغرة مع منح أدوات العمل للإنتاج المستقل.",
    impactMetrics: {
      totalBeneficiaries: "٣٬٨٠٠+",
      completedProjects: 28,
      activeProjects: 9,
      governoratesCount: 5,
    },
    projects: [
      {
        id: "p-com-1",
        title: "تمكين المرأة الريفية بالحرف والخياطة",
        description: "تدريب مكثف على فنون الخياطة والتطريز وتوزيع مكائن الخياطة الحديثة مع أقمشة البداية.",
        beneficiariesCount: "١٥٠ سيدة",
        budget: "٢٢٠٬٠٠٠ ر.ي",
        progressPercentage: 80,
        location: "تعز، إب",
        status: "قيد التنفيذ",
        image: "/images/defaults/project-development.svg",
      },
      {
        id: "p-com-2",
        title: "حاضنة المشاريع المهنية للشباب",
        description: "تأهيل الشباب في صيانة الطاقة الشمسية والكهرباء وتوفير حقائب العدد الفنية المتكاملة.",
        beneficiariesCount: "١٠٠ شاب",
        budget: "١٩٠٬٠٠٠ ر.ي",
        progressPercentage: 65,
        location: "صنعاء، ذمار",
        status: "قيد التنفيذ",
        image: "/images/defaults/project-development.svg",
      },
    ],
    stories: [
      {
        id: "story-com-1",
        beneficiaryName: "فاطمة صالح",
        storyTitle: "مشغل الخياطة الصغير الذي أعال أسرة كاملة",
        quote: "استلمت ماكينة الخياطة بعد إتمام التدريب، واليوم أصبح لدي دخل يومي يكفي متطلبات أولادي.",
        transformationBadge: "استقلال مالي",
        location: "مدينة تعز",
        image: "/images/defaults/story-woman.svg",
      },
    ],
  },
  {
    id: "sector-water",
    code: "WATER",
    title: "قطاع المياه والإصحاح البيئي",
    subtitle: "توفير مياه الشرب النقية وحماية المجتمعات من الأمراض والأوبئة",
    categoryTag: "مياه ونظافة",
    iconName: "Droplet",
    themeColor: "#167A8A",
    themeBg: "rgba(22, 122, 138, 0.1)",
    summary:
      "حفر وتأهيل الآبار الارتوازية وتركيب منظومات الضخ بالطاقة الشمسية وشبكات التوزيع للقرى المحرومة من مصادر المياه.",
    impactMetrics: {
      totalBeneficiaries: "١٨٬٠٠٠+",
      completedProjects: 34,
      activeProjects: 8,
      governoratesCount: 7,
    },
    projects: [
      {
        id: "p-wat-1",
        title: "مشروع آبار المياه بالطاقة الشمسية",
        description: "حفر وتجهيز آبار ارتوازية ومحطات تنقية تعمل بالطاقة النظيفة لخدمة القرى العطشى.",
        beneficiariesCount: "٤٬٥٠٠ أسرة",
        budget: "٤٨٠٬٠٠٠ ر.ي",
        progressPercentage: 70,
        location: "مأرب، الجوف",
        status: "قيد التنفيذ",
        image: "/images/defaults/project-water.svg",
      },
      {
        id: "p-wat-2",
        title: "سقيا الماء للمخيمات والتجمعات السكانية",
        description: "تسيير شاحنات وصهاريج مياه الشرب النظيفة دورياً لمخيمات النازحين في الضواحي.",
        beneficiariesCount: "٣٬٠٠٠ أسرة",
        budget: "١٤٠٬٠٠٠ ر.ي",
        progressPercentage: 95,
        location: "مأرب، صنعاء",
        status: "قيد التنفيذ",
        image: "/images/defaults/project-water.svg",
      },
    ],
    stories: [
      {
        id: "story-wat-1",
        beneficiaryName: "أهالي قرية النور",
        storyTitle: "انتهاء معاناة جلب الماء الشاقة على النساء والأطفال",
        quote: "كنا نقطع كيلومترات يومياً على الأقدام، واليوم الماء النظيف يصل مباشرة إلى وسط القرية بفضل الله ثم جهود المؤسسة.",
        transformationBadge: "أمن مائي",
        location: "محافظة مأرب",
        image: "/images/defaults/project-water.svg",
      },
    ],
  },
  {
    id: "sector-dawah",
    code: "DAWAH",
    title: "قطاع البرامج الدعوية والقرآنية",
    subtitle: "غرس القيم الإيمانية ونشر العلم النافع ورعاية حفاظ كتاب الله",
    categoryTag: "دعوة وقرآن",
    iconName: "Mic",
    themeColor: "var(--brand-green-dark)",
    themeBg: "var(--brand-green-pale)",
    summary:
      "دعم ورعاية حلقات تحفيظ القرآن الكريم والمراكز العلمية، وتنظيم الدورات التأهيلية في التجويد والقراءات الشرعية.",
    impactMetrics: {
      totalBeneficiaries: "٨٬٢٠٠+",
      completedProjects: 52,
      activeProjects: 15,
      governoratesCount: 6,
    },
    projects: [
      {
        id: "p-daw-1",
        title: "رعاية حلقات التحفيظ النموذجية",
        description: "دعم حلقات القرآن الكريم الصباحية والمسائية وتوفير المصاحف والمكافآت التشجيعية للحفظة.",
        beneficiariesCount: "٨٠٠ طالب وطالبة",
        budget: "١٢٠٬٠٠٠ ر.ي",
        progressPercentage: 85,
        location: "صنعاء، عدن، إب",
        status: "قيد التنفيذ",
        image: "/images/defaults/story-quran.svg",
      },
    ],
    stories: [
      {
        id: "story-daw-1",
        beneficiaryName: "الحافظ إبراهيم",
        storyTitle: "إتمام حفظ كتاب الله وإجازة بالسند المتصل",
        quote: "رعاية المؤسسة للحلقات كان لها الفضل بعد توفيق الله في حفظي للقرآن الكريم وحصولي على الإجازة.",
        transformationBadge: "حفظ القرآن",
        location: "صنعاء",
        image: "/images/defaults/story-quran.svg",
      },
    ],
  },
  {
    id: "sector-agriculture",
    code: "AGRICULTURE",
    title: "قطاع سبل العيش والإنتاجية الزراعية",
    subtitle: "دعم صغار المزارعين وتوفير البذور ومنظومات الري الحديثة",
    categoryTag: "زراعة وإنتاج",
    iconName: "Sprout",
    themeColor: "#4E8D74",
    themeBg: "rgba(78, 141, 116, 0.1)",
    summary:
      "تزويد المزارعين بالبذور المحسنة ومستلزمات الري الحديثة لمساعدتهم على تحقيق الأمن الغذائي المحلي.",
    impactMetrics: {
      totalBeneficiaries: "٤٬٥٠٠+",
      completedProjects: 19,
      activeProjects: 6,
      governoratesCount: 4,
    },
    projects: [
      {
        id: "p-agr-1",
        title: "مشروع دعم البذور والري بالتنقيط",
        description: "توزيع شبكات الري بالتنقيط والبذور الموسمية على صغار المزارعين في الوديان الزراعية.",
        beneficiariesCount: "٤٠٠ مزارع",
        budget: "٣١٠٬٠٠٠ ر.ي",
        progressPercentage: 60,
        location: "صعدة، الجوف، تهامة",
        status: "قيد التنفيذ",
        image: "/images/defaults/project-development.svg",
      },
    ],
    stories: [
      {
        id: "story-agr-1",
        beneficiaryName: "المزارع صالح علي",
        storyTitle: "موسم حصاد وفير بفضل شبكة الري الحديثة",
        quote: "استطعت توفير أكثر من نصف استهلاك المياه وزيادة الإنتاجية بنسبة كبيرة ولله الحمد.",
        transformationBadge: "إنتاجية مضاعفة",
        location: "سهل تهامة",
        image: "/images/defaults/story-community.svg",
      },
    ],
  },
];
