import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronRight } from 'lucide-react';

interface BunkaNavbarProps {
  onOpenContact: () => void;
}

export const BunkaNavbar: React.FC<BunkaNavbarProps> = ({ onOpenContact }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#F9F4F0]/95 backdrop-blur-md border-b border-[#DBD2C5] shadow-sm py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Logo - 文化ノ台所テイスト */}
        <button 
          onClick={() => scrollTo('hero')} 
          className="text-left flex items-center gap-3 group focus:outline-none"
        >
          <div className="w-10 h-10 rounded-full bg-[#D04E2F] text-white flex items-center justify-center font-bold text-xl shadow-md group-hover:rotate-12 transition-transform">
            🍞
          </div>
          <div>
            <span className="font-serif font-bold text-lg tracking-wider block text-[#302929]">
              新発田いのちのパンチャーチ
            </span>
            <span className="text-[10px] block font-sans tracking-widest text-[#D04E2F] font-bold uppercase">
              Shibata Bread of Life
            </span>
          </div>
        </button>

        {/* Desktop Links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-serif font-bold text-[#302929]">
          <button onClick={() => scrollTo('statement')} className="hover:text-[#D04E2F] transition-colors">
            いのちのパンとは
          </button>
          <button onClick={() => scrollTo('doors')} className="hover:text-[#D04E2F] transition-colors">
            4つの扉
          </button>
          <button onClick={() => scrollTo('reliefs')} className="hover:text-[#D04E2F] transition-colors">
            5つの安心
          </button>
          <button onClick={() => scrollTo('timeline')} className="hover:text-[#D04E2F] transition-colors">
            90分タイムライン
          </button>
          <button onClick={() => scrollTo('people')} className="hover:text-[#D04E2F] transition-colors">
            牧師・人々の声
          </button>
          <button onClick={() => scrollTo('cms')} className="hover:text-[#D04E2F] transition-colors">
            お知らせ
          </button>
          <button onClick={() => scrollTo('access')} className="hover:text-[#D04E2F] transition-colors">
            アクセス
          </button>
        </nav>

        {/* CTA Button */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={onOpenContact}
            className="px-6 py-2.5 rounded-full bg-[#D04E2F] hover:bg-[#b03d21] text-white font-bold text-xs font-serif transition-all shadow-md flex items-center gap-1.5 active:scale-95"
          >
            <span>初回来訪・質問する</span>
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 text-[#302929] hover:bg-[#DBD2C5]/40 rounded-lg transition-colors"
          aria-label="Toggle Navigation"
        >
          {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#F9F4F0] border-b border-[#DBD2C5] shadow-2xl py-6 px-6 space-y-4 animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-3 font-serif font-bold text-[#302929] text-base">
            <button onClick={() => scrollTo('statement')} className="text-left py-2 border-b border-[#DBD2C5]/50">
              🌾 いのちのパンとは
            </button>
            <button onClick={() => scrollTo('doors')} className="text-left py-2 border-b border-[#DBD2C5]/50">
              🚪 4つの扉（パーソナライズ）
            </button>
            <button onClick={() => scrollTo('reliefs')} className="text-left py-2 border-b border-[#DBD2C5]/50">
              🛡️ 5つの安心（トリセツ）
            </button>
            <button onClick={() => scrollTo('timeline')} className="text-left py-2 border-b border-[#DBD2C5]/50">
              ⏱️ 日曜90分タイムライン
            </button>
            <button onClick={() => scrollTo('people')} className="text-left py-2 border-b border-[#DBD2C5]/50">
              👥 牧師・人々の声
            </button>
            <button onClick={() => scrollTo('cms')} className="text-left py-2 border-b border-[#DBD2C5]/50">
              📰 お知らせ & 説教動画
            </button>
            <button onClick={() => scrollTo('access')} className="text-left py-2 border-b border-[#DBD2C5]/50">
              📍 アクセス・駐車場
            </button>
          </div>
          <div className="pt-2">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenContact();
              }}
              className="w-full py-3 rounded-full bg-[#D04E2F] text-white font-serif font-bold text-center shadow-md flex items-center justify-center gap-2"
            >
              <span>行く前に質問する・初回来訪連絡</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
