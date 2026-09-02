import React, { useState } from 'react';
import { Baby, Heart, Shield, Users, ArrowRight, CheckCircle2 } from 'lucide-react';

interface Door {
  id: string;
  tag: string;
  tagBg: string;
  tagColor: string;
  title: string;
  subtitle: string;
  image: string;
  description: string;
  points: string[];
}

const DOORS: Door[] = [
  {
    id: 'family',
    tag: '扉① 子育て・ファミリー',
    tagBg: '#D04E2F',
    tagColor: '#FFFFFF',
    title: '「子どもの笑い声と歩みたい」',
    subtitle: '子育て世代・キッズフレンドリー',
    image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=800',
    description: '子どもが泣いたり動き回ったりしても大歓迎。授乳室・オムツ替えスペース完備。パパ・ママがほっとひと息つける場所です。',
    points: [
      '授乳室・オムツ替えスペース・キッズコーナー完備',
      '泣いたり走ったりしても笑顔で受け入れる温かい雰囲気',
      '毎月の子ども食堂・ファミリーカフェ開催'
    ]
  },
  {
    id: 'senior',
    tag: '扉② シニア・落ち着いた時間',
    tagBg: '#7AA093',
    tagColor: '#FFFFFF',
    title: '「人生の午後に、新しい友を」',
    subtitle: 'シニア・安心のバリアフリー',
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800',
    description: '足腰に負担のない柔らかい椅子を配置。世代を超えた温かい語らいと、静かに落ち着ける空間を用意しています。',
    points: [
      '正座不要。腰に優しい肘掛け椅子を全席完備',
      '新発田駅からのアクセス良好・送迎のご相談も可能',
      '美味しいコーヒーとお茶を飲みながら語らう時間'
    ]
  },
  {
    id: 'peace',
    tag: '扉③ 静けさ・心を整える',
    tagBg: '#302929',
    tagColor: '#FFFFFF',
    title: '「静かな場所で、自分を整えたい」',
    subtitle: '疲れ・静寂・聖書の言葉',
    image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&q=80&w=800',
    description: '日常の摩擦や仕事の疲れをリセットする避難所。会話を無理にする必要はなく、静かに音楽とメッセージに耳を傾ける90分間。',
    points: [
      '誰とも話さず静かに後ろの席で聴くだけでもOK',
      '2000年変わらない聖書の言葉がもたらす安心感',
      '自由な途中退室・自分に合わせたペース'
    ]
  },
  {
    id: 'youth',
    tag: '扉④ 若者・居場所を探す',
    tagBg: '#EDEB6A',
    tagColor: '#302929',
    title: '「枠にはまらない、自分の居場所を」',
    subtitle: '若者・学生・評価されないサードプレイス',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=800',
    description: '肩書やSNSの評価を気にせず、素の自分で居られる第3の居場所。趣味や何気ない会話を共有できます。',
    points: [
      '宗教の強制や勧誘は一切ありません',
      'フリーWi-Fi & コーヒー・作業スペースとして活用OK',
      'ふらっと来て、ふらっと帰れるオープンな空間'
    ]
  }
];

interface BunkaDoorsProps {
  onOpenContact: () => void;
}

export const BunkaDoors: React.FC<BunkaDoorsProps> = ({ onOpenContact }) => {
  const [selectedId, setSelectedId] = useState('family');
  const activeDoor = DOORS.find(d => d.id === selectedId) || DOORS[0];

  return (
    <section id="doors" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#F9F4F0] border-b border-[#DBD2C5]">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-block px-4 py-1 rounded-full bg-[#D04E2F] text-white text-xs font-serif font-bold tracking-widest uppercase">
            <span>INTERACTIVE GATEWAY</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#302929]">
            4つの扉（今のあなたはどれ？）
          </h2>
          <p className="text-base sm:text-lg font-serif text-[#302929]/80">
            あなたの「今の季節」に合わせた入り口を用意しました。気になる扉を選んでみてください。
          </p>
        </div>

        {/* 4 Doors Grid (Bunka 3:4 Aspect Ratio Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {DOORS.map((door) => {
            const isSelected = door.id === selectedId;
            return (
              <div 
                key={door.id}
                onClick={() => setSelectedId(door.id)}
                className={`bg-white rounded-3xl overflow-hidden border transition-all cursor-pointer group flex flex-col justify-between ${
                  isSelected 
                    ? 'border-[#D04E2F] shadow-2xl ring-4 ring-[#D04E2F]/20 scale-[1.02]' 
                    : 'border-[#DBD2C5] hover:border-[#D04E2F]/50 shadow-md'
                }`}
              >
                {/* Image Aspect 3:4 */}
                <div className="aspect-3-4 relative overflow-hidden bg-stone-200">
                  <img 
                    src={door.image} 
                    alt={door.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#302929]/80 via-transparent to-transparent" />
                  
                  <div className="absolute top-4 left-4">
                    <span 
                      className="text-xs font-serif font-bold px-3 py-1 rounded-full shadow"
                      style={{ backgroundColor: door.tagBg, color: door.tagColor }}
                    >
                      {door.tag}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white font-serif">
                    <h3 className="text-lg font-bold leading-tight drop-shadow-sm">
                      {door.title}
                    </h3>
                  </div>
                </div>

                <div className="p-5 font-serif text-[#302929]">
                  <p className="text-xs font-bold text-[#D04E2F] mb-1">
                    {door.subtitle}
                  </p>
                  <p className="text-xs text-[#302929]/80 line-clamp-2 leading-relaxed">
                    {door.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Door Detail Card */}
        <div className="bg-white rounded-3xl border border-[#DBD2C5] p-8 sm:p-12 shadow-xl">
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-3">
              <span 
                className="text-xs font-serif font-bold px-4 py-1.5 rounded-full"
                style={{ backgroundColor: activeDoor.tagBg, color: activeDoor.tagColor }}
              >
                {activeDoor.tag}
              </span>
              <span className="text-xs font-serif text-[#302929]/60 font-bold">
                {activeDoor.subtitle}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#302929]">
              {activeDoor.title}
            </h3>

            <p className="text-base sm:text-lg font-serif text-[#302929]/80 leading-relaxed">
              {activeDoor.description}
            </p>

            <div className="space-y-3 pt-2">
              {activeDoor.points.map((pt, i) => (
                <div key={i} className="flex items-center gap-3 font-serif text-[#302929] text-sm sm:text-base">
                  <CheckCircle2 size={18} className="text-[#D04E2F] shrink-0" />
                  <span>{pt}</span>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-[#DBD2C5]/60 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs font-serif text-[#302929]/70">
                気になることやご質問があれば、いつでもお気軽にお問い合わせください。
              </span>
              <button
                onClick={onOpenContact}
                className="px-7 py-3 rounded-full bg-[#D04E2F] text-white font-serif font-bold text-sm hover:bg-[#b03d21] transition-colors shadow-md flex items-center gap-2"
              >
                <span>この内容について質問する</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
