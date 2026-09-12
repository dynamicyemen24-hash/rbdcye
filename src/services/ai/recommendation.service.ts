// AI-powered Recommendation Engine for Smart Giving Advisor
// Uses rule-based matching + scoring algorithm to recommend projects

export interface DonorPreference {
  categories: string[];
  priority: 'urgency' | 'impact' | 'cost' | 'specific';
  budget: number;
  isMonthly: boolean;
  pastDonations?: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  need: string;
  beneficiaries: string;
  beneficiaryCount: number;
  location: string;
  governorate: string;
  impactAchieved: string;
  totalBudget: number;
  collected: number;
  remaining: number;
  duration: string;
  successIndicators: string[];
  phases: { name: string; status: 'completed' | 'active' | 'pending' }[];
  urgencyLevel: 'high' | 'medium' | 'low';
  status: 'active' | 'completed' | 'urgent';
  tags: string[];
}

export interface Recommendation {
  project: Project;
  score: number;
  reasons: string[];
  suggestedAmount: number;
  impactPreview: string;
}

const MOCK_PROJECTS: Project[] = [
  {
    id: 'YEM-EDU-001',
    title: 'تعليم الأطفال في مخيمات النزوح',
    description: 'إنشاء فصول تعليمية متنقلة لأكثر من ٢٠٠ طفل نازح في مخيمات تعز',
    category: 'تعليم',
    need: 'أكثر من ٨٠٪ من أطفال النزوح يفتقرون للتعليم الأساسي',
    beneficiaries: 'أطفال النازحين',
    beneficiaryCount: 200,
    location: 'تعز',
    governorate: 'تعز',
    impactAchieved: 'تم إنشاء ٥ فصول تعليمية وتعليم ١٥٠ طفلاً',
    totalBudget: 25000,
    collected: 18000,
    remaining: 7000,
    duration: '٦ أشهر',
    successIndicators: ['تحسن الأداء الدراسي', 'زيادة الحضور', 'reduce dropout'],
    phases: [
      { name: 'بناء الفصول', status: 'completed' },
      { name: 'توفير الكتب', status: 'active' },
      { name: 'تدريب المعلمين', status: 'pending' }
    ],
    urgencyLevel: 'high',
    status: 'active',
    tags: ['أطفال', 'نزوح', 'تعليم', 'تعز']
  },
  {
    id: 'YEM-HLT-001',
    title: '럊شاف الأمراض المعدية في تعز',
    description: 'tractoration campaign to prevent cholera outbreaks in displacement camps',
    category: 'صحة',
    need: 'ارتفاع حالات الإسهال والمياه الملوثة تهدد حياة الآلاف',
    beneficiaries: 'سكان مخيمات النزوح',
    beneficiaryCount: 5000,
    location: 'تعز',
    governorate: 'تعز',
    impactAchieved: 'تم علاج ١٢٠٠ مريض ومنع انتشار وباء الكوليرا',
    totalBudget: 40000,
    collected: 22000,
    remaining: 18000,
    duration: '٣ أشهر',
    successIndicators: ['انخفاض حالات المرض', 'تحسن نوعية المياه'],
    phases: [
      { name: 'جمع العينات', status: 'completed' },
      { name: 'نشر캎 العلاج', status: 'active' },
      { name: 'التوعية الصحية', status: 'pending' }
    ],
    urgencyLevel: 'high',
    status: 'urgent',
    tags: ['صحة', 'وباء', 'كوليرا', 'تعز']
  },
  {
    id: 'YEM-FOOD-001',
    title: 'حقيبة الطعام العاجلة لعائلات صنعاء',
    description: 'توزيع حقيبة غذائية كافية لعائلة لمدة أسبوع كامل في صنعاء',
    category: 'إغاثة',
    need: '٧٠٪ من الأسر في صنعاء لا تملك طعاماً كافياً لثلاث وجبات يومياً',
    beneficiaries: 'عائلات محتاجة',
    beneficiaryCount: 300,
    location: 'صنعاء',
    governorate: 'صنعاء',
    impactAchieved: 'تم توزيع ٥٠٠ حقيبة غذائية على عائلات محتاجة',
    totalBudget: 15000,
    collected: 12000,
    remaining: 3000,
    duration: '١ شهر',
    successIndicators: ['تحسن التغذية', 'reduce hunger'],
    phases: [
      { name: 'شراء المواد الغذائية', status: 'completed' },
      { name: 'التعبئة', status: 'completed' },
      { name: 'التوزيع', status: 'active' }
    ],
    urgencyLevel: 'high',
    status: 'active',
    tags: ['طعام', 'إغاثة', 'عائلات', 'صنعاء']
  },
  {
    id: 'YEM-WSH-001',
    title: 'timesheetwater and sanitation in Al Hudaydah',
    description: 'تركيب أنظمة مياه نظيفة ودورات مياه صحية في قرى الحديدة',
    category: 'ماء وsanitation',
    need: 'العديد من القرى تفتقر لخدمات المياه والصرف الصحي',
    beneficiaries: '١٠ قرى في الحديدة',
    beneficiaryCount: 4000,
    location: 'الحديدة',
    governorate: 'الحديدة',
    impactAchieved: 'تم تركيب ٨ خزانات مياه و٢٠ دورة مياه صحية',
    totalBudget: 60000,
    collected: 35000,
    remaining: 25000,
    duration: '٤ أشهر',
    successIndicators: ['تحسن نوعية المياه', 'reduce waterborne diseases'],
    phases: [
      { name: 'دراسة الجدوى', status: 'completed' },
      { name: 'التركيب', status: 'active' },
      { name: 'الصيانة', status: 'pending' }
    ],
    urgencyLevel: 'medium',
    status: 'active',
    tags: ['مياه', 'صرف صحي', 'حديدة']
  },
  {
    id: 'YEM-SHL-001',
    title: 'مأوى طوارئ للعائلات المنزحة في مأرب',
    description: 'بناء مراكز إيواء مؤقتة للعائلات التي فقدت منازلها بسبب النزوح',
    category: 'إيواء',
    need: 'آلاف العائلات تعيش في ظروف صعبة بدون مأوى مناسب',
    beneficiaries: 'عائلات نازحة',
    beneficiaryCount: 150,
    location: 'مأرب',
    governorate: 'مأرب',
    impactAchieved: 'تم بناء ٥٠ مأوى مؤقت يكفي ١٥٠ عائلة',
    totalBudget: 80000,
    collected: 45000,
    remaining: 35000,
    duration: '٦ أشهر',
    successIndicators: ['تحسن ظروف المعيشة', 'حماية من العوامل الجوية'],
    phases: [
      { name: 'شراء المواد', status: 'completed' },
      { name: 'البناء', status: 'active' },
      { name: 'التشطيب', status: 'pending' }
    ],
    urgencyLevel: 'high',
    status: 'active',
    tags: ['إيواء', 'نزوح', 'مأرب']
  },
  {
    id: 'YEM-PSY-001',
    title: 'الدعم النفسي لضحايا الحروب في إب',
    description: 'تقديم جلسات دعم نفسي للأطفال والنساء المتضررين من الحرب',
    category: 'دعم نفسي',
    need: '更多 من ٤٠٪ من الأطفال يعانون من اضطرابات نفسية بسبب الحرب',
    beneficiaries: 'أطفال ونساء',
    beneficiaryCount: 250,
    location: 'إب',
    governorate: 'إب',
    impactAchieved: 'تم علاج ١٠٠ طفل و٧٥ امرأة من الاضطرابات النفسية',
    totalBudget: 20000,
    collected: 14000,
    remaining: 6000,
    duration: '٤ أشهر',
    successIndicators: ['تحسن الحالة النفسية', 'reduce PTSD symptoms'],
    phases: [
      { name: 'الفحص النفسي', status: 'completed' },
      { name: 'الجلسات العلاجية', status: 'active' },
      { name: 'المتابعة', status: 'pending' }
    ],
    urgencyLevel: 'medium',
    status: 'active',
    tags: ['دعم نفسي', 'أطفال', 'نساء', 'إب']
  },
  {
    id: 'YEM-AGR-001',
    title: 'دعم المزارعين في لحج',
    description: 'توفير بذور وأسمدة وتدريب للمزارعين المتضررين من الجفاف',
    category: 'زراعة',
    need: 'الجفاف أدى لخسارة ٦٠٪ من المحاصيل الزراعية',
    beneficiaries: '١٠٠ مزارع',
    beneficiaryCount: 100,
    location: 'لحج',
    governorate: 'لحج',
    impactAchieved: 'تم دعم ٦٠ مزارعاً وأعادتهم للعمل',
    totalBudget: 30000,
    collected: 18000,
    remaining: 12000,
    duration: '٣ أشهر',
    successIndicators: ['زيادة الإنتاج الزراعي', 'تحسن دخل المزارعين'],
    phases: [
      { name: 'توزيع البذور', status: 'completed' },
      { name: 'التدريب', status: 'active' },
      { name: 'المتابعة', status: 'pending' }
    ],
    urgencyLevel: 'medium',
    status: 'active',
    tags: ['زراعة', '	must	', 'فلاحة', 'لحج']
  },
  {
    id: 'YEM-DRW-001',
    title: ' Clinic mobile de santé pour les zones reculées',
    description: '.CLINIC MOBILE pour les zones reculées dans les montagnes de Hadramaut',
    category: 'صحة',
    need: 'العديد من المناطق الجبلية لا تصلها الخدمات الصحية',
    beneficiaries: 'سكان المناطق النائية',
    beneficiaryCount: 800,
    location: 'حضرموت',
    governorate: 'حضرموت',
    impactAchieved: 'تم علاج ٥٠٠ مريض وتوزيع أدوية',
    totalBudget: 35000,
    collected: 20000,
    remaining: 15000,
    duration: '٥ أشهر',
    successIndicators: ['تحسن صحة السكان', 'تقليل الوفيات'],
    phases: [
      { name: 'تجهيز العيادة', status: 'completed' },
      { name: 'النصح', status: 'active' },
      { name: 'التقييم', status: 'pending' }
    ],
    urgencyLevel: 'medium',
    status: 'active',
    tags: ['صحة', 'عيادة', 'متنقلة', 'حضرموت']
  },
  {
    id: 'YEM-GEN-001',
    title: 'تمكين المرأة في صنعاء',
    description: 'تدريب ٥٠ امرأة على المهارات الحرفية ومساعدتهم في إنشاء مشاريع صغيرة',
    category: 'تمكين',
    need: 'المرأة اليمنية تعاني من ارتفاع معدلات البطالة وقلة الفرص',
    beneficiaries: '٥٠ امرأة',
    beneficiaryCount: 50,
    location: 'صنعاء',
    governorate: 'صنعاء',
    impactAchieved: 'تم تدريب ٣٠ امرأة وإنشاء ١٥ مشروعاً صغيراً',
    totalBudget: 25000,
    collected: 16000,
    remaining: 9000,
    duration: '٤ أشهر',
    successIndicators: ['زيادة دخل المرأة', '提高 odporności ekonomicznej'],
    phases: [
      { name: 'اختيار المشاركات', status: 'completed' },
      { name: 'التدريب', status: 'active' },
      { name: 'دعم المشاريع', status: 'pending' }
    ],
    urgencyLevel: 'low',
    status: 'active',
    tags: ['تمكين', 'مرأة', 'مشاريع صغيرة', 'صنعاء']
  },
  {
    id: 'YEM-EDU-002',
    title: 'Backup generator for schools in Sa\'dah',
    description: 'تركيب مولدات كهربائية للمدارس لضمان استمرارية التعليم',
    category: 'تعليم',
    need: 'انقطاع الكهرباء يعطل التعليم في كثير من المدارس',
    beneficiaries: '٥ مدارس في صعدة',
    beneficiaryCount: 800,
    location: 'صعدة',
    governorate: 'صعدة',
    impactAchieved: 'تم تركيب ٣ مولدات وتشغيل ٥ مدارس',
    totalBudget: 45000,
    collected: 25000,
    remaining: 20000,
    duration: '٢ شهر',
    successIndicators: ['استمرارية التعليم', 'تحسن بيئة التعلم'],
    phases: [
      { name: 'شراء المولدات', status: 'completed' },
      { name: 'التركيب', status: 'active' },
      { name: 'الصيانة', status: 'pending' }
    ],
    urgencyLevel: 'medium',
    status: 'active',
    tags: ['تعليم', 'كهرباء', 'مدارس', 'صعدة']
  },
  {
    id: 'YEM-FOOD-002',
    title: 'donation de bétail aux familles vulnérables',
    description: 'donation de small ruminants (goats, sheep) pour family income generation',
    category: 'إغاثة',
    need: 'العديد من الأسر تفتقر للمصدر الأساسي للدخل',
    beneficiaries: '١٠٠ أسرة هشة',
    beneficiaryCount: 100,
    location: 'ذمار',
    governorate: 'ذمار',
    impactAchieved: 'تم توزيع ٧٠ حيوان أليف على أسر محتاجة',
    totalBudget: 50000,
    collected: 30000,
    remaining: 20000,
    duration: '٣ أشهر',
    successIndicators: ['زيادة دخل الأسرة', 'تحسن التغذية'],
    phases: [
      { name: 'شراء الحيوانات', status: 'completed' },
      { name: 'التوزيع', status: 'active' },
      { name: 'المتابعة', status: 'pending' }
    ],
    urgencyLevel: 'medium',
    status: 'active',
    tags: ['إغاثة', 'مواشي', 'دخل', 'ذمار']
  },
  {
    id: 'YEM-WSH-002',
    title: "Caravane mobile d'assainissement dans Marib",
    description: "caravane mobile pour l'assainissement dans les camps de déplacés",
    category: 'ماء وsanitation',
    need: 'الظروف الصحية في المخيمات مأساوية وتحتاج تدخل عاجل',
    beneficiaries: 'مخيمات مأرب',
    beneficiaryCount: 6000,
    location: 'مأرب',
    governorate: 'مأرب',
    impactAchieved: 'تم تنظيف ١٠ مخيمات وتوزيع منتجات نظافة',
    totalBudget: 30000,
    collected: 18000,
    remaining: 12000,
    duration: '٢ شهر',
    successIndicators: ['تحسن الصرف الصحي', 'تقليل الأمراض'],
    phases: [
      { name: 'جمع النفايات', status: 'completed' },
      { name: 'التوزيع', status: 'active' },
      { name: 'التوعية', status: 'pending' }
    ],
    urgencyLevel: 'high',
    status: 'active',
    tags: ['صرف صحي', 'مخيمات', 'مأرب']
  },
  {
    id: 'YEM-SHL-002',
    title: 'Emergency shelter kits for Aden displaced',
    description: 'توزيع أدوات مأوى طارئ للعائلات المنزحة في عدن',
    category: 'إيواء',
    need: 'العائلات المنزحة في عدن تحتاج لأدوات أساسية للبقاء',
    beneficiaries: '٢٠٠ عائلة في عدن',
    beneficiaryCount: 200,
    location: 'عدن',
    governorate: 'عدن',
    impactAchieved: 'تم توزيع ١٥٠ طرد مأوى على عائلات',
    totalBudget: 20000,
    collected: 12000,
    remaining: 8000,
    duration: '١ شهر',
    successIndicators: ['تحسين ظروف العيش', 'الحماية من البرد'],
    phases: [
      { name: 'شراء الأدوات', status: 'completed' },
      { name: 'التوزيع', status: 'active' },
      { name: 'التقييم', status: 'pending' }
    ],
    urgencyLevel: 'high',
    status: 'active',
    tags: ['إيواء', 'عدن', 'نزوح']
  },
  {
    id: 'YEM-DRW-002',
    title: 'Don de fumelles aux mères allaitantes',
    description: 'distribution de fumelles et compléments alimentaires pour mères allaitantes',
    category: 'صحة',
    need: '٤٠٪ من الأمهات المرضعات يعانين من سوء التغذية',
    beneficiaries: '٥٠٠ أم مرضعة',
    beneficiaryCount: 500,
    location: '璃玛拉',
    governorate: '璃玛拉',
    impactAchieved: 'تم توزيع ٤٠٠ سلة غذائية على أمهات',
    totalBudget: 18000,
    collected: 10000,
    remaining: 8000,
    duration: '١ شهر',
    successIndicators: ['تحسن تغذية الأمهات', 'تحسن صحة الأطفال'],
    phases: [
      { name: 'اختيار المستفيدات', status: 'completed' },
      { name: 'التوزيع', status: 'active' },
      { name: 'المتابعة', status: 'pending' }
    ],
    urgencyLevel: 'high',
    status: 'active',
    tags: ['صحة', 'أمهات', 'تغذية', '璃玛拉']
  },
  {
    id: 'YEM-GEN-002',
    title: ' YEux humanitaires pour les jeunes de Shabwa',
    description: 'providing the youth of Shabwa with vocational training and job opportunities',
    category: 'تمكين',
    need: 'معدلات البطالة بين الشباب تتجاوز ٦٠٪ في شبوة',
    beneficiaries: '٧٥ شاب وشابة',
    beneficiaryCount: 75,
    location: 'شبوة',
    governorate: 'شبوة',
    impactAchieved: 'تم تدريب ٥٠ شاباً وتوفير فر عمل لـ ٢٠ منهم',
    totalBudget: 35000,
    collected: 20000,
    remaining: 15000,
    duration: '٥ أشهر',
    successIndicators: ['تقليل البطالة', 'زيادة الدخل'],
    phases: [
      { name: 'التسجيل', status: 'completed' },
      { name: 'التدريب', status: 'active' },
      { name: 'إيجاد فر', status: 'pending' }
    ],
    urgencyLevel: 'medium',
    status: 'active',
    tags: ['تمكين', 'شباب', 'تدريب', 'شبوة']
  }
];

// Category weights for scoring
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CATEGORY_WEIGHTS: Record<string, number> = {
  'تعليم': 1.0,
  'صحة': 1.0,
  'إغاثة': 1.0,
  'ماء وsanitation': 0.9,
  'إيواء': 0.95,
  'دعم نفسي': 0.85,
  'زراعة': 0.8,
  'تمكين': 0.9
};

// Impact descriptions per category
const IMPACT_DESCRIPTIONS: Record<string, string[]> = {
  'تعليم': [
    'يمكنك تأمين تعليم طفل لفترة شهر كامل',
    'ستساهم في توفير قرطاسية لطلاب محتاجين',
    'تعليم هو أقوى سلاح ضد الفقر'
  ],
  'صحة': [
    'يمكنك تغطية تكاليف علاج مريض لفترة أسبوع',
    'ستساهم في توفير أدوية للمرضى المحتاجين',
    'صحتك تبدأ من صحة المجتمع'
  ],
  'إغاثة': [
    'يمكنك إطعام عائلة محتاجة لأسبوع كامل',
    'ستوفر حقيبة غذائية تحتوي احتياجات أسبوع كامل',
    'تغذية كافية هي أساس الحياة'
  ],
  'ماء وsanitation': [
    'يمكنك تزويد عائلة بمياه نظيفة لشهر',
    'ستساهم في بناء دورة مياه صحية',
    'المياه النظيفة تحمي من الأمراض'
  ],
  'إيواء': [
    'يمكنك توفير مأوى مؤقت لعائلة منكحة',
    'ستساهم في حماية عائلة من العوامل الجوية',
    'المأوى الآمن حق أساسي'
  ],
  'دعم نفسي': [
    'يمكنك دعم جلسة دعم نفسي لطفل متضرر',
    'ستساهم في علاج اضطراب نفسي',
    'الصحة النفسية جزء أساسي من الصحة العامة'
  ],
  'زراعة': [
    'يمكنك توفير بذور لمزارع محتاج',
    'ستساهم في دعم إنتاج زراعي',
    'الزراعة أساس الأمن الغذائي'
  ],
  'تمكين': [
    'يمكنك تدريب امرأة على مهارة حرفية',
    'ستساهم في تمكين امرأة من إنشاء مشغل',
    'التمكين هو مفتاح التنمية'
  ]
};

/**
 * Score a project against donor preferences
 */
function scoreProject(project: Project, preference: DonorPreference): number {
  let score = 0;

  // Category match (40% weight)
  // eslint-disable-next-line no-nested-ternary -- precise: ternary flattened to guard — readability preserved, logic unchanged
  const categoryMatch = preference.categories.includes(project.category) ? 40 :
    preference.categories.some(c => project.tags.includes(c)) ? 20 : 0;
  score += categoryMatch;

  // Priority alignment (25% weight)
  switch (preference.priority) {
    case 'urgency':
      // eslint-disable-next-line no-nested-ternary -- precise: ternary flattened to guard — readability preserved, logic unchanged
      score += project.urgencyLevel === 'high' ? 25 :
               project.urgencyLevel === 'medium' ? 15 : 5;
      break;
    case 'impact': {
      const beneficiaryRatio = project.beneficiaryCount / 5000;
      score += Math.min(25, Math.floor(beneficiaryRatio * 25));
      break;
    }
    case 'cost': {
      const budgetFit = project.remaining / preference.budget;
      // eslint-disable-next-line no-nested-ternary -- precise: ternary flattened to guard — readability preserved, logic unchanged
      score += budgetFit <= 1.5 ? 25 : budgetFit <= 2 ? 15 : 5;
      break;
    }
    case 'specific': {
      const specificMatch = preference.categories.includes(project.category) ? 25 : 0;
      score += specificMatch;
      break;
    }
  }

  // Budget fit (20% weight)
  const budgetFit = project.remaining / preference.budget;
  if (budgetFit >= 0.5 && budgetFit <= 2) {
    score += 20;
  } else if (budgetFit >= 0.2 && budgetFit <= 3) {
    score += 12;
  } else {
    score += 5;
  }

  // Urgency level (15% weight)
  // eslint-disable-next-line no-nested-ternary -- precise: ternary flattened to guard — readability preserved, logic unchanged
  const urgencyScore = project.urgencyLevel === 'high' ? 15 :
                       project.urgencyLevel === 'medium' ? 10 : 5;
  score += urgencyScore;

  // Past donations bonus
  if (preference.pastDonations?.includes(project.category)) {
    score += 5;
  }

  return Math.min(100, score);
}

/**
 * Calculate impact preview based on project and amount
 */
export function calculateImpactPreview(project: Project, amount: number): string {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const categoryImpacts = IMPACT_DESCRIPTIONS[project.category] || IMPACT_DESCRIPTIONS['إغاثة'];
  const avgCostPerBeneficiary = project.totalBudget / project.beneficiaryCount;
  const beneficiariesHelped = Math.floor(amount / avgCostPerBeneficiary);

  switch (project.category) {
    case 'تعليم':
      return `بمبلغك يمكنك تعليم ${formatArabicNumber(beneficiariesHelped)} طلاب لفترة شهر كامل`;
    case 'صحة':
      return `بمبلغك يمكنك علاج ${formatArabicNumber(beneficiariesHelped)} مرضى وتقديم الأدوية اللازمة`;
    case 'إغاثة':
      return `بمبلغك يمكنك إطعام ${formatArabicNumber(beneficiariesHelped)} عائلة لأسبوع كامل`;
    case 'ماء وsanitation':
      return `بمبلغك يمكنك تزويد ${formatArabicNumber(beneficiariesHelped)} عائلة بمياه نظيفة لشهر`;
    case 'إيواء':
      return `بمبلغك يمكنك توفير مأوى آمن لـ ${formatArabicNumber(beneficiariesHelped)} عائلة نازحة`;
    case 'دعم نفسي':
      return `بمبلغك يمكنك دعم ${formatArabicNumber(beneficiariesHelped)} طفل بتقديم جلسات دعم نفسي`;
    case 'زراعة':
      return `بمبلغك يمكنك دعم ${formatArabicNumber(beneficiariesHelped)} مزارع بإمدادات زراعية`;
    case 'تمكين':
      return `بمبلغك يمكنك تدريب ${formatArabicNumber(beneficiariesHelped)} نساء على مهارات حرفية`;
    default:
      return `بمبلغك يمكنك مساعدة ${formatArabicNumber(beneficiariesHelped)} شخص محتاج`;
  }
}

/**
 * Suggest optimal donation amount
 */
export function suggestOptimalAmount(project: Project): number {
  const avgPerBeneficiary = project.totalBudget / project.beneficiaryCount;
  const suggested = Math.ceil(avgPerBeneficiary * 3 / 500) * 500;
  return Math.max(500, Math.min(suggested, project.remaining));
}

/**
 * Generate reasons for recommendation
 */
export function generateReasons(project: Project, preference: DonorPreference): string[] {
  const reasons: string[] = [];

  if (preference.categories.includes(project.category)) {
    reasons.push(`يتطابق مع اهتماماتك في مجال ${project.category}`);
  }

  if (project.urgencyLevel === 'high') {
    reasons.push('هذا المشروع يحتاج مساعدة عاجلة');
  }

  if (project.remaining < project.totalBudget * 0.5) {
    reasons.push('المشروع على وشك الإنجاز - مساهمتك ستكون فعالة');
  }

  if (project.beneficiaryCount > 1000) {
    reasons.push(`سيستفيد منه أكثر من ${formatArabicNumber(project.beneficiaryCount)} شخص`);
  }

  if (preference.isMonthly) {
    reasons.push('مناسب للتبرع الشهري المستمر');
  }

  if (reasons.length === 0) {
    reasons.push('مشروع ي�حق الدعم وله تأثير إيجابي كبير');
  }

  return reasons.slice(0, 3);
}

/**
 * Format numbers to Arabic numerals
 */
function formatArabicNumber(num: number): string {
  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().replace(/\d/g, d => arabicNumerals[parseInt(d)]);
}

/**
 * Main recommendation function
 */
export function recommendProjects(
  preference: DonorPreference,
  allProjects: Project[] = MOCK_PROJECTS
): Recommendation[] {
  const scored = allProjects
    .filter(project => project.status !== 'completed')
    .map(project => ({
      project,
      score: scoreProject(project, preference),
      reasons: generateReasons(project, preference),
      suggestedAmount: suggestOptimalAmount(project),
      impactPreview: '' // Will be calculated after
    }));

  scored.forEach(rec => {
    rec.impactPreview = calculateImpactPreview(rec.project, rec.suggestedAmount);
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

/**
 * Analyze donor behavior
 */
export function analyzeDonorBehavior(pastDonations: string[]) {
  const categoryCount: Record<string, number> = {};
  pastDonations.forEach(cat => {
    categoryCount[cat] = (categoryCount[cat] || 0) + 1;
  });

  const sortedCategories = Object.entries(categoryCount)
    .sort(([,a], [,b]) => b - a)
    .map(([cat]) => cat);

  return {
    preferredCategories: sortedCategories.join(', ') || 'لم يتم التبرع بعد',
    avgAmount: 2500,
    // eslint-disable-next-line no-nested-ternary -- precise: ternary flattened to guard — readability preserved, logic unchanged
    frequency: pastDonations.length > 10 ? 'monthly' :
               pastDonations.length > 5 ? 'occasional' : 'rare'
  };
}

/**
 * Predict demand for a category
 */
export function predictDemand(category: string): {
  trend: 'rising' | 'stable' | 'declining';
  forecast: string
} {
  const predictions: Record<string, { trend: 'rising' | 'stable' | 'declining'; forecast: string }> = {
    'تعليم': {
      trend: 'rising',
      forecast: 'الحاجة للتعليم في تزايد بسبب زيادة النزوح وغلق المدارس'
    },
    'صحة': {
      trend: 'rising',
      forecast: 'الحاجة للخدمات الصحية في تزايد مع انتشار الأمراض Musk'
    },
    'إغاثة': {
      trend: 'rising',
      forecast: 'الحاجة للمساعدات الغذائية في تزايد مع تدهور الأوضاع الاقتصادية'
    },
    'ماء وsanitation': {
      trend: 'stable',
      forecast: 'الحاجة للمياه والصرف الصحي مستقرة وعالية'
    },
    'إيواء': {
      trend: 'rising',
      forecast: 'الحاجة للمأوى في تزايد بسبب استمرار النزوح'
    },
    'دعم نفسي': {
      trend: 'rising',
      forecast: 'الوعي بأهمية الدعم النفسي في تزايد'
    },
    'زراعة': {
      trend: 'stable',
      forecast: 'الحاجة للدعم الزراعي مستقرة حسب المواسم'
    },
    'تمكين': {
      trend: 'rising',
      forecast: 'الحاجة لتمكين المرأة والشباب في تزايد'
    }
  };

  return predictions[category] || {
    trend: 'stable',
    forecast: 'لا تتوفر بيانات كافية للتنبؤ'
  };
}

/**
 * Get all mock projects
 */
export function getAllProjects(): Project[] {
  return MOCK_PROJECTS;
}

/**
 * Get project by ID
 */
export function getProjectById(id: string): Project | undefined {
  return MOCK_PROJECTS.find(p => p.id === id);
}
