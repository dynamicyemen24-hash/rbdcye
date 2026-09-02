import { X, Send } from 'lucide-react';
import React, { useState } from 'react';

interface ReplyModalProps {
  isOpen: boolean;
  message: any;
  onClose: () => void;
  onSend: (reply: string) => Promise<void>;
}

export function ReplyModal({ isOpen, message, onClose, onSend }: ReplyModalProps) {
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);

  if (!isOpen || !message) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim()) return;

    setSending(true);
    try {
      await onSend(reply);
      setReply('');
    } catch (error) {
      console.error('Error sending reply:', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-bold text-gray-900">الرد على رسالة</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={sending}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4">
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">الرد على</p>
            <p className="font-medium text-gray-900">{message.name}</p>
            <p className="text-sm text-gray-500">{message.email}</p>
          </div>

          <form onSubmit={handleSubmit}>
              <div className="mb-4">
              <label htmlFor="reply-text" className="block text-sm font-medium text-gray-700 mb-2">
                نص الرد
              </label>
              <textarea
                id="reply-text"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                placeholder="اكتب ردك هنا..."
                dir="rtl"
                disabled={sending}
              />
              <p className="mt-1 text-xs text-gray-500">
                {reply.length} / 5000 حرف
              </p>
            </div>

            <div className="flex items-center gap-2 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={sending}
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={!reply.trim() || sending}
                className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    جاري الإرسال...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    إرسال الرد
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

