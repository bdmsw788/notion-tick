import React from 'react';
import { Youtube, ArrowUp } from 'lucide-react';

interface FooterProps {
  onOpenContact: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenContact }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#1E3D34] text-[#FAF7F2] pt-20 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-stone-700/60">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#D97706] text-white flex items-center justify-center font-bold text-xl">
                🍞
              </div>
              <span className="font-serif font-bold text-xl text-white tracking-wider">
                新発田いのちのパンチャーチ
              </span>
            </div>
            <p className="text-amber-200 font-serif text-sm font-bold">
              心が空腹な日の、温かい居場所。
            </p>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed max-w-sm">
              聖書を知らなくても。教会が初めてでも。まだ神様を信じていなくても、大丈夫です。ひと息つける「食卓」が、ここにあります。
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-white/10 hover:bg-[#D97706] text-white transition-colors border border-white/20"
                aria-label="YouTube Channel"
              >
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links 1 */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-amber-200 text-sm tracking-wider uppercase">
              初めての方へ
            </h4>
            <ul className="space-y-2 text-xs font-bold text-stone-300">
              <li>
                <button onClick={() => scrollTo('worship-gallery')} className="hover:text-amber-200 transition-colors">
                  礼拝の雰囲気・動画
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('four-doors')} className="hover:text-amber-200 transition-colors">
                  心が休まる 4つのテーブル
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('reliefs')} className="hover:text-amber-200 transition-colors">
                  5つの安心（教会のトリセツ）
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('timeline')} className="hover:text-amber-200 transition-colors">
                  日曜90分体験のストーリー
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links 2 */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-amber-200 text-sm tracking-wider uppercase">
              教会について
            </h4>
            <ul className="space-y-2 text-xs font-bold text-stone-300">
              <li>
                <button onClick={() => scrollTo('people')} className="hover:text-amber-200 transition-colors">
                  牧師プロフィール＆人間味
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('people')} className="hover:text-amber-200 transition-colors">
                  実際に訪れている人の声
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('access')} className="hover:text-amber-200 transition-colors">
                  アクセス・駐車場のご案内
                </button>
              </li>
            </ul>
          </div>

          {/* Contact CTA */}
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-amber-200 text-sm tracking-wider uppercase">
              ご相談・来訪予約
            </h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              質問や不安な点があれば、いつでもお気軽にお問い合わせください。
            </p>
            <button
              onClick={onOpenContact}
              className="w-full py-3.5 rounded-full bg-[#D97706] hover:bg-[#b45309] text-white font-bold text-xs transition-colors shadow-md text-center block"
            >
              お問い合わせ・予約フォーム
            </button>
          </div>

        </div>

        {/* Bottom copyright & Scroll to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-300 font-bold">
          <p>© {new Date().getFullYear()} Shibata Bread of Life Church. All rights reserved.</p>
          
          <div className="flex items-center gap-6">
            <button onClick={scrollToTop} className="hover:text-amber-200 transition-colors flex items-center gap-1">
              <span>ページトップへ</span>
              <ArrowUp size={14} />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
