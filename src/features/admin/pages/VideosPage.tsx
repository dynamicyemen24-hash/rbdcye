// VideosPage - إدارة الفيديوهات
import { VideoManager } from '@/features/admin/components/VideoManager';

export default function VideosPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">إدارة الفيديوهات</h1>
        <p className="text-gray-600">إدارة جميع فيديوهات الموقع من لوحة واحدة</p>
      </div>

      {/* VideoManager Component */}
      <VideoManager />
    </div>
  );
}

