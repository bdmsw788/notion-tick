import React from 'react';
import { Quote } from 'lucide-react';

const VOICES = [
  {
    name: '30代・子育て中のママ',
    text: '子どもが騒ぐのが心配でしたが、誰も嫌な顔をせず「元気が一番！」と笑顔で声をかけてくれて、本当に救われました。',
    tag: '子育て'
  },
  {
    name: '60代・自営業',
    text: '定年後の孤独感を感じていた時、ふらっと立ち寄りました。自分の人生を振り返る温かい時間になっています。',
    tag: 'シニア'
  },
  {
    name: '20代・会社員',
    text: '仕事のストレスで週末参っていた時、押し付けのない静かな空間でコーヒーを読めたのが心地よかったです。',
    tag: '若者'
  }
];

export const BunkaPeople: React.FC = () => {
  return (
    <section id="people" className="py-28 px-4 sm:px-6 lg:px-8 bg-[#F9F4F0] border-b border-[#DBD2C5]">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-block px-4 py-1 rounded-full bg-[#D04E2F] text-white text-xs font-serif font-bold tracking-widest uppercase">
            <span>PEOPLE & STORY</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#302929]">
            飾らない人間味のあるコミュニティ
          </h2>
          <p className="text-base sm:text-lg font-serif text-[#302929]/80">
            聖人ぶった遠い存在ではなく、日常を懸命に生きる仲間たちのあつまりです。
          </p>
        </div>

        {/* Pastor Feature Card - Bunka Magazine Style */}
        <div className="bg-white rounded-3xl border border-[#DBD2C5] overflow-hidden shadow-xl mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* Left Photo 3:4 */}
            <div className="lg:col-span-5 relative min-h-[380px] lg:min-h-full bg-stone-200">
              <img 
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800" 
                alt="新発田いのちのパンチャーチ 牧師" 
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#302929]/80 via-transparent to-transparent lg:hidden" />
              <div className="absolute bottom-4 left-4 right-4 text-white font-serif lg:hidden">
                <span className="text-xs font-bold text-[#EDEB6A]">PASTOR PROFILE</span>
                <h3 className="text-xl font-bold">新発田いのちのパンチャーチ 牧師</h3>
              </div>
            </div>

            {/* Right Story Text */}
            <div className="lg:col-span-7 p-8 sm:p-12 space-y-6 font-serif">
              <div className="flex items-center justify-between border-b border-[#DBD2C5]/60 pb-4">
                <div>
                  <span className="text-xs font-bold text-[#D04E2F] block tracking-widest uppercase">
                    INTERVIEW & PROFILE
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold text-[#302929]">
                    「完璧な人なんて一人もいません。」
                  </h3>
                </div>
              </div>

              <p className="text-[#302929]/80 text-base leading-relaxed">
                新発田の豊かな自然に囲まれながら、地域の人々と温かい関係を築くことを大切にしています。日曜日に聖書の話をするだけでなく、平日はDIYで木工をしたり、キャンプや釣りを楽しんだり、家庭での日常を大切に過ごしています。
              </p>

              {/* Hobbies Badges */}
              <div className="flex flex-wrap gap-2">
                <span className="px-3.5 py-1.5 rounded-full bg-[#F9F4F0] text-[#302929] text-xs font-bold border border-[#DBD2C5]">
                  ⛺ キャンプ・アウトドア
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-[#F9F4F0] text-[#302929] text-xs font-bold border border-[#DBD2C5]">
                  🎣 釣り・自然散策
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-[#F9F4F0] text-[#302929] text-xs font-bold border border-[#DBD2C5]">
                  🔨 木工・DIYクラフト
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-[#F9F4F0] text-[#302929] text-xs font-bold border border-[#DBD2C5]">
                  ☕ 自家焙煎コーヒー
                </span>
              </div>

              <blockquote className="bg-[#DBD2C5]/30 p-5 rounded-2xl border-l-4 border-[#D04E2F] text-[#302929] text-sm sm:text-base italic leading-relaxed">
                「教会の扉を開けるのには、きっと少しの勇気がいると思います。でも一度来てくだされば『なーんだ、普通に温かい場所だったんだ』と感じていただけるはずです。」
              </blockquote>
            </div>

          </div>
        </div>

        {/* Voices from Attendees */}
        <div className="space-y-6">
          <h3 className="text-2xl font-serif font-bold text-center text-[#302929]">
            実際に訪れている人たちの声
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VOICES.map((v, idx) => (
              <div 
                key={idx}
                className="bg-white p-7 rounded-3xl border border-[#DBD2C5] shadow-md flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3 font-serif">
                  <div className="flex items-center justify-between">
                    <Quote className="text-[#D04E2F]" size={24} />
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#D04E2F]/10 text-[#D04E2F]">
                      {v.tag}
                    </span>
                  </div>
                  <p className="text-[#302929]/80 text-sm leading-relaxed italic">
                    “{v.text}”
                  </p>
                </div>
                <div className="text-xs font-serif font-bold text-[#302929]/60 pt-3 border-t border-[#DBD2C5]/60">
                  — {v.name}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
