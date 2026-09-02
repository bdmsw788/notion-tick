import React from 'react';
import { Shirt, Book, Coins, ShieldAlert, HeartHandshake, Check } from 'lucide-react';

const RELIEFS = [
  {
    badge: '安心 01',
    title: '服装は自由です',
    subtitle: 'いつもの私服で十分です',
    desc: 'スーツを着る必要は一切ありません。お買い物に行くときのような、ごく普通の私服でお越しください。'
  },
  {
    badge: '安心 02',
    title: '手ぶらでお越しください',
    subtitle: '聖書も歌集もすべて貸出あり',
    desc: '事前準備や持ち物はゼロでOKです。聖書はすべて教会で貸し出しますし、スクリーンにも映し出されます。'
  },
  {
    badge: '安心 03',
    title: '献金は完全自由です',
    subtitle: '初めての方はパスしてOK',
    desc: '入場料や参加費はありません。礼拝中に献金カゴが回ってきますが、初めての方は隣へそのまま回していただいてOKです。'
  },
  {
    badge: '安心 04',
    title: 'しつこい勧誘なし',
    subtitle: '入会や信仰の強要はありません',
    desc: '「信じる前に、来ていい」場所です。名前や住所の記入を無理強いしたり、しつこく連絡をすることは絶対にありません。'
  },
  {
    badge: '安心 05',
    title: 'お一人でも子連れでも',
    subtitle: 'どなたでも大歓迎します',
    desc: '一人で静かに参加される方も、ご家族や友人と一緒に来られる方もたくさんいらっしゃいます。'
  }
];

export const BunkaReliefs: React.FC = () => {
  return (
    <section id="reliefs" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#F9F4F0] border-b border-[#DBD2C5]">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-block px-4 py-1 rounded-full bg-[#7AA093] text-white text-xs font-serif font-bold tracking-widest uppercase">
            <span>CHURCH MANUAL & RELIEFS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#302929]">
            教会に行く前の「わからない」を<br className="hidden sm:inline" />ここで全部なくします。
          </h2>
          <p className="text-base sm:text-lg font-serif text-[#302929]/80">
            不安や警戒心をあらかじめ取り除き、安心して足を運んでいただくための基本方針です。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {RELIEFS.map((item, idx) => (
            <div 
              key={idx}
              className="bg-white p-8 rounded-3xl border border-[#DBD2C5] shadow-md hover:shadow-xl hover:border-[#D04E2F] transition-all flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="inline-block px-3 py-1 rounded-md bg-[#D04E2F] text-white font-serif font-bold text-xs tracking-wider">
                  {item.badge}
                </div>
                
                <div>
                  <span className="text-xs font-serif font-bold text-[#7AA093] block mb-1">
                    {item.subtitle}
                  </span>
                  <h3 className="text-xl font-serif font-bold text-[#302929]">
                    {item.title}
                  </h3>
                </div>

                <p className="text-sm font-serif text-[#302929]/80 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-[#DBD2C5]/60 flex items-center gap-2 text-xs font-serif font-bold text-[#D04E2F]">
                <Check size={16} />
                <span>安心のお約束</span>
              </div>
            </div>
          ))}

          {/* Special Credo Stamp Card */}
          <div className="bg-[#302929] text-white p-8 rounded-3xl shadow-xl flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-xs font-serif font-bold text-[#EDEB6A] tracking-widest uppercase block">
                OUR CREDO
              </span>
              <h3 className="text-2xl font-serif font-bold leading-snug text-white">
                「完璧な人は一人もいません。安心していらしてください。」
              </h3>
              <p className="text-sm font-serif text-stone-300 leading-relaxed">
                正しさやルールを押し付ける場所ではありません。人生の途上で共に休み、励まし合う温かいコミュニティです。
              </p>
            </div>
            <div className="text-xs font-serif text-[#DBD2C5] italic pt-4 border-t border-stone-700">
              — 新発田いのちのパンチャーチ
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
