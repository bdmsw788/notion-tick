import React from 'react';
import { Clock } from 'lucide-react';

const STEPS = [
  {
    num: '一',
    time: '10:15 〜 10:30',
    title: '到着・受付（リラックス）',
    desc: '駐車場到着〜受付。温かくお迎えします。席は自由ですのでお好きな場所にお座りください。'
  },
  {
    num: '二',
    time: '10:30 〜 11:00',
    title: '心を整える音楽・賛美',
    desc: 'スクリーンに歌詞が投影されます。生演奏とともに、心を落ち着かせ静かに聴くだけでも大丈夫です。'
  },
  {
    num: '三',
    time: '11:00 〜 11:45',
    title: '聖書の言葉＝人生のヒント',
    desc: '専門用語を使わず、日常の悩みや心のアドバイスとなる短く実践的なメッセージが語られます。'
  },
  {
    num: '四',
    time: '11:45 〜 12:00',
    title: '静かな祈り・ご案内',
    desc: '心を込めた短い祈りとご案内。献金カゴが回りますが初参加の方はパスしてOKです。'
  },
  {
    num: '五',
    time: '12:00 〜',
    title: 'カフェタイム（自由参加）',
    desc: '礼拝後は焼きたてのパンとコーヒーを楽しめる歓談タイム。ご予定がある方はそのままお帰りいただけます。'
  }
];

export const BunkaTimeline: React.FC = () => {
  return (
    <section id="timeline" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#F9F4F0] border-b border-[#DBD2C5]">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-block px-4 py-1 rounded-full bg-[#EDEB6A] text-[#302929] text-xs font-serif font-bold tracking-widest uppercase border border-[#DBD2C5]">
            <span>SUNDAY 90 MINUTES TIMELINE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#302929]">
            日曜朝 10:30からの「90分体験」
          </h2>
          <p className="text-base sm:text-lg font-serif text-[#302929]/80">
            ブラックボックスのない透明な体験ステップです。
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {STEPS.map((step, idx) => (
            <div 
              key={idx}
              className="bg-white p-6 rounded-3xl border border-[#DBD2C5] shadow-md flex flex-col justify-between space-y-4 hover:border-[#D04E2F] transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#DBD2C5]/60 pb-3">
                  <span className="font-serif font-black text-2xl text-[#D04E2F]">
                    {step.num}
                  </span>
                  <span className="text-[11px] font-serif font-bold bg-[#F9F4F0] px-2 py-1 rounded text-[#302929]/70">
                    {step.time}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-lg text-[#302929]">
                  {step.title}
                </h3>

                <p className="text-xs font-serif text-[#302929]/80 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              <div className="text-[10px] font-serif text-[#7AA093] font-bold">
                自由参加・退室可能
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
