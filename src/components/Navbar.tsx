import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronRight, Video } from 'lucide-react';

interface NavbarProps {
  onOpenContact: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenContact }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E5E0D8] shadow-sm py-3' 
          : 'bg-[#FAF7F2]/80 backdrop-blur-sm border-b border-[#E5E0D8]/60 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <button 
          onClick={() => scrollTo('hero')} 
          className="text-left flex items-center gap-3 group focus:outline-none"
        >
          <div className="w-10 h-10 rounded-full bg-[#1E3D34] text-white flex items-center justify-center font-bold text-xl shadow-md group-hover:scale-105 transition-transform">
            🍞
          </div>
          <div>
            <span className="font-serif font-bold text-lg tracking-wider block text-[#1E3D34]">
              新発田いのちのパンチャーチ
            </span>
            <span className="text-[11px] block font-sans tracking-tight text-[#D97706] font-bold">
              心が空腹な日の、温かい居場所。
            </span>
          </div>
        </button>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-bold text-[#1E3D34]">
          <button 
            onClick={() => scrollTo('worship-gallery')} 
            className="transition-colors flex items-center gap-1.5 text-[#D97706] hover:text-[#b45309]"
          >
            <Video size={16} />
            <span>礼拝の様子・動画</span>
          </button>
          <button 
            onClick={() => scrollTo('four-doors')} 
            className="transition-colors hover:text-[#D97706]"
          >
            4つのテーブル
          </button>
          <button 
            onClick={() => scrollTo('reliefs')} 
            className="transition-colors hover:text-[#D97706]"
          >
            5つの安心
          </button>
          <button 
            onClick={() => scrollTo('timeline')} 
            className="transition-colors hover:text-[#D97706]"
          >
            90分ストーリー
          </button>
          <button 
            onClick={() => scrollTo('people')} 
            className="transition-colors hover:text-[#D97706]"
          >
            牧師・人々の声
          </button>
          <button 
            onClick={() => scrollTo('access')} 
            className="transition-colors hover:text-[#D97706]"
          >
            アクセス・駐車場
          </button>
        </nav>

        {/* CTA Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={onOpenContact}
            className="px-5 py-2.5 rounded-full bg-[#D97706] hover:bg-[#b45309] text-white font-bold text-sm transition-all shadow-md flex items-center gap-1.5 active:scale-95"
          >
            <span>初回来訪・ご質問</span>
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-[#1E3D34] hover:bg-[#E5E0D8]/50 transition-colors"
          aria-label="Toggle Navigation"
        >
          {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF7F2] border-b border-[#E5E0D8] shadow-2xl py-6 px-6 space-y-4 animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-3 text-[#1E3D34] font-bold text-base">
            <button onClick={() => scrollTo('worship-gallery')} className="text-left py-2 border-b border-[#E5E0D8] text-[#D97706] flex items-center gap-2 font-bold">
              🎥 礼拝の様子・写真＆動画ギャラリー
            </button>
            <button onClick={() => scrollTo('four-doors')} className="text-left py-2 border-b border-[#E5E0D8] hover:text-[#D97706]">
              ☕ 心が休まる 4つのテーブル
            </button>
            <button onClick={() => scrollTo('reliefs')} className="text-left py-2 border-b border-[#E5E0D8] hover:text-[#D97706]">
              🛡️ 教会のトリセツ（5つの安心）
            </button>
            <button onClick={() => scrollTo('timeline')} className="text-left py-2 border-b border-[#E5E0D8] hover:text-[#D97706]">
              ⏱️ 日曜朝90分のストーリー
            </button>
            <button onClick={() => scrollTo('people')} className="text-left py-2 border-b border-[#E5E0D8] hover:text-[#D97706]">
              👤 牧師・コミュニティの紹介
            </button>
            <button onClick={() => scrollTo('cms-updates')} className="text-left py-2 border-b border-[#E5E0D8] hover:text-[#D97706]">
              📰 お知らせ・メッセージ動画
            </button>
            <button onClick={() => scrollTo('access')} className="text-left py-2 border-b border-[#E5E0D8] hover:text-[#D97706]">
              📍 アクセス・駐車場
            </button>
          </div>
          <div className="pt-2">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenContact();
              }}
              className="w-full py-3.5 rounded-full bg-[#D97706] text-white font-bold text-center shadow-md flex items-center justify-center gap-2"
            >
              <span>初めての方のご連絡・質問フォーム</span>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
