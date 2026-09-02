import React from 'react';
import { Clock, Music, BookOpen, Coffee, MapPin, Smile } from 'lucide-react';

const TIMELINE_STEPS = [
  {
    time: '10:15 〜 10:30',
    title: '到着・受付（リラックス）',
    icon: MapPin,
    desc: '駐車場到着〜受付。スタッフが温かくお迎えします。席は自由ですのでお好きな場所にお座りください。貸出用聖書もお渡しします。'
  },
  {
    time: '10:30 〜 11:00',
    title: '心を整える音楽・賛美',
    icon: Music,
    desc: 'スクリーンに歌詞が投影されます。バンドの温かい生演奏とともに、心を落ち着かせ静かに聴くだけでも大丈夫です。'
  },
  {
    time: '11:00 〜 11:45',
    title: '聖書の言葉＝人生のヒント',
    icon: BookOpen,
    desc: '専門用語をわかりやすく解説する短く実践的なメッセージ。日常の悩みや心のアドバイスとなる言葉が語られます。'
  },
  {
    time: '11:45 〜 12:00',
    title: '静かな祈り・ご案内',
    icon: Smile,
    desc: '心を込めた短い祈りと今週のご案内。献金カゴが回りますが初参加の方はパスしてOKです。'
  },
  {
    time: '12:00 〜',
    title: 'カフェタイム（自由参加）',
    icon: Coffee,
    desc: '礼拝後は焼きたてのパンやドリップコーヒーを楽しめる歓談タイム。ご予定がある方はそのままお帰りいただけます。'
  }
];

export const Timeline90: React.FC = () => {
  return (
    <section id="timeline" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#FAF7F2] text-[#262626] border-b border-[#E5E0D8]">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1E3D34] text-white font-bold text-xs tracking-widest uppercase shadow-sm">
            <span>日曜朝の90分ストーリー</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight text-[#1E3D34]">
            日曜朝 10:30からの「90分体験」
          </h2>
          <p className="text-base sm:text-lg text-[#262626]/80 font-serif leading-relaxed">
            教会の中で「何が起きるのか」をオープンに可視化しました。<br className="hidden sm:inline" />
            ブラックボックスのない、安心して過ごせるステップです。
          </p>
        </div>

        {/* Timeline Layout */}
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical Line */}
          <div className="hidden md:block absolute left-1/2 top-8 bottom-8 w-1 bg-[#E5E0D8] -translate-x-1/2 z-0" />

          <div className="space-y-8 relative z-10">
            {TIMELINE_STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isEven = idx % 2 === 0;
              return (
                <div 
                  key={idx}
                  className={`flex flex-col md:flex-row items-center gap-8 ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Content Card */}
                  <div className="w-full md:w-1/2">
                    <div className="bg-white p-7 rounded-3xl border-2 border-[#E5E0D8] hover:border-[#D97706] transition-all shadow-md space-y-3">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF7F2] text-[#D97706] text-xs font-bold border border-[#E5E0D8]">
                        <Clock size={14} />
                        <span>{step.time}</span>
                      </div>
                      <h3 className="text-xl font-serif font-bold text-[#1E3D34]">
                        {step.title}
                      </h3>
                      <p className="text-[#262626]/80 text-sm leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>

                  {/* Icon Circle */}
                  <div className="w-14 h-14 rounded-full bg-[#D97706] text-white flex items-center justify-center font-bold text-xl border-4 border-white shadow-xl shrink-0">
                    <Icon size={24} />
                  </div>

                  {/* Spacer */}
                  <div className="hidden md:block w-1/2" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Reminder note */}
        <div className="mt-16 max-w-2xl mx-auto text-center bg-white p-6 rounded-2xl border-2 border-[#E5E0D8] text-[#262626] text-sm font-serif font-bold">
          💡 途中で気分が悪くなった場合や、ご予定がある場合は遠慮なく途中で自由にご退席いただけます。
        </div>

      </div>
    </section>
  );
};

export default Timeline90;
