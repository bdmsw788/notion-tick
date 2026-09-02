import React, { useState } from 'react';
import { X, Send, CheckCircle2, Heart, HelpCircle, Calendar } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactType: '質問・事前相談',
    visitDate: '',
    message: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      // RESET AFTER SHOWING SUCCESS
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-xl w-full p-8 shadow-2xl border border-stone-200 relative overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          aria-label="Close Modal"
        >
          <X size={22} />
        </button>

        {submitted ? (
          <div className="py-12 text-center space-y-6 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 size={36} />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-serif font-bold text-stone-900">
                メッセージを受け付けました
              </h3>
              <p className="text-stone-600 text-sm font-serif max-w-md mx-auto leading-relaxed">
                ご連絡ありがとうございます。担当者より折り返しメールにてご案内をお送りいたします。日曜日にあなたとお会いできることを楽しみにしております。
              </p>
            </div>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="px-8 py-3 rounded-full bg-amber-700 text-white font-bold text-sm shadow-md hover:bg-amber-800 transition-colors"
            >
              閉じる
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-amber-700 tracking-widest uppercase block">
                FIRST VISIT & INQUIRY
              </span>
              <h3 className="text-2xl font-serif font-bold text-stone-900">
                行く前の質問・初回来訪の連絡
              </h3>
              <p className="text-stone-500 text-xs sm:text-sm font-serif">
                「駐車場はある？」「子どもと行っても大丈夫？」など、どんな小さな疑問でも気軽にお送りください。
              </p>
            </div>

            <div className="space-y-4">
              {/* Type Selection */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  ご連絡の目的
                </label>
                <select
                  value={formData.contactType}
                  onChange={(e) => setFormData({ ...formData, contactType: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm bg-stone-50"
                >
                  <option value="質問・事前相談">行く前に質問したい・不安を解消したい</option>
                  <option value="初回来訪の連絡">今週の日曜日に見学に行きます（初回来訪連絡）</option>
                  <option value="子ども食堂・イベント">イベント・子ども食堂についてのお問い合わせ</option>
                  <option value="その他">その他のお問い合わせ</option>
                </select>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  お名前（ニックネーム可） <span className="text-amber-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="例：山田 太郎"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm bg-stone-50"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  メールアドレス <span className="text-amber-600">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="例：yourname@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm bg-stone-50"
                />
              </div>

              {/* Visit Date */}
              {formData.contactType === '初回来訪の連絡' && (
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    参加予定の日付（任意）
                  </label>
                  <input
                    type="date"
                    value={formData.visitDate}
                    onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm bg-stone-50"
                  />
                </div>
              )}

              {/* Message */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  質問・メッセージ
                </label>
                <textarea
                  rows={4}
                  placeholder="気になることや相談したいことがあれば自由にご記入ください。"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm bg-stone-50 resize-none"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-4 rounded-full bg-amber-700 hover:bg-amber-800 text-white font-bold text-base transition-all shadow-lg flex items-center justify-center gap-2 active:scale-98"
              >
                <Send size={18} />
                <span>送信する（返信メールをお送りします）</span>
              </button>
            </div>

            <p className="text-[11px] text-stone-400 text-center">
              ※ 個人情報は厳重に管理し、事前の問い合わせ対応および当日のご案内にのみ使用いたします。
            </p>
          </form>
        )}
      </div>
    </div>
  );
};
