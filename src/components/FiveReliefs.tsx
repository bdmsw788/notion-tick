import React from 'react';
import { Shirt, Book, Coins, ShieldAlert, HeartHandshake, CheckCircle2 } from 'lucide-react';

const RELIEFS = [
  {
    icon: Shirt,
    title: '服装は自由です',
    subtitle: 'いつもの私服で十分です',
    desc: 'スーツやフォーマルな服を着る必要は全くありません。買い物や散歩に行く時のような、ごく普通の私服でお気軽にお越しください。'
  },
  {
    icon: Book,
    title: '手ぶらでお越しください',
    subtitle: '事前準備・持ち物はゼロでOK',
    desc: '聖書や歌集など、必要なものはすべて教会で貸し出します。聖書の知識がなくても、スクリーンや貸出用の聖書で一緒に見ることができます。'
  },
  {
    icon: Coins,
    title: '献金は完全自由です',
    subtitle: '初めての方はパスしてOK',
    desc: '入場料や参加費はありません。礼拝の中に神様への感謝としての「献金」の時間がありますが、初めての方はそのまま隣へ回していただいて全く問題ありません。'
  },
  {
    icon: ShieldAlert,
    title: 'しつこい勧誘は一切ありません',
    subtitle: '入会や信仰の強要はありません',
    desc: '教会は「信じる前に、来ていい」場所です。個人情報を無理に書かせたり、定期的な参加を強要したり、しつこく連絡をすることは絶対にありません。'
  },
  {
    icon: HeartHandshake,
    title: 'お一人でも、お子様連れでも',
    subtitle: 'どなたでも大歓迎します',
    desc: '一人で静かに参加される方も、ご家族や友人と一緒に来られる方もたくさんいらっしゃいます。どなたでも居心地のよい席を用意しています。'
  }
];

export const FiveReliefs: React.FC = () => {
  return (
    <section id="reliefs" className="py-24 px-4 sm:px-6 lg:px-8 bg-white border-b border-[#E5E0D8]">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1E3D34] text-amber-200 font-bold text-xs tracking-widest uppercase shadow-sm">
            <span>5つの安心ガイド</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1E3D34] tracking-tight">
            教会に行く前の「不安」を<br className="hidden sm:inline" />ここで全部なくします。
          </h2>
          <p className="text-base sm:text-lg text-[#262626]/80 font-serif leading-relaxed">
            初めての場所に行くときの不安や警戒心をあらかじめ解消するために、<br className="hidden sm:inline" />
            教会のオープンな姿勢と基本方針をお約束します。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {RELIEFS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="bg-[#FAF7F2] p-8 rounded-3xl border-2 border-[#E5E0D8] hover:border-[#D97706] transition-all duration-300 flex flex-col justify-between group shadow-sm"
              >
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#1E3D34] text-white flex items-center justify-center font-bold text-xl shadow-sm">
                    <Icon size={28} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#D97706] block mb-1">
                      {item.subtitle}
                    </span>
                    <h3 className="text-xl font-serif font-bold text-[#1E3D34]">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-[#262626]/80 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[#E5E0D8] flex items-center gap-2 text-xs font-bold text-[#1E3D34]">
                  <CheckCircle2 size={16} />
                  <span>安心のお約束対象</span>
                </div>
              </div>
            );
          })}

          {/* 6th Card: Credo Callout */}
          <div className="bg-[#1E3D34] p-8 rounded-3xl text-white flex flex-col justify-between shadow-xl border-2 border-stone-800">
            <div className="space-y-4">
              <span className="text-xs font-bold text-[#F59E0B] tracking-widest uppercase block">
                OUR CREDO
              </span>
              <h3 className="text-2xl font-serif font-bold leading-snug text-white">
                「完璧な人は一人もいません。安心していらしてください。」
              </h3>
              <p className="text-stone-300 text-sm leading-relaxed">
                私たちは正しさやルールを押し付ける場所ではありません。人生の様々な途上において、共に休み、励まし合う新発田のコミュニティです。
              </p>
            </div>
            <div className="pt-6 font-serif text-[#F59E0B] text-xs italic">
              — 新発田いのちのパンチャーチ メンバー一同
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default FiveReliefs;
