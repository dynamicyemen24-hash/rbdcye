// Admin App - لوحة التحكم الموحدة
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import AdminLayout from '@/features/admin/components/AdminLayout';
import DashboardPage from '@/features/admin/pages/DashboardPage';
import DonationsPage from '@/features/admin/pages/DonationsPage';
import MessagesPage from '@/features/admin/pages/MessagesPage';
import SettingsPage from '@/features/admin/pages/SettingsPage';
import VideosPage from '@/features/admin/pages/VideosPage';
import VolunteersPage from '@/features/admin/pages/VolunteersPage';

export default function AdminApp() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="donations" element={<DonationsPage />} />
          <Route path="volunteers" element={<VolunteersPage />} />
          <Route path="videos" element={<VideosPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Router>
  );
}

