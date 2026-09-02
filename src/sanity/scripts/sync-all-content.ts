/**
 * Sync Content from Static to Sanity
 * Converts SEED_* data from website.ts to Sanity documents with real image uploads
 * Run: pnpm tsx src/sanity/scripts/sync-all-content.ts
 */

import { createClient } from '@sanity/client';

import { 
  SEED_NEWS_ITEMS, 
  SEED_SUCCESS_STORIES, 
  SEED_PARTNERS, 
  SEED_PROJECTS, 
  SEED_IMPACT, 
  SEED_REPORTS, 
  SEED_MEDIA, 
  SEED_DONATIONS, 
  SEED_VOLUNTEERS 
} from '@/content/website';

import { sanityClient } from '../client';

interface SyncResult {
  type: string;
  success: boolean;
  created: number;
  skipped: number;
  errors: string[];
}

// Asset client for image uploads
const assetClient = createClient({
  projectId: sanityClient.config().projectId,
  dataset: sanityClient.config().dataset,
  apiVersion: sanityClient.config().apiVersion,
  token: sanityClient.config().token,
  useCdn: false,
});

class ContentSync {
  private results: SyncResult[] = [];
  private uploadedImages = new Map<string, string>(); // Cache for uploaded images

  async syncAll(): Promise<void> {
    console.log('🚀 بدء مزامنة المحتوى إلى Sanity...\n');
    
    await this.syncNews();
    await this.syncSuccessStories();
    await this.syncPartners();
    await this.syncProjects();
    await this.syncImpact();
    await this.syncReports();
    await this.syncMedia();
    await this.syncDonations();
    await this.syncVolunteers();

    this.printSummary();
  }

  /**
   * Download image from URL and upload to Sanity
   */
  private async uploadImage(imageUrl: string, altText: string, docId?: string): Promise<string> {
    if (!imageUrl) {
      return 'placeholder-image-id';
    }

    // Check cache first
    if (this.uploadedImages.has(imageUrl)) {
      return this.uploadedImages.get(imageUrl)!;
    }

    try {
      console.log(`  📸 رفع الصورة: ${imageUrl.substring(0, 60)}...`);
      
      // Download image
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to download image: ${response.status}`);
      }
      
      const imageBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(imageBuffer);
      
      // Get filename from URL or use default
      const urlPath = new URL(imageUrl).pathname;
      const filename = docId ? `${docId}-${Date.now()}.jpg` : `image-${Date.now()}.jpg`;
      
      // Upload to Sanity
      const asset = await assetClient.assets.upload('image', buffer, {
        filename,
      });
      
      // Cache the uploaded image reference
      const imageRef = asset._id;
      this.uploadedImages.set(imageUrl, imageRef);
      
      console.log(`    ✅ تم رفع الصورة: ${asset._id}`);
      return imageRef;
    } catch {
      // Failed to upload image, return placeholder
      // Return a placeholder or use original URL as reference
      return `placeholder-for-${docId || Date.now()}`;
    }
  }

  private async syncNews(): Promise<void> {
    const result: SyncResult = { type: 'News', success: false, created: 0, skipped: 0, errors: [] };
    
    try {
      for (const item of SEED_NEWS_ITEMS) {
        try {
          const existing = await sanityClient.fetch(`*[_type == "news" && _id == "${item.id}"][0]`);
          
          if (existing) {
            result.skipped++;
            continue;
          }

          const imageRef = await this.uploadImage(item.image, item.title, `news-${item.id}`);

          await sanityClient.create({
            _type: 'news',
            _id: item.id,
            title: item.title,
            slug: {
              _type: 'slug',
              current: item.id
            },
            excerpt: item.excerpt,
            content: [
              {
                _type: 'block',
                children: [
                  {
                    _type: 'span',
                    text: item.content
                  }
                ]
              }
            ],
            category: item.category,
            status: item.status || 'PUBLISHED',
            publishDate: item.dateEn || new Date().toISOString(),
            tags: item.tags || [],
            views: item.views || 0,
            featured: item.featured || false,
            mainImage: {
              _type: 'image',
              asset: {
                _type: 'reference',
                _ref: imageRef
              }
            }
          });

          result.created++;
          console.log(`  ✅ تم إنشاء خبر: ${item.title.substring(0, 50)}...`);
        } catch (error) {
          result.errors.push(`فشل إنشاء الخبر ${item.id}: ${error}`);
        }
      }
      
      result.success = true;
    } catch (error) {
      result.errors.push(`خطأ عام: ${error}`);
    } finally {
      this.results.push(result);
    }
  }

  private async syncSuccessStories(): Promise<void> {
    const result: SyncResult = { type: 'Success Stories', success: false, created: 0, skipped: 0, errors: [] };
    
    try {
      for (const item of SEED_SUCCESS_STORIES) {
        try {
          const existing = await sanityClient.fetch(`*[_type == "successStory" && _id == "${item.id}"][0]`);
          
          if (existing) {
            result.skipped++;
            continue;
          }

          const imageRef = await this.uploadImage(item.image, item.title, `story-${item.id}`);

          await sanityClient.create({
            _type: 'successStory',
            _id: item.id,
            title: item.title,
            slug: {
              _type: 'slug',
              current: item.id
            },
            name: item.name,
            program: item.program,
            quote: item.quote,
            content: [
              {
                _type: 'block',
                children: [
                  {
                    _type: 'span',
                    text: item.excerpt
                  }
                ]
              }
            ],
            status: item.status || 'published',
            featured: false,
            mainImage: {
              _type: 'image',
              asset: {
                _type: 'reference',
                _ref: imageRef
              }
            }
          });

          result.created++;
          console.log(`  ✅ تم إنشاء قصة نجاح: ${item.title.substring(0, 50)}...`);
        } catch (error) {
          result.errors.push(`فشل إنشاء القصة ${item.id}: ${error}`);
        }
      }
      
      result.success = true;
    } catch (error) {
      result.errors.push(`خطأ عام: ${error}`);
    } finally {
      this.results.push(result);
    }
  }

  private async syncPartners(): Promise<void> {
    const result: SyncResult = { type: 'Partners', success: false, created: 0, skipped: 0, errors: [] };
    
    try {
      for (const item of SEED_PARTNERS) {
        try {
          const existing = await sanityClient.fetch(`*[_type == "partner" && _id == "${item.id}"][0]`);
          
          if (existing) {
            result.skipped++;
            continue;
          }

          const imageRef = item.logo ? await this.uploadImage(item.logo, item.name, `partner-${item.id}`) : undefined;

          await sanityClient.create({
            _type: 'partner',
            _id: item.id,
            name: item.name,
            slug: {
              _type: 'slug',
              current: item.id
            },
            type: this.mapPartnerType(item.type),
            description: '',
            status: item.status || 'active',
            website: item.url || '',
            ...(imageRef ? {
              logo: {
                _type: 'image',
                asset: {
                  _type: 'reference',
                  _ref: imageRef
                }
              }
            } : {})
          });

          result.created++;
          console.log(`  ✅ تم إنشاء شريك: ${item.name}`);
        } catch (error) {
          result.errors.push(`فشل إنشاء الشريك ${item.id}: ${error}`);
        }
      }
      
      result.success = true;
    } catch (error) {
      result.errors.push(`خطأ عام: ${error}`);
    } finally {
      this.results.push(result);
    }
  }

  private async syncProjects(): Promise<void> {
    const result: SyncResult = { type: 'Projects', success: false, created: 0, skipped: 0, errors: [] };
    
    try {
      for (const item of SEED_PROJECTS) {
        try {
          const existing = await sanityClient.fetch(`*[_type == "project" && _id == "${item.id}"][0]`);
          
          if (existing) {
            result.skipped++;
            continue;
          }

          const imageRef = await this.uploadImage((item as any).image, item.title, `project-${item.id}`);

          await sanityClient.create({
            _type: 'project',
            _id: String(item.id),
            title: item.title,
            slug: {
              _type: 'slug',
              current: String(item.id)
            },
            description: item.description,
            category: this.mapProjectCategory(item.category),
            status: this.mapProjectStatus(item.status),
            progress: item.progress || 0,
            budget: 0,
            beneficiaries: parseInt(item.beneficiaries) || 0,
            location: item.location || '',
            mainImage: {
              _type: 'image',
              asset: {
                _type: 'reference',
                _ref: imageRef
              }
            }
          });

          result.created++;
          console.log(`  ✅ تم إنشاء مشروع: ${item.title.substring(0, 50)}...`);
        } catch (error) {
          result.errors.push(`فشل إنشاء المشروع ${item.id}: ${error}`);
        }
      }
      
      result.success = true;
    } catch (error) {
      result.errors.push(`خطأ عام: ${error}`);
    } finally {
      this.results.push(result);
    }
  }

  private async syncImpact(): Promise<void> {
    const result: SyncResult = { type: 'Impact Stats', success: false, created: 0, skipped: 0, errors: [] };
    
    try {
      const existing = await sanityClient.fetch(`*[_type == "siteSettings"][0]`);
      
      if (existing) {
        result.skipped++;
      } else {
        await sanityClient.create({
          _type: 'siteSettings',
          siteName: 'رحماء بينهم',
          description: 'مؤسسة رحماء بينهم الخيرية',
          contactInfo: {
            phone: '',
            email: 'info@rahmaparabnahum.org'
          },
          seo: {
            metaTitle: 'رحماء بينهم',
            metaDescription: 'مؤسسة إنسانية تنموية رائدة في اليمن'
          }
        });
        result.created++;
        console.log('  ✅ تم إنشاء إعدادات الموقع');
      }
      
      result.success = true;
    } catch (error) {
      result.errors.push(`خطأ عام: ${error}`);
    } finally {
      this.results.push(result);
    }
  }

  private async syncReports(): Promise<void> {
    const result: SyncResult = { type: 'Reports', success: false, created: 0, skipped: 0, errors: [] };
    
    try {
      for (const item of SEED_REPORTS) {
        try {
          const existing = await sanityClient.fetch(`*[_type == "report" && _id == "${item.id}"][0]`);
          
          if (existing) {
            result.skipped++;
            continue;
          }

          await sanityClient.create({
            _type: 'report',
            _id: item.id,
            title: item.title,
            type: this.mapReportType(item.type),
            status: item.status || 'draft',
            date: item.date || new Date().toISOString()
          });

          result.created++;
          console.log(`  ✅ تم إنشاء تقرير: ${item.title}`);
        } catch (error) {
          result.errors.push(`فشل إنشاء التقرير ${item.id}: ${error}`);
        }
      }
      
      result.success = true;
    } catch (error) {
      result.errors.push(`خطأ عام: ${error}`);
    } finally {
      this.results.push(result);
    }
  }

  private async syncMedia(): Promise<void> {
    const result: SyncResult = { type: 'Media', success: false, created: 0, skipped: 0, errors: [] };
    
    try {
      for (const item of SEED_MEDIA) {
        try {
          const existing = await sanityClient.fetch(`*[_type == "media" && _id == "${item.id}"][0]`);
          
          if (existing) {
            result.skipped++;
            continue;
          }

          // Upload media file
          const imageRef = await this.uploadImage(item.url, item.title, `media-${item.id}`);

          await sanityClient.create({
            _type: 'media',
            _id: item.id,
            title: item.title,
            type: item.type || 'image',
            url: item.url,
            date: item.date || new Date().toISOString(),
            file: {
              _type: 'file',
              asset: {
                _type: 'reference',
                _ref: imageRef
              }
            }
          });

          result.created++;
          console.log(`  ✅ تم إنشاء وسائط: ${item.title}`);
        } catch (error) {
          result.errors.push(`فشل إنشاء الوسائط ${item.id}: ${error}`);
        }
      }
      
      result.success = true;
    } catch (error) {
      result.errors.push(`خطأ عام: ${error}`);
    } finally {
      this.results.push(result);
    }
  }

  private async syncDonations(): Promise<void> {
    const result: SyncResult = { type: 'Donations', success: false, created: 0, skipped: 0, errors: [] };
    
    try {
      for (const item of SEED_DONATIONS) {
        try {
          const existing = await sanityClient.fetch(`*[_type == "donation" && _id == "${item.id}"][0]`);
          
          if (existing) {
            result.skipped++;
            continue;
          }

          await sanityClient.create({
            _type: 'donation',
            _id: item.id,
            donor: item.donor,
            amount: item.amount,
            currency: 'YER',
            method: this.mapDonationMethod(item.method),
            type: 'once',
            status: this.mapDonationStatus(item.status),
            date: item.date || new Date().toISOString()
          });

          result.created++;
          console.log(`  ✅ تم إنشاء تبرع: ${item.donor}`);
        } catch (error) {
          result.errors.push(`فشل إنشاء التبرع ${item.id}: ${error}`);
        }
      }
      
      result.success = true;
    } catch (error) {
      result.errors.push(`خطأ عام: ${error}`);
    } finally {
      this.results.push(result);
    }
  }

  private async syncVolunteers(): Promise<void> {
    const result: SyncResult = { type: 'Volunteers', success: false, created: 0, skipped: 0, errors: [] };
    
    try {
      for (const item of SEED_VOLUNTEERS) {
        try {
          const existing = await sanityClient.fetch(`*[_type == "volunteer" && _id == "${item.id}"][0]`);
          
          if (existing) {
            result.skipped++;
            continue;
          }

          await sanityClient.create({
            _type: 'volunteer',
            _id: item.id,
            name: item.name,
            email: item.email,
            phone: item.phone,
            field: this.mapVolunteerField(item.field),
            status: item.status || 'inactive',
            hours: item.hours || 0
          });

          result.created++;
          console.log(`  ✅ تم إنشاء متطوع: ${item.name}`);
        } catch (error) {
          result.errors.push(`فشل إنشاء المتطوع ${item.id}: ${error}`);
        }
      }
      
      result.success = true;
    } catch (error) {
      result.errors.push(`خطأ عام: ${error}`);
    } finally {
      this.results.push(result);
    }
  }

  private mapPartnerType(type: string): string {
    const typeMap: Record<string, string> = {
      'شريك إستراتيجي': 'منظمة غير حكومية',
      'جهة ممولة': 'حكومي',
      'شريك تنفيذي': 'خاص',
      'شريك داعم': 'منظمة غير حكومية'
    };
    return typeMap[type] || 'خاص';
  }

  private mapProjectCategory(category: string): string {
    const categoryMap: Record<string, string> = {
      'إغاثة': 'إغاثة',
      'تعليم': 'تعليم',
      'تنمية': 'تنمية',
      'بنية تحتية': 'تنمية',
      'دعوي': 'تنمية'
    };
    return categoryMap[category] || 'عام';
  }

  private mapProjectStatus(status: string): string {
    const statusMap: Record<string, string> = {
      'active': 'active',
      'completed': 'completed',
      'pending': 'pending'
    };
    return statusMap[status] || 'pending';
  }

  private mapReportType(type: string): string {
    const typeMap: Record<string, string> = {
      'تقرير سنوي': 'سنوي',
      'نشرة دورية': 'مشروع',
      'تقرير مالي': 'مالي',
      'دراسة': 'مشروع'
    };
    return typeMap[type] || 'مشروع';
  }

  private mapDonationMethod(method: string): string {
    const methodMap: Record<string, string> = {
      'card': 'card',
      'transfer': 'bank',
      'mobile': 'cash',
      'cash': 'cash'
    };
    return methodMap[method] || 'card';
  }

  private mapDonationStatus(status: string): string {
    const statusMap: Record<string, string> = {
      'completed': 'completed',
      'pending': 'pending',
      'failed': 'failed',
      'refunded': 'refunded'
    };
    return statusMap[status] || 'pending';
  }

  private mapVolunteerField(field: string): string {
    const fieldMap: Record<string, string> = {
      'تعليمي': 'تعليم',
      'صحي': 'صحة',
      'إداري': 'إدارة',
      'إعلامي': 'تسويق'
    };
    return fieldMap[field] || 'إدارة';
  }

  private printSummary(): void {
    console.log('\n' + '='.repeat(60));
    console.log('📊 ملخص المزامنة');
    console.log('='.repeat(60));
    
    let totalCreated = 0;
    let totalSkipped = 0;
    let totalErrors = 0;

    this.results.forEach(result => {
      console.log(`\n${result.type}:`);
      console.log(`  الحالة: ${result.success ? '✅ نجح' : '❌ فشل'}`);
      console.log(`  تم إنشاؤه: ${result.created}`);
      console.log(`  تم تخطيه: ${result.skipped}`);
      console.log(`  الأخطاء: ${result.errors.length}`);
      
      if (result.errors.length > 0) {
        result.errors.forEach(error => console.log(`    - ${error}`));
      }

      totalCreated += result.created;
      totalSkipped += result.skipped;
      totalErrors += result.errors.length;
    });

    console.log('\n' + '='.repeat(60));
    console.log(`إجمالي ما تم إنشاؤه: ${totalCreated}`);
    console.log(`إجمالي ما تم تخطيه: ${totalSkipped}`);
    console.log(`إجمالي الأخطاء: ${totalErrors}`);
    console.log('='.repeat(60) + '\n');
  }
}

// Run sync
const sync = new ContentSync();
sync.syncAll()
  .then(() => {
    console.log('✅ تمت المزامنة بنجاح');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ فشلت المزامنة:', error);
    process.exit(1);
  });

