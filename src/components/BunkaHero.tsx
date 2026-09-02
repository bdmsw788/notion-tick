import React from 'react';
import { ChevronRight, ArrowDown } from 'lucide-react';

interface BunkaHeroProps {
  onOpenContact: () => void;
}

export const BunkaHero: React.FC<BunkaHeroProps> = ({ onOpenContact }) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative pt-28 pb-20 px-4 sm:px-6 lg:px-8 bg-[#F9F4F0] min-h-[90vh] flex items-center overflow-hidden border-b border-[#DBD2C5]">
      
      {/* Decorative Warm Shapes */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-[#EDEB6A]/20 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#D04E2F]/10 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left / Main Text Column with Vertical Japanese Copy */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D04E2F] text-white text-xs font-serif font-bold tracking-widest uppercase shadow-sm">
              <span>新発田のまちの、ほっとできる食卓</span>
            </div>

            {/* Vertical + Horizontal Catchphrase Combo (Bunka style) */}
            <div className="flex flex-col md:flex-row items-start gap-8">
              
              {/* Vertical Text Block */}
              <div className="hidden md:block vertical-text font-serif font-black text-4xl lg:text-5xl text-[#302929] leading-loose tracking-widest border-r-2 border-[#D04E2F]/30 pr-6 py-2">
                何はともあれ、まずパンだ。
              </div>

              {/* Main Headline */}
              <div className="space-y-6 flex-1">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#302929] leading-[1.25] tracking-tight">
                  パン屋じゃない。<br />
                  でも、<span className="text-[#D04E2F]">心が空腹な人</span>の<br />
                  ための場所。
                </h1>

                <p className="text-base sm:text-xl font-serif text-[#302929]/80 leading-relaxed">
                  聖書がわからなくても。信じていなくても。<br className="hidden sm:inline" />
                  そのままのあなたで来ていい、新発田の教会です。
                </p>

                {/* Sub Badges */}
                <div className="pt-2 flex flex-wrap gap-2 text-xs font-serif font-bold text-[#302929]">
                  <span className="px-3.5 py-1.5 rounded-full bg-[#DBD2C5]/50 border border-[#DBD2C5]">
                    私服・普段着でOK
                  </span>
                  <span className="px-3.5 py-1.5 rounded-full bg-[#DBD2C5]/50 border border-[#DBD2C5]">
                    手ぶらでOK
                  </span>
                  <span className="px-3.5 py-1.5 rounded-full bg-[#DBD2C5]/50 border border-[#DBD2C5]">
                    献金は完全自由
                  </span>
                  <span className="px-3.5 py-1.5 rounded-full bg-[#DBD2C5]/50 border border-[#DBD2C5]">
                    しつこい勧誘一切なし
                  </span>
                </div>

                {/* CTAs */}
                <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <button
                    onClick={() => scrollTo('doors')}
                    className="px-8 py-4 rounded-full bg-[#D04E2F] hover:bg-[#b03d21] text-white font-serif font-bold text-base transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group active:scale-95"
                  >
                    <span>初めての方への完全ガイドを見る</span>
                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={onOpenContact}
                    className="px-7 py-4 rounded-full bg-white hover:bg-[#DBD2C5]/30 text-[#302929] font-serif font-bold text-base transition-all border border-[#302929]/20 flex items-center justify-center gap-2 active:scale-95 shadow-sm"
                  >
                    <span>行く前に質問する</span>
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Bunka 3:4 Aspect Ratio Photo Frame */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md">
              {/* Photo Frame Container */}
              <div className="aspect-3-4 rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-stone-200 transform rotate-1 hover:rotate-0 transition-transform duration-500 relative">
                <img 
                  src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=1000" 
                  alt="温かいパンとコーヒーの食卓"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#302929]/70 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white font-serif">
                  <span className="text-xs font-bold text-[#EDEB6A] block mb-1 uppercase tracking-widest">
                    Shibata Bread of Life
                  </span>
                  <p className="text-lg font-bold">
                    「信じる前に、来ていい。」
                  </p>
                </div>
              </div>

              {/* Decorative Background Card Accent */}
              <div className="absolute -bottom-4 -right-4 w-full h-full bg-[#7AA093]/30 rounded-3xl -z-10 border border-[#7AA093]/40" />
            </div>
          </div>

        </div>

        {/* Scroll Indicator */}
        <div className="pt-16 text-center">
          <button 
            onClick={() => scrollTo('statement')}
            className="inline-flex flex-col items-center text-xs font-serif font-bold text-[#302929]/60 hover:text-[#D04E2F] transition-colors"
          >
            <span>スクロールして教会の世界観を見る</span>
            <ArrowDown size={16} className="animate-bounce mt-1 text-[#D04E2F]" />
          </button>
        </div>

      </div>
    </section>
  );
};
