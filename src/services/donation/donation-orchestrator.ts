import { donationDBService, type Donation } from './donation-db.service';
import { inKindService } from './inkind.service';
import { materialService } from './material.service';
import { offlineManager } from '../offline/offline-manager';
import type { DonationSubmission, DonationReceipt } from './donation-types';

class DonationOrchestrator {
  async processDonation(submission: DonationSubmission): Promise<DonationReceipt> {
    const { donation } = submission;
    
    // 1. Create master donation record
    const masterDonation = await donationDBService.createDonation({
      donor_name: submission.is_anonymous ? undefined : submission.donor_name,
      donor_email: submission.donor_email,
      donor_phone: submission.donor_phone,
      donation_type: donation.type,
      amount: donation.type === 'financial' ? donation.amount : 0,
      currency: donation.type === 'financial' ? donation.currency : 'YER',
      project_id: donation.project_id,
      payment_method: donation.type === 'financial' ? donation.payment_method : 'cash',
      payment_status: donation.type === 'financial' ? 'pending' : 'completed',
      message: submission.message,
      is_recurring: donation.type === 'financial' ? donation.is_recurring : false,
      recurring_interval: donation.type === 'financial' ? donation.recurring_interval : undefined,
      is_anonymous: submission.is_anonymous,
      metadata: submission.metadata,
    });

    // 2. Process type-specific data
    if (donation.type === 'in_kind') {
      await inKindService.submitInKindDonation(masterDonation.id, donation);
    } else if (donation.type === 'material') {
      await materialService.submitMaterialDonation(masterDonation.id, donation);
    }

    // 3. Queue for offline sync if needed
    if (!navigator.onLine) {
      await offlineManager.queueMutation('donations', 'create', masterDonation);
    }

    // 4. Generate receipt
    const receipt: DonationReceipt = {
      receipt_number: masterDonation.receipt_number,
      donation_id: masterDonation.id,
      amount: donation.type === 'financial' ? donation.amount : undefined,
      currency: donation.type === 'financial' ? donation.currency : undefined,
      items: donation.type !== 'financial' 
        ? (donation.items || []).map((item: any) => ({
            name: item.name,
            quantity: item.quantity,
            estimated_value: item.estimated_value,
          }))
        : undefined,
      date: new Date().toISOString(),
      project: donation.project_id,
    };

    return receipt;
  }

  async getDonorHistory(email: string): Promise<Donation[]> {
    return donationDBService.getDonorDonations(email);
  }

  async getDonationStats() {
    return donationDBService.getDonationStats();
  }
}

export const donationOrchestrator = new DonationOrchestrator();
