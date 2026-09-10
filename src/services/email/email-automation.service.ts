import { supabase } from '@/lib/supabase';

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  html: string;
  variables: string[];
}

export interface EmailSequence {
  id: string;
  name: string;
  trigger: string;
  steps: EmailStep[];
}

export interface EmailStep {
  delay_days: number;
  template_id: string;
  condition?: string;
}

// Pre-built email templates
export const EMAIL_TEMPLATES: Record<string, EmailTemplate> = {
  welcome: {
    id: 'welcome',
    name: 'رسالة ترحيب',
    subject: 'مرحباً {{name}} — شكراً لانضمامك لحملة رحماء بينهم',
    html: `
      <div dir="rtl" style="font-family: 'Cairo', sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #059669, #047857); padding: 40px; text-align: center; border-radius: 20px 20px 0 0;">
          <h1 style="color: white; margin: 0;">رحماء بينهم</h1>
          <p style="color: rgba(255,255,255,0.8); margin-top: 8px;">حملة إغاثية وتنموية</p>
        </div>
        <div style="padding: 40px; background: #f8f5ec;">
          <h2 style="color: #059669;">مرحباً {{name}}،</h2>
          <p>يسعدنا انضمامك إلى عائلة رحماء بينهم. معًا نصنع أثراً يدوم في حياة الآلاف.</p>
          <p>من خلال حسابك، يمكنك:</p>
          <ul>
            <li>تبرعات مالية وعينية ومادية</li>
            <li>تتبع أثر تبرعك</li>
            <li>الاطلاع على التقارير الدورية</li>
            <li>التطوع في مشاريعنا</li>
          </ul>
          <a href="https://rbdcye.org/donate" style="display: inline-block; background: #d97706; color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; margin-top: 20px;">ابدأ بالتبرع</a>
        </div>
        <div style="padding: 20px; text-align: center; color: #666; font-size: 12px;">
          <p>حملة رحماء بينهم — صنعاء، اليمن</p>
          <p>هاتف: +967 780 777 007</p>
        </div>
      </div>
    `,
    variables: ['name'],
  },
  
  donation_confirmation: {
    id: 'donation_confirmation',
    name: 'تأكيد التبرع',
    subject: 'إيصال تبرعك — {{amount}} {{currency}}',
    html: `
      <div dir="rtl" style="font-family: 'Cairo', sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #059669, #047857); padding: 40px; text-align: center; border-radius: 20px 20px 0 0;">
          <h1 style="color: white; margin: 0;">شكراً لك</h1>
          <p style="color: rgba(255,255,255,0.8); margin-top: 8px;">تم استلام تبرعك بنجاح</p>
        </div>
        <div style="padding: 40px; background: #f8f5ec;">
          <div style="background: white; border-radius: 16px; padding: 24px; text-align: center; border: 2px solid #059669;">
            <p style="color: #666; margin: 0;">مبلغ التبرع</p>
            <h2 style="color: #059669; font-size: 32px; margin: 8px 0;">{{amount}} {{currency}}</h2>
            <p style="color: #666; margin: 0;">رقم الإيصال: {{receipt_number}}</p>
            <p style="color: #666; margin: 8px 0 0;">التاريخ: {{date}}</p>
          </div>
          <p style="margin-top: 24px;">تبرعك سيُستخدم مباشرة في {{project}} لمساعدة {{beneficiaries}} مستفيد.</p>
          <a href="https://rbdcye.org/donor" style="display: inline-block; background: #d97706; color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; margin-top: 20px;">تتبع أثر تبرعك</a>
        </div>
      </div>
    `,
    variables: ['name', 'amount', 'currency', 'receipt_number', 'date', 'project', 'beneficiaries'],
  },
  
  impact_update: {
    id: 'impact_update',
    name: 'تحديث الأثر',
    subject: 'تقرير أثر تبرعك — {{month}}',
    html: `
      <div dir="rtl" style="font-family: 'Cairo', sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #059669, #047857); padding: 40px; text-align: center; border-radius: 20px 20px 0 0;">
          <h1 style="color: white; margin: 0;">تقرير الأثر</h1>
          <p style="color: rgba(255,255,255,0.8); margin-top: 8px;">{{month}}</p>
        </div>
        <div style="padding: 40px; background: #f8f5ec;">
          <h2 style="color: #059669;">مرحباً {{name}}،</h2>
          <p>إليك ملخص أثر تبرعك هذا الشهر:</p>
          <div style="display: flex; gap: 16px; margin: 20px 0;">
            <div style="flex: 1; background: white; border-radius: 12px; padding: 16px; text-align: center;">
              <p style="color: #059669; font-size: 24px; font-weight: bold;">{{families_fed}}</p>
              <p style="color: #666; font-size: 12px;">أسرة تم إطعامها</p>
            </div>
            <div style="flex: 1; background: white; border-radius: 12px; padding: 16px; text-align: center;">
              <p style="color: #d97706; font-size: 24px; font-weight: bold;">{{childreneducated}}</p>
              <p style="color: #666; font-size: 12px;">طالب تلقى تعليم</p>
            </div>
          </div>
          <p>转账ك الفعلية تُحدث فرقاً حقيقياً. شكراً لثقتك بنا.</p>
          <a href="https://rbdcye.org/transparency" style="display: inline-block; background: #059669; color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: bold;">عرض التقرير الكامل</a>
        </div>
      </div>
    `,
    variables: ['name', 'month', 'families_fed', 'children_educated'],
  },

  re_engagement: {
    id: 're_engagement',
    name: 'إعادة التفاعل',
    subject: 'اشتقنا لك — هل تذكرت رحماء بينهم؟',
    html: `
      <div dir="rtl" style="font-family: 'Cairo', sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #d97706, #b45309); padding: 40px; text-align: center; border-radius: 20px 20px 0 0;">
          <h1 style="color: white; margin: 0;">اشتقنا لك</h1>
        </div>
        <div style="padding: 40px; background: #f8f5ec;">
          <h2 style="color: #059669;">مرحباً {{name}}،</h2>
          <p>لم نرك منذ فترة. ن希望 أن تكون بخير.</p>
          <p>لم ت暂停 أثر تبرعاتك — لا يزال المستفيدون ينتظرون مساعدتك.</p>
          <div style="background: white; border-radius: 12px; padding: 20px; margin: 20px 0;">
            <p style="color: #059669; font-weight: bold;">آخر تحديث:</p>
            <p>ulse ٢٠٠ أسرة حصلت على سلال غذائية هذا الشهر.</p>
          </div>
          <a href="https://rbdcye.org/donate" style="display: inline-block; background: #d97706; color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: bold;">تابع التبرع</a>
        </div>
      </div>
    `,
    variables: ['name'],
  },
};

// Email sequences
export const EMAIL_SEQUENCES: Record<string, EmailSequence> = {
  donor_nurture: {
    id: 'donor_nurture',
    name: 'تربية المتبرع',
    trigger: 'donation_completed',
    steps: [
      { delay_days: 0, template_id: 'donation_confirmation' },
      { delay_days: 7, template_id: 'impact_update' },
      { delay_days: 30, template_id: 'impact_update' },
      { delay_days: 60, template_id: 're_engagement' },
    ],
  },
  welcome_series: {
    id: 'welcome_series',
    name: 'سلسلة الترحيب',
    trigger: 'user_registered',
    steps: [
      { delay_days: 0, template_id: 'welcome' },
      { delay_days: 3, template_id: 'impact_update' },
      { delay_days: 7, template_id: 're_engagement' },
    ],
  },
};

class EmailAutomationService {
  async sendEmail(to: string, templateId: string, variables: Record<string, string>): Promise<boolean> {
    const template = EMAIL_TEMPLATES[templateId];
    if (!template) return false;

    let subject = template.subject;
    let html = template.html;
    
    for (const [key, value] of Object.entries(variables)) {
      subject = subject.replace(new RegExp(`{{${key}}}`, 'g'), value);
      html = html.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }

    // Save to email queue
    try {
      const { supabase } = await import('@/lib/supabase');
      if (!supabase) return false;
      
      await supabase.from('email_queue').insert({
        to_email: to,
        subject,
        html,
        template_id: templateId,
        status: 'queued',
        created_at: new Date().toISOString(),
      });
      return true;
    } catch (err) {
      console.error('[Email] Queue failed:', err);
      return false;
    }
  }

  async triggerSequence(email: string, sequenceId: string, baseVariables: Record<string, string>): Promise<void> {
    const sequence = EMAIL_SEQUENCES[sequenceId];
    if (!sequence) return;

    for (const step of sequence.steps) {
      const scheduledAt = new Date();
      scheduledAt.setDate(scheduledAt.getDate() + step.delay_days);

      const { supabase } = await import('@/lib/supabase');
      if (!supabase) continue;

      await supabase.from('email_schedule').insert({
        to_email: email,
        template_id: step.template_id,
        variables: baseVariables,
        scheduled_at: scheduledAt.toISOString(),
        status: 'scheduled',
      });
    }
  }

  async sendDonationConfirmation(email: string, name: string, amount: number, currency: string, receiptNumber: string, project: string): Promise<void> {
    await this.sendEmail(email, 'donation_confirmation', {
      name,
      amount: amount.toLocaleString('ar-YE'),
      currency,
      receipt_number: receiptNumber,
      date: new Date().toLocaleDateString('ar-YE'),
      project,
      beneficiaries: Math.floor(amount / 5000).toString(),
    });

    // Start nurture sequence
    await this.triggerSequence(email, 'donor_nurture', { name });
  }
}

export const emailAutomationService = new EmailAutomationService();
