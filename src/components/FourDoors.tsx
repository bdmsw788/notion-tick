import React, { useState } from 'react';
import { Coffee, Music, Baby, BookOpen, CheckCircle2, ArrowRight } from 'lucide-react';

interface TableContent {
  id: string;
  tabTitle: string;
  subtitle: string;
  badge: string;
  icon: React.ElementType;
  heading: string;
  description: string;
  highlights: string[];
  message: string;
  bgImage: string;
}

const TABLES: TableContent[] = [
  {
    id: 'coffee',
    tabTitle: 'テーブル① パンとコーヒー',
    subtitle: '気軽にお話し、雑談したい方へ',
    badge: '交流・カフェ・コミュニティ',
    icon: Coffee,
    heading: '焼きたてパンとドリップコーヒーを囲んで、飾らない会話を。',
    description: '評価や肩書を気にする必要はありません。日曜礼拝の後は、香ばしいパンとコーヒーを囲みながら雑談を楽しむ自由な時間を設けています（退室も完全自由です）。',
    highlights: [
      '毎食手作りの温かいパンと本格ドリップコーヒー',
      '無理な自己紹介や強要は一切なし。聞いているだけでもOK',
      '多様な生き方を尊重し、温かく見守るコミュニティ',
      'ふらっと来て、ふらっと帰れる気軽な雰囲気'
    ],
    message: '「誰かと少し話したい」「心地よい居場所を探している」そんな方の席を用意しています。',
    bgImage: '/images/fellowship_bread.jpg'
  },
  {
    id: 'music',
    tabTitle: 'テーブル② 静かな祈りと音楽',
    subtitle: '誰とも話さず、心を整えたい方へ',
    badge: '静寂・音楽・心の休息',
    icon: Music,
    heading: 'サウナやジムでは取れない、心の深い疲れを休める時間。',
    description: '日常の忙しさや人間関係の摩擦に疲れ、ひとりで静かに心をリセットしたい方のためのテーブルです。アコースティック生演奏と静かな空間で自分自身を取り戻せます。',
    highlights: [
      '一番後ろの席で静かに聴くだけの参加も大歓迎',
      'スマホの通知を切り、心を空っぽにする90分間',
      '無理に話しかけられたり囲まれたりする心配なし',
      '自由な退室・自由なペースでの参加が可能です'
    ],
    message: '「言葉にならない疲れを抱えている」そのままのあなたでお越しください。',
    bgImage: '/images/worship_service.jpg'
  },
  {
    id: 'family',
    tabTitle: 'テーブル③ 子どもと家族',
    subtitle: '泣いても笑っても大丈夫な場所',
    badge: '子育て世代・キッズフレンドリー',
    icon: Baby,
    heading: '「子どもが泣いたら…」その心配、ここにはいりません。',
    description: '子どもが元気に動いたり泣いてしまっても全く気にする必要はありません。授乳室やオムツ替えスペース、キッズスペースを完備し、親子でゆったり過ごせる環境を用意しています。',
    highlights: [
      '授乳室・オムツ替えスペース・キッズスペース完備',
      '泣いたり動いたりしても笑顔であたたかく迎える空気感',
      '毎月「子ども食堂・ファミリーカフェ」を開催',
      'ベビーカーのまま直接入れるバリアフリー設計'
    ],
    message: '「パパ・ママ自身がホッとひと息つきたい」そんなご家族の避難所です。',
    bgImage: '/images/pastor_family.jpg'
  },
  {
    id: 'bible',
    tabTitle: 'テーブル④ 聖書の言葉',
    subtitle: '人生のヒントや答えを探したい方へ',
    badge: '聖書・哲学・生き方のヒント',
    icon: BookOpen,
    heading: '2000年変わらない「生き方のヒント（いのちのパン）」に触れる。',
    description: '知識がなくても大丈夫。宗教的な専門用語を使わず、日常の悩みや人生の疑問に寄り添う短くわかりやすいお話をお届けします。',
    highlights: [
      '手ぶらでOK。貸出用聖書やプロジェクター画面で一緒に見られます',
      '信じることを強要されることは一切ありません',
      '「なぜ生きるのか」「不安とどう付き合うか」の実践的なヒント',
      '質疑応答や質問も大歓迎です'
    ],
    message: '「人生の答えや心の軸を探している」あなたの疑問を大切にします。',
    bgImage: '/images/hero_church.jpg'
  }
];

interface FourDoorsProps {
  onOpenContact: () => void;
}

export const FourDoors: React.FC<FourDoorsProps> = ({ onOpenContact }) => {
  const [activeTab, setActiveTab] = useState<string>('coffee');
  const currentTable = TABLES.find(t => t.id === activeTab) || TABLES[0];

  return (
    <section id="four-doors" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#FAF7F2] border-b border-[#E5E0D8]">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1E3D34] text-[#F59E0B] font-bold text-xs tracking-widest uppercase shadow-sm">
            <span>心が休まる 4つのテーブル</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1E3D34] tracking-tight">
            今のあなたはどの席にしますか？
          </h2>
          <p className="text-base sm:text-lg text-[#262626]/80 font-serif leading-relaxed">
            教会は「完成された人」が集まる場所ではなく、<br className="hidden sm:inline" />
            自分のペースで心を休めたい人のための食卓です。
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {TABLES.map((table) => {
            const Icon = table.icon;
            const isActive = table.id === activeTab;
            return (
              <button
                key={table.id}
                onClick={() => setActiveTab(table.id)}
                className={`p-5 rounded-2xl text-left transition-all flex flex-col justify-between border-2 ${
                  isActive
                    ? 'bg-[#1E3D34] text-white border-[#1E3D34] shadow-xl scale-[1.02]'
                    : 'bg-white text-[#262626] border-[#E5E0D8] hover:border-[#D97706]'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2.5 rounded-xl ${isActive ? 'bg-[#D97706] text-white' : 'bg-[#FAF7F2] text-[#D97706]'}`}>
                    <Icon size={22} />
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${
                    isActive ? 'bg-white/20 text-[#F59E0B]' : 'bg-[#FAF7F2] text-[#1E3D34]'
                  }`}>
                    {table.badge}
                  </span>
                </div>
                <div>
                  <div className={`text-xs font-bold mb-1 ${isActive ? 'text-amber-200' : 'text-[#D97706]'}`}>
                    {table.tabTitle}
                  </div>
                  <div className={`font-bold text-base font-serif ${isActive ? 'text-white' : 'text-[#1E3D34]'}`}>
                    {table.subtitle}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Tab Panel Card */}
        <div className="bg-white rounded-3xl border-2 border-[#E5E0D8] shadow-xl overflow-hidden transition-all duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* Left Content Area */}
            <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between space-y-8">
              <div className="space-y-6">
                
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md bg-[#F59E0B]/20 text-[#D97706] text-xs font-bold border border-[#D97706]/30">
                  <currentTable.icon size={16} />
                  <span>{currentTable.badge}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#1E3D34] leading-snug">
                  {currentTable.heading}
                </h3>

                <p className="text-[#262626]/80 text-base sm:text-lg leading-relaxed">
                  {currentTable.description}
                </p>

                {/* Highlights list */}
                <div className="space-y-3 pt-2">
                  {currentTable.highlights.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 size={20} className="text-[#1E3D34] shrink-0 mt-0.5" />
                      <span className="text-[#262626] font-bold text-sm sm:text-base">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Quote & Action */}
              <div className="pt-6 border-t border-[#E5E0D8] space-y-6">
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E5E0D8] font-serif text-[#1E3D34] text-sm sm:text-base italic leading-relaxed">
                  “{currentTable.message}”
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <button
                    onClick={onOpenContact}
                    className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#D97706] hover:bg-[#b45309] text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <span>この席について質問・相談してみる</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>

            </div>

            {/* Right Image Feature */}
            <div className="lg:col-span-5 relative min-h-[320px] lg:min-h-full overflow-hidden bg-[#E5E0D8]">
              <img 
                src={currentTable.bgImage} 
                alt={currentTable.subtitle}
                className="w-full h-full object-cover"
              />
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default FourDoors;
