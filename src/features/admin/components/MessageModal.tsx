import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { X, Reply, Mail, Phone, User, Globe, Calendar } from 'lucide-react';
import React from 'react';

interface MessageModalProps {
  isOpen: boolean;
  message: any;
  onClose: () => void;
  onReply: () => void;
}

export function MessageModal({ isOpen, message, onClose, onReply }: MessageModalProps) {
  if (!isOpen || !message) return null;

  const formatDate = (date: string) => {
    return format(new Date(date), 'dd MMM yyyy, HH:mm', { locale: ar });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-bold text-gray-900">تفاصيل الرسالة</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 overflow-y-auto max-h-[60vh]">
          {/* معلومات المرسل */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <User className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">الاسم</p>
                <p className="font-medium text-gray-900">{message.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <Mail className="w-4 h-4 text-gray-400" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500">البريد الإلكتروني</p>
                <a href={`mailto:${message.email}`} className="font-medium text-emerald-600 hover:underline truncate block">
                  {message.email}
                </a>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <Phone className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">رقم الهاتف</p>
                <p className="font-medium text-gray-900 dir-ltr">{message.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <Globe className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">الدولة</p>
                <p className="font-medium text-gray-900">{message.country || 'غير محدد'}</p>
              </div>
            </div>
          </div>

          {/* الموضوع */}
          {message.subject && (
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">الموضوع</p>
              <p className="font-medium text-gray-900">{message.subject}</p>
            </div>
          )}

          {/* محتوى الرسالة */}
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-1">محتوى الرسالة</p>
            <div className="p-4 bg-gray-50 rounded-lg whitespace-pre-wrap text-gray-800">
              {message.message}
            </div>
          </div>

          {/* الرد إذا كان موجود */}
          {message.reply_message && (
            <div className="mb-4 p-4 bg-emerald-50 rounded-lg border border-emerald-100">
              <p className="text-sm text-emerald-700 font-medium mb-2">✉️ الرد المرسل</p>
              <p className="text-gray-700 whitespace-pre-wrap">{message.reply_message}</p>
              <p className="text-xs text-gray-500 mt-2">
                تم الرد في: {formatDate(message.replied_at)}
              </p>
            </div>
          )}

          {/* معلومات إضافية */}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(message.created_at)}</span>
            </div>
            <span className="w-px h-4 bg-gray-200"></span>
            <div>
              الحالة: <span className="font-medium">{message.status}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            إغلاق
          </button>
          <button
            onClick={onReply}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Reply className="w-4 h-4" />
            رد على الرسالة
          </button>
        </div>
      </div>
    </div>
  );
}

