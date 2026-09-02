import React from 'react';
import { Quote, Heart, Compass, Anchor, Home } from 'lucide-react';

const VOICES = [
  {
    name: '30代・育児中のママ',
    text: '子どもが小さく騒ぐのが心配でしたが、誰も嫌な顔をせず「元気が一番！」と笑顔で声をかけてくれて、本当に救われました。',
    tag: '子育て世代'
  },
  {
    name: '60代・自営業',
    text: '定年後の孤独感を感じていた時、ふらっと立ち寄りました。聖書の話は難しくなく、自分の人生を振り返る温かい時間になっています。',
    tag: 'シニア世代'
  },
  {
    name: '20代・会社員',
    text: '仕事のストレスで週末参っていた時、宗教の押し付けが全くない静かな空間でコーヒーを飲めたのが本当に居心地よかったです。',
    tag: '若者・社会人'
  }
];

export const PeopleCommunity: React.FC = () => {
  return (
    <section id="people" className="py-24 px-4 sm:px-6 lg:px-8 bg-amber-50/40 border-b border-stone-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 font-bold text-xs tracking-widest uppercase">
            <span>People & Community</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-900 tracking-tight">
            飾らない人間味のあるコミュニティ
          </h2>
          <p className="text-base sm:text-lg text-stone-600 font-serif leading-relaxed">
            神聖ぶった遠い存在ではなく、日常を泥臭く懸命に生きる仲間たちの集まりです。
          </p>
        </div>

        {/* Pastor Profile Card */}
        <div className="bg-white rounded-3xl border border-amber-200/80 shadow-xl overflow-hidden mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            <div className="lg:col-span-5 relative min-h-[340px] lg:min-h-full bg-stone-100">
              <img 
                src="/images/pastor_family.jpg" 
                alt="新発田いのちのパンチャーチ 牧師夫妻"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent lg:hidden" />
              <div className="absolute bottom-4 left-4 right-4 text-white lg:hidden">
                <span className="text-xs font-bold text-amber-300 block">PASTOR PROFILE</span>
                <h3 className="text-xl font-serif font-bold">新発田いのちのパンチャーチ 牧師</h3>
              </div>
            </div>

            <div className="lg:col-span-7 p-8 sm:p-12 space-y-6">
              <div>
                <span className="text-xs font-bold text-amber-700 tracking-widest uppercase block mb-1">
                  PASTOR PROFILE & MESSAGE
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
                  「完璧な聖人なんて一人もいません。僕自身も日々悩み、助け合っています。」
                </h3>
              </div>

              <p className="text-stone-600 text-base leading-relaxed">
                新発田の豊かな自然に囲まれながら、地域の皆さんと温かい関係を築くことを大切にしています。日曜日に聖書の話をするだけでなく、平日はDIYで木工をしたり、キャンプや釣りを楽しんだり、家庭での日常を大切に過ごしています。
              </p>

              {/* Hobbies / Human side badges */}
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-medium border border-stone-200">
                  ⛺ キャンプ・アウトドア好き
                </span>
                <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-medium border border-stone-200">
                  🎣 釣り・自然散策
                </span>
                <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-medium border border-stone-200">
                  🔨 木工・DIYクラフト
                </span>
                <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-medium border border-stone-200">
                  ☕ 自家焙煎コーヒー
                </span>
              </div>

              <div className="pt-4 border-t border-stone-100">
                <p className="text-stone-700 font-serif italic text-sm sm:text-base leading-relaxed bg-amber-50/60 p-4 rounded-xl border border-amber-200/50">
                  「教会の扉を開けるのには、きっと少しの勇気がいると思います。でも一度来てくだされば『なーんだ、普通の温かい場所だったんだ』と感じていただけるはずです。」
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Voices from Attendees */}
        <div className="space-y-6">
          <h3 className="text-xl font-serif font-bold text-center text-stone-900">
            実際に足を運んでいる人たちの声（証し）
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VOICES.map((voice, idx) => (
              <div 
                key={idx}
                className="bg-white p-7 rounded-3xl border border-stone-200/80 shadow-md flex flex-col justify-between space-y-4 hover:border-amber-300 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Quote className="text-amber-600" size={24} />
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800">
                      {voice.tag}
                    </span>
                  </div>
                  <p className="text-stone-700 text-sm leading-relaxed font-serif">
                    “{voice.text}”
                  </p>
                </div>
                <div className="text-xs font-bold text-stone-500 pt-2 border-t border-stone-100">
                  — {voice.name}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default PeopleCommunity;
