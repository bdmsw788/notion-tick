import React from 'react';
import { ChevronUp, MessageCircle, ArrowUp } from 'lucide-react';

interface BunkaFooterProps {
  onOpenContact: () => void;
}

export const BunkaFooter: React.FC<BunkaFooterProps> = ({ onOpenContact }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <>
      <footer className="bg-[#302929] text-[#F9F4F0] pt-20 pb-12 font-serif border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-stone-800">
            
            {/* Brand Column */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#D04E2F] text-white flex items-center justify-center font-bold text-xl">
                  🍞
                </div>
                <span className="font-bold text-xl text-white tracking-wider">
                  新発田いのちのパンチャーチ
                </span>
              </div>
              <p className="text-[#EDEB6A] text-sm font-bold">
                パン屋じゃない。でも、心が空腹な人のための場所。
              </p>
              <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
                聖書がわからなくても。教会が初めてでも。そのままのあなたで来ていい、新発田のほっとできる食卓です。
              </p>
            </div>

            {/* Nav 1 */}
            <div className="space-y-3">
              <h4 className="font-bold text-white text-xs tracking-widest uppercase">
                初めての方へ
              </h4>
              <ul className="space-y-2 text-xs text-stone-400">
                <li>
                  <button onClick={() => scrollTo('statement')} className="hover:text-[#EDEB6A] transition-colors">
                    いのちのパンとは
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollTo('doors')} className="hover:text-[#EDEB6A] transition-colors">
                    4つの扉（パーソナライズ）
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollTo('reliefs')} className="hover:text-[#EDEB6A] transition-colors">
                    5つの安心（教会のトリセツ）
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollTo('timeline')} className="hover:text-[#EDEB6A] transition-colors">
                    90分体験のタイムライン
                  </button>
                </li>
              </ul>
            </div>

            {/* Nav 2 */}
            <div className="space-y-3">
              <h4 className="font-bold text-white text-xs tracking-widest uppercase">
                コンテンツ
              </h4>
              <ul className="space-y-2 text-xs text-stone-400">
                <li>
                  <button onClick={() => scrollTo('people')} className="hover:text-[#EDEB6A] transition-colors">
                    牧師プロフィール & 人々の声
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollTo('cms')} className="hover:text-[#EDEB6A] transition-colors">
                    最新のお知らせ & 説教動画
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollTo('access')} className="hover:text-[#EDEB6A] transition-colors">
                    アクセス・駐車場案内
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact Action */}
            <div className="space-y-4">
              <h4 className="font-bold text-white text-xs tracking-widest uppercase">
                ご相談・初回来訪
              </h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                どんな小さなことでも気軽にご質問いただけます。
              </p>
              <button
                onClick={onOpenContact}
                className="w-full py-3 rounded-full bg-[#D04E2F] hover:bg-[#b03d21] text-white font-bold text-xs transition-colors shadow-md text-center block"
              >
                お問い合わせ・予約フォーム
              </button>
            </div>

          </div>

          {/* Bottom Copyright */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
            <p>© {new Date().getFullYear()} Shibata Bread of Life Church. All rights reserved.</p>
            <button onClick={scrollToTop} className="hover:text-[#EDEB6A] transition-colors flex items-center gap-1">
              <span>ページトップへ</span>
              <ArrowUp size={14} />
            </button>
          </div>

        </div>
      </footer>

      {/* Floating Action Button (Bunka Style Bottom-Right Sticky) */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={onOpenContact}
          className="px-5 py-3.5 rounded-full bg-[#D04E2F] hover:bg-[#b03d21] text-white font-serif font-bold text-xs sm:text-sm shadow-2xl transition-all flex items-center gap-2 border-2 border-white/40 active:scale-95 group"
        >
          <MessageCircle size={18} className="group-hover:rotate-12 transition-transform" />
          <span>初回来訪・質問する</span>
        </button>
      </div>
    </>
  );
};
