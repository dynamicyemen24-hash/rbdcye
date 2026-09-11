import {
  Plus, Edit, Trash2, ToggleLeft, ToggleRight,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  GripVertical, Eye, EyeOff, Star, StarOff,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Search, Filter, Loader2
} from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';

import { adminProjectService } from '@/services/donation/admin-project.service';

import type { DonationProject } from '@/services/donation/donation-types';

export function ProjectManager() {
  const [projects, setProjects] = useState<DonationProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [editingProject, setEditingProject] = useState<DonationProject | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showCreateForm, setShowCreateForm] = useState(false);

  const loadProjects = async () => {
    try {
      const data = await adminProjectService.getAllProjects();
      setProjects(data);
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await adminProjectService.toggleProjectActive(id, !currentStatus);
      setProjects(prev => prev.map(p =>
        p.id === id ? { ...p, is_active: !currentStatus } : p
      ));
    } catch (err) {
      console.error('Toggle failed:', err);
    }
  };

  const toggleFeatured = async (id: string, currentStatus: boolean) => {
    try {
      await adminProjectService.toggleProjectFeatured(id, !currentStatus);
      setProjects(prev => prev.map(p =>
        p.id === id ? { ...p, is_featured: !currentStatus } : p
      ));
    } catch (err) {
      console.error('Toggle featured failed:', err);
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المشروع؟')) return;
    try {
      await adminProjectService.deleteProject(id);
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title_ar.includes(searchQuery) || p.slug.includes(searchQuery);
    const matchesFilter = filterStatus === 'all' ||
      (filterStatus === 'active' && p.is_active) ||
      (filterStatus === 'inactive' && !p.is_active);
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--brand-green)]" />
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-[var(--foreground)]">إدارة المشاريع</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-[var(--brand-green)] px-4 py-2.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
        >
          <Plus className="h-4 w-4" />
          إضافة مشروع
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
          <input
            type="text"
            placeholder="بحث في المشاريع..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] py-2.5 pr-10 pl-4 text-sm"
          />
        </div>
        <select
          value={filterStatus}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-sm"
        >
          <option value="all">الكل</option>
          <option value="active">نشط</option>
          <option value="inactive">معطل</option>
        </select>
      </div>

      {/* Projects Table */}
      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--muted)]">
                <th className="px-4 py-3 text-right font-bold text-[var(--foreground)]">المشروع</th>
                <th className="px-4 py-3 text-right font-bold text-[var(--foreground)]">الفئة</th>
                <th className="px-4 py-3 text-right font-bold text-[var(--foreground)]">التقدم</th>
                <th className="px-4 py-3 text-center font-bold text-[var(--foreground)]">الحالة</th>
                <th className="px-4 py-3 text-center font-bold text-[var(--foreground)]">مميز</th>
                <th className="px-4 py-3 text-center font-bold text-[var(--foreground)]">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project) => (
                <motion.tr
                  key={project.id}
                  layout
                  className="border-b border-[var(--border)] last:border-0"
                >
                  <td className="px-4 py-3">
                    <div className="font-bold text-[var(--foreground)]">{project.title_ar}</div>
                    <div className="text-xs text-[var(--muted-foreground)]">{project.slug}</div>
                  </td>
                  <td className="px-4 py-3 text-[var(--muted-foreground)]">{project.category}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 overflow-hidden rounded-full bg-[var(--muted)]">
                        <div
                          className="h-full rounded-full bg-[var(--brand-green)]"
                          style={{
                            width: `${Math.min(100, (project.current_amount / project.target_amount) * 100)}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-[var(--muted-foreground)]">
                        {Math.round((project.current_amount / project.target_amount) * 100)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleActive(project.id, project.is_active)}
                      className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                        project.is_active
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                    >
                      {project.is_active ? (
                        <>
                          <ToggleRight className="h-4 w-4" />
                          نشط
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="h-4 w-4" />
                          معطل
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleFeatured(project.id, project.is_featured)}
                      className="p-1.5 transition-colors hover:bg-[var(--muted)]"
                      title={project.is_featured ? 'إلغاء التمييز' : 'تمييز'}
                    >
                      {project.is_featured ? (
                        <Star className="h-5 w-5 text-[var(--brand-gold)]" fill="var(--brand-gold)" />
                      ) : (
                        <StarOff className="h-5 w-5 text-[var(--muted-foreground)]" />
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => setEditingProject(project)}
                        className="p-1.5 rounded-lg transition-colors hover:bg-[var(--muted)]"
                        title="تعديل"
                      >
                        <Edit className="h-4 w-4 text-[var(--muted-foreground)]" />
                      </button>
                      <button
                        onClick={() => deleteProject(project.id)}
                        className="p-1.5 rounded-lg transition-colors hover:bg-red-100"
                        title="حذف"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProjects.length === 0 && (
          <div className="py-12 text-center text-[var(--muted-foreground)]">
            لا توجد مشاريع
          </div>
        )}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 text-center">
          <div className="text-2xl font-bold text-[var(--brand-green)]">{projects.length}</div>
          <div className="text-xs text-[var(--muted-foreground)]">إجمالي المشاريع</div>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {projects.filter(p => p.is_active).length}
          </div>
          <div className="text-xs text-[var(--muted-foreground)]">مشاريع نشطة</div>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 text-center">
          <div className="text-2xl font-bold text-red-500">
            {projects.filter(p => !p.is_active).length}
          </div>
          <div className="text-xs text-[var(--muted-foreground)]">مشاريع معطلة</div>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 text-center">
          <div className="text-2xl font-bold text-[var(--brand-gold)]">
            {projects.filter(p => p.is_featured).length}
          </div>
          <div className="text-xs text-[var(--muted-foreground)]">مشاريع مميزة</div>
        </div>
      </div>
    </div>
  );
}
