import React from 'react';
import { Quote } from 'lucide-react';

export const BunkaStatement: React.FC = () => {
  return (
    <section id="statement" className="py-28 px-4 sm:px-6 lg:px-8 bg-[#F9F4F0] border-b border-[#DBD2C5]">
      <div className="max-w-5xl mx-auto">
        
        {/* Main Statement Box with Vermilion Accents */}
        <div className="bg-white rounded-3xl p-8 sm:p-16 border border-[#DBD2C5] shadow-xl relative overflow-hidden">
          
          {/* Top Stamp Label */}
          <div className="flex justify-between items-center mb-10 border-b border-[#DBD2C5]/60 pb-6">
            <span className="text-xs font-serif font-bold text-[#D04E2F] tracking-widest uppercase bg-[#D04E2F]/10 px-3 py-1 rounded-md">
              CONCEPT STATEMENT
            </span>
            <span className="text-xs font-serif text-[#302929]/60">
              新発田いのちのパンチャーチの根幹
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Big Text */}
            <div className="lg:col-span-8 space-y-6">
              
              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#302929] leading-relaxed">
                この場所で起こるのは、<br />
                <span className="text-[#D04E2F] text-3xl sm:text-5xl my-2 block">
                  「休むことと、繋がることと、自分らしく居ること」。
                </span>
              </h2>

              <p className="text-base sm:text-lg font-serif text-[#302929]/80 leading-loose">
                人は、お腹が空けば食べ物を探します。<br />
                では、心やたましいが空腹になったときは、どこへ行けばよいのでしょうか。<br /><br />
                ここは教会の「正しさの説明」をする場所ではありません。<br />
                日々の暮らしで消耗した人が、飾らない私服のまま、あたたかいパンとスープを囲み、ほっとひと息つける新発田の食卓です。
              </p>
            </div>

            {/* Right Vertical Highlight Box */}
            <div className="lg:col-span-4 bg-[#F9F4F0] p-6 rounded-2xl border border-[#DBD2C5] flex items-center justify-center">
              <div className="vertical-text font-serif font-bold text-lg text-[#302929] leading-loose tracking-widest text-center py-4">
                「完璧な人はひとりもいない。<br />だから、安心して来てほしい。」
              </div>
            </div>

          </div>

          {/* Bible Verse Quote Box */}
          <div className="mt-12 pt-8 border-t border-[#DBD2C5]/60">
            <blockquote className="font-serif text-lg sm:text-xl text-[#302929] leading-relaxed italic bg-[#DBD2C5]/30 p-6 rounded-2xl border-l-4 border-[#D04E2F]">
              「わたしがいのちのパンです。わたしに来る者は決して飢えることがなく、わたしを信じる者はどんなときにも、決して渇くことがありません。」
              <footer className="text-xs font-sans not-italic text-[#302929]/60 mt-3">
                — ヨハネの福音書 6章35節
              </footer>
            </blockquote>
          </div>

        </div>

      </div>
    </section>
  );
};
