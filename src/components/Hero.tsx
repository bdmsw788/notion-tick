import React from 'react';
import { Sparkles, CheckCircle2, ChevronRight, Video, Calendar, MapPin, Heart, Coffee } from 'lucide-react';

interface HeroProps {
  onOpenContact: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenContact }) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative min-h-[92vh] flex items-center pt-28 pb-20 px-4 sm:px-6 lg:px-8 bg-[#FAF7F2] text-[#262626] border-b border-[#E5E0D8]">
      
      {/* Background Soft Glow & Sunlight Effects */}
      <div className="absolute top-12 right-12 w-[500px] h-[500px] bg-[#F59E0B]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-12 left-12 w-[400px] h-[400px] bg-[#1E3D34]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Japandi Headline & Copy */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Japandi Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1E3D34] text-amber-200 text-xs sm:text-sm font-bold tracking-widest uppercase shadow-md">
            <Sparkles size={16} className="text-[#F59E0B] animate-pulse" />
            <span>SHIBATA BREAD OF LIFE CHURCH</span>
          </div>

          {/* Main Japandi Headline */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold text-[#1E3D34] leading-[1.2] tracking-tight">
              心が空腹な日の、<br />
              <span className="text-[#D97706] relative inline-block">
                温かい居場所。
                <span className="absolute bottom-1 left-0 w-full h-3 bg-[#F59E0B]/30 -z-10 rounded-full" />
              </span>
            </h1>
            <p className="text-sm sm:text-base font-bold text-[#D97706] tracking-widest">
              パンと祈りと、ありのままのあなたで居られる場所。
            </p>
          </div>

          {/* Body Statement */}
          <p className="text-base sm:text-xl text-[#262626]/85 font-serif leading-relaxed border-l-4 border-[#D97706] pl-4 py-1">
            パン屋ではありません。でも、誰もが手ぶらでふらっと立ち寄れる、新発田のまちの小さな教会です。<br />
            聖書がわからなくても、信じていなくても、そのままのあなたでお越しいただけます。
          </p>

          {/* Japandi Quick Relief Badges */}
          <div className="pt-2 flex flex-wrap gap-2.5 text-xs sm:text-sm font-bold">
            <div className="flex items-center gap-1.5 bg-white px-4 py-2 rounded-xl border border-[#E5E0D8] text-[#262626] shadow-sm">
              <CheckCircle2 size={16} className="text-[#1E3D34]" />
              <span>いつもの私服でふらっと</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white px-4 py-2 rounded-xl border border-[#E5E0D8] text-[#262626] shadow-sm">
              <CheckCircle2 size={16} className="text-[#1E3D34]" />
              <span>手ぶらOK・聖書無料貸出</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white px-4 py-2 rounded-xl border border-[#E5E0D8] text-[#262626] shadow-sm">
              <CheckCircle2 size={16} className="text-[#1E3D34]" />
              <span>献金は完全自由（パスOK）</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white px-4 py-2 rounded-xl border border-[#E5E0D8] text-[#262626] shadow-sm">
              <CheckCircle2 size={16} className="text-[#1E3D34]" />
              <span>しつこい勧誘一切なし</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button
              onClick={() => scrollTo('four-doors')}
              className="px-8 py-4 rounded-full bg-[#D97706] hover:bg-[#b45309] text-white font-bold text-base transition-all shadow-xl hover:shadow-[#D97706]/30 flex items-center justify-center gap-2 group active:scale-95"
            >
              <span>初めての方のガイドを見る</span>
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => scrollTo('worship-gallery')}
              className="px-7 py-4 rounded-full bg-white hover:bg-stone-50 text-[#1E3D34] font-bold text-base transition-all border border-[#E5E0D8] flex items-center justify-center gap-2 shadow-sm active:scale-95"
            >
              <Video size={18} className="text-[#D97706]" />
              <span>礼拝の雰囲気・動画を見る</span>
            </button>
          </div>

          {/* Sunday Worship Quick Info */}
          <div className="pt-6 border-t border-[#E5E0D8] flex flex-wrap items-center gap-6 text-[#262626] text-xs sm:text-sm font-serif">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-[#D97706]" />
              <span><strong>日曜礼拝:</strong> 毎週日曜日 10:30 〜 12:00</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-[#D97706]" />
              <span>JR新発田駅から徒歩5分 / 無料駐車場10台完備</span>
            </div>
          </div>

        </div>

        {/* Right Column: Japandi Photo Gallery Frame */}
        <div className="lg:col-span-5 relative">
          <div className="relative rounded-3xl overflow-hidden border-8 border-white shadow-2xl bg-white aspect-[3/4]">
            <img 
              src="/images/hero_church.jpg" 
              alt="新発田いのちのパンチャーチ 陽の光あふれる礼拝堂" 
              className="w-full h-full object-cover"
            />
            
            {/* Glassmorphism Bottom Card */}
            <div className="absolute bottom-6 left-6 right-6 bg-[#1E3D34]/90 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-white space-y-2">
              <div className="inline-block px-3 py-1 rounded bg-[#D97706] text-white text-xs font-bold">
                新発田の小さな教会
              </div>
              <h3 className="text-lg font-serif font-bold text-white leading-snug">
                「飾らずに、自分らしく居られる食卓」
              </h3>
              <p className="text-xs text-stone-300">
                日曜の朝、焼きたてのパンと生演奏の音楽で心をお休みください。
              </p>
            </div>
          </div>

          {/* Floating Japandi Badge */}
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-[#1E3D34] text-white border-4 border-white shadow-xl flex flex-col items-center justify-center font-serif font-bold text-center leading-tight rotate-6">
            <span className="text-[10px] text-[#F59E0B]">見学歓迎</span>
            <span className="text-sm font-black">手ぶら</span>
            <span className="text-[10px] text-stone-300">OK!</span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
