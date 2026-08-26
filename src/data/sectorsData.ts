// Unified Development Sectors & Linked Impact Showcase Data
// بيانات القطاعات التنموية والمشاريع وقصص النجاح الموحدة

export interface SectorProject {
  id: string;
  title: string;
  description: string;
  beneficiariesCount: string;
  budget: string;
  progressPercentage: number;
  location: string;
  status: 'جارٍ التنفيذ' | 'مكتمل' | 'مستمر';
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
  iconName: 'Heart' | 'BookOpen' | 'Users' | 'Mic' | 'Droplet' | 'Sprout';
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
    id: 'sector-relief',
    code: 'RELIEF',
    title: 'قطاع الإغاثة الطارئة وحماية الحياة',
    subtitle: 'استجابة إنسانية عاجلة لحفظ كرامة الإنسان وتوفير متطلبات الحياة الأساسية',
    categoryTag: 'إغاثة عاجلة',
    iconName: 'Heart',
    themeColor: '#0F4C3A',
    themeBg: '#F0FDF4',
    summary: 'يختص هذا القطاع بتوزيع السلال الغذائية الشهرية، والمآوي الطارئة، وتوفير حقائب الرعاية الصحية العاجلة للأسر المتضررة والنازحين في مختلف محافظات اليمن.',
    impactMetrics: {
      totalBeneficiaries: '٤,٨٠٠+',
      completedProjects: 96,
      activeProjects: 24,
      governoratesCount: 8
    },
    projects: [
      {
        id: 'p-relief-1',
        title: 'مشروع السلة الغذائية الكافية',
        description: 'توزيع سلال غذائية متكاملة تكفي الأسرة لمدة شهر كامل في المناطق الأشد استحقاقاً.',
        beneficiariesCount: '٣,٠٠٠ أسرة',
        budget: '١٥٠,٠٠٠ $',
        progressPercentage: 88,
        location: 'تعز، الحديدة، مأرب',
        status: 'جارٍ التنفيذ',
        image: '/images/defaults/sector-relief.svg'
      },
      {
        id: 'p-relief-2',
        title: 'مشروع الإيواء الطارئ للمهجرين',
        description: 'إنشاء وتجهيز وحدات إيواء خشبية ومقاومة للتقلبات المناخية للنازحين جدداً.',
        beneficiariesCount: '٨٠٠ أسرة',
        budget: '٩٥,٠٠٠ $',
        progressPercentage: 75,
        location: 'مأرب والحديدة',
        status: 'جارٍ التنفيذ',
        image: '/images/defaults/project-infrastructure.svg'
      }
    ],
    stories: [
      {
        id: 'story-relief-1',
        beneficiaryName: 'أم محمد - معيلة ٥ أطفال',
        storyTitle: 'من مأساة النزوح إلى الأمان الغذائي',
        quote: 'بفضل السلال الغذائية المنتظمة، استعادت أسرتي استقرارها ولم نعد نخشى تأمين قوت يومنا.',
        transformationBadge: 'استقرار معيشي موثق',
        location: 'مخيمات تعز',
        image: '/images/defaults/story-woman.svg'
      }
    ]
  },
  {
    id: 'sector-empowerment',
    code: 'EMPOWERMENT',
    title: 'قطاع التمكين الاقتصادي وسُبل العيش',
    subtitle: 'تحويل الأسر المحتاجة إلى طاقات إنتاجية مستقلة ومستدامة',
    categoryTag: 'تمكين وإنتاج',
    iconName: 'Users',
    themeColor: '#0F4C3A',
    themeBg: '#ECFDF5',
    summary: 'يعمل القطاع على توفير أدوات الإنتاج، وتمويل الورش والمشاريع الصغيرة، وتمكين النساء المعيلات من الإمساك بزمام استقلالهن المالي واستعادة كرامتهن المعيشية.',
    impactMetrics: {
      totalBeneficiaries: '٢,٨٠٠+',
      completedProjects: 70,
      activeProjects: 24,
      governoratesCount: 6
    },
    projects: [
      {
        id: 'p-empower-1',
        title: 'مشروع المشاغل ومكائن الخياطة الإنتاجية',
        description: 'تأهيل وتزويد النساء المعيلات بمكائن خياطة حديثة وأقمشة لبدء مشاريعهن الخاصة.',
        beneficiariesCount: '٤٥٠ امرأة',
        budget: '٨٠,٠٠٠ $',
        progressPercentage: 92,
        location: 'صنعاء وعدن',
        status: 'جارٍ التنفيذ',
        image: '/images/defaults/sector-empowerment.svg'
      },
      {
        id: 'p-empower-2',
        title: 'مشروع دعم صغار المزارعين والنحل',
        description: 'توفير خلايا النحل ومستلزمات الزراعة للأسر الريفية لضمان دخل مستدام.',
        beneficiariesCount: '٣٥٠ أسرة',
        budget: '٦٥,٠٠٠ $',
        progressPercentage: 80,
        location: 'إب وحجة',
        status: 'جارٍ التنفيذ',
        image: '/images/defaults/sector-agriculture.svg'
      }
    ],
    stories: [
      {
        id: 'story-empower-1',
        beneficiaryName: 'فاطمة أحمد - صاحبة مشروعات خياطة',
        storyTitle: 'قصة نجاح: تحول تام من الاحتياج إلى الإنتاج',
        quote: 'امتلاكي لمكينة الخياطة منحني القدرة على إعالة أطفالي الأربعة وتأمين مصاريف دراستهم بكرامة.',
        transformationBadge: 'اكتفاء ذاتي مستدام',
        location: 'محافظة صنعاء',
        image: '/images/defaults/story-woman.svg'
      }
    ]
  },
  {
    id: 'sector-education',
    code: 'EDUCATION',
    title: 'قطاع التعليم وبناء القدرات',
    subtitle: 'بناء العقول وتأهيل أجيال الغد عبر التعليم والتأهيل الميداني',
    categoryTag: 'تعليم وتأهيل',
    iconName: 'BookOpen',
    themeColor: '#8F6A1A',
    themeBg: '#FDF8EE',
    summary: 'دعم المدارس والكتاتيب القرآنية، وتوزيع الحقائب المدرسية، وتوفير المنح الدراسية والبرامج التدريبية المتقدمة للشباب والفتيات.',
    impactMetrics: {
      totalBeneficiaries: '٣,٢٠٠+',
      completedProjects: 65,
      activeProjects: 20,
      governoratesCount: 7
    },
    projects: [
      {
        id: 'p-edu-1',
        title: 'مشروع الحقيبة المدرسية والبيئة التعليمية',
        description: 'توفير الحقائب والكتب والزي المباشر للطلاب الأيتام والأشد فقراً.',
        beneficiariesCount: '١,٥٠٠ طالب',
        budget: '٤٥,٠٠٠ $',
        progressPercentage: 85,
        location: 'المحافظات النائية',
        status: 'جارٍ التنفيذ',
        image: '/images/defaults/sector-education.svg'
      }
    ],
    stories: [
      {
        id: 'story-edu-1',
        beneficiaryName: 'الطالبة المتميزة - سارة',
        storyTitle: 'المنحة الدراسية وتفوق دون انقطاع',
        quote: 'بفضل الدعم المستمر والتكفل بمستلزماتي، واصلت دراستي وتأهلت للترتيب الأول في مدرستي.',
        transformationBadge: 'تفوق علمي موثق',
        location: 'محافظة تعز',
        image: '/images/defaults/story-default.svg'
      }
    ]
  },
  {
    id: 'sector-dawah',
    code: 'DAWAH',
    title: 'قطاع الدعوة والعمارة الإسلامية',
    subtitle: 'عمارة المساجد ورعاية حلقات القرآن الكريم وتوزيع المصاحف الشريفة',
    categoryTag: 'عمارة ودعوة',
    iconName: 'Mic',
    themeColor: '#92400E',
    themeBg: '#FEF3C7',
    summary: 'رعاية بيوت الله تعالى وترميمها، دعم حفاظ كتاب الله، ونشر المصاحف والكتيبات التوعوية والأخلاقية لتعزيز قيم المجتمع.',
    impactMetrics: {
      totalBeneficiaries: '٢,٠٤٧+',
      completedProjects: 38,
      activeProjects: 10,
      governoratesCount: 5
    },
    projects: [
      {
        id: 'p-dawah-1',
        title: 'مشروع كفالة حلقات تحفيظ القرآن الكريم',
        description: 'دعم المحفظين وتكريم الطلاب وتوزيع المصاحف الشريفة والمطبوعات الدعوية.',
        beneficiariesCount: '٨٠٠ طالب وطالبة',
        budget: '٣٠,٠٠٠ $',
        progressPercentage: 90,
        location: 'جوامع ومراكز اليمن',
        status: 'مستمر',
        image: '/images/defaults/sector-dawah.svg'
      }
    ],
    stories: [
      {
        id: 'story-dawah-1',
        beneficiaryName: 'الحافظ - عبد الرحمن',
        storyTitle: 'إتمام حفظ كتاب الله كاملاً',
        quote: 'الالتحاق بحلقة التحفيظ المكفولة أتاح لي حفظ القرآن كاملاً وأصلح مسار حياتي العلمية.',
        transformationBadge: 'إتمام القرآن الكريم',
        location: 'محافظة إب',
        image: '/images/defaults/story-man.svg'
      }
    ]
  }
];
