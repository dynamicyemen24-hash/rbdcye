import {
  donationsDashboardService,
  requestsDashboardService,
  volunteersDashboardService,
} from './dashboard.service';
import { dataService } from './data.service';

type IntakeSource = 'contact' | 'donation' | 'volunteer';

type SubscriberAccount = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  source: IntakeSource;
  status: 'pending' | 'active';
  lastRequestId?: string | number;
  createdAt: string;
  updatedAt: string;
};

const buildId = (prefix: string) => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const upsertSubscriber = async (payload: {
  name: string;
  email: string;
  phone?: string;
  source: IntakeSource;
  requestId?: string | number;
}) => {
  if (!payload.email) return null;
  const accounts = await dataService.getAll<SubscriberAccount>('rh_subscriber_accounts');
  const existing = accounts.find((account) => account.email.toLowerCase() === payload.email.toLowerCase());

  if (existing) {
    return dataService.update<SubscriberAccount>('rh_subscriber_accounts', existing.id, {
      name: payload.name || existing.name,
      phone: payload.phone || existing.phone,
      source: payload.source,
      status: 'active',
      lastRequestId: payload.requestId,
    });
  }

  return dataService.create<SubscriberAccount>('rh_subscriber_accounts', {
    id: buildId('sub'),
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    source: payload.source,
    status: 'pending',
    lastRequestId: payload.requestId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
};

export const intakeService = {
  async submitContact(form: { name: string; email: string; phone?: string; subject: string; type?: string; message: string }) {
    const request = await requestsDashboardService.create({
      id: buildId('req'),
      ...form,
      source: 'website',
      channel: 'contact',
      status: 'new',
      date: new Date().toISOString(),
    });
    await upsertSubscriber({ name: form.name, email: form.email, phone: form.phone, source: 'contact', requestId: request.id });
    return request;
  },

  async submitDonation(form: {
    donor: string;
    email: string;
    phone?: string;
    amount: number;
    project: string;
    method: string;
    type: string;
  }) {
    const donation = await donationsDashboardService.create({
      id: buildId('don'),
      ...form,
      source: 'website',
      status: 'pending',
      date: new Date().toISOString(),
    });
    await requestsDashboardService.create({
      id: buildId('req'),
      name: form.donor,
      email: form.email,
      phone: form.phone,
      type: 'donation',
      subject: `طلب متابعة تبرع - ${form.project}`,
      message: `تبرع ${form.type} بمبلغ ${form.amount} عبر ${form.method}.`,
      source: 'website',
      channel: 'donation',
      relatedEntity: 'donation',
      relatedId: donation.id,
      status: 'new',
      date: new Date().toISOString(),
    });
    await upsertSubscriber({ name: form.donor, email: form.email, phone: form.phone, source: 'donation', requestId: donation.id });
    return donation;
  },

  async submitVolunteer(form: { name: string; email: string; phone: string; field?: string; motivation?: string }) {
    const volunteer = await volunteersDashboardService.create({
      id: buildId('vol'),
      ...form,
      source: 'website',
      status: 'pending',
      hours: 0,
      date: new Date().toISOString(),
    });
    await requestsDashboardService.create({
      id: buildId('req'),
      name: form.name,
      email: form.email,
      phone: form.phone,
      type: 'volunteer',
      subject: `طلب تطوع - ${form.field || 'عام'}`,
      message: form.motivation || 'طلب تطوع من نموذج الموقع.',
      source: 'website',
      channel: 'volunteer',
      relatedEntity: 'volunteer',
      relatedId: volunteer.id,
      status: 'new',
      date: new Date().toISOString(),
    });
    await upsertSubscriber({ name: form.name, email: form.email, phone: form.phone, source: 'volunteer', requestId: volunteer.id });
    return volunteer;
  },
};


