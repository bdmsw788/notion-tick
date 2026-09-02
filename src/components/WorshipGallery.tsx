import React, { useState } from 'react';
import { Play, Image as ImageIcon, Video, Sparkles, X, ChevronRight } from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  category: 'worship' | 'cafe' | 'people';
  categoryLabel: string;
  imageUrl: string;
  caption: string;
  description: string;
}

interface VideoItem {
  id: string;
  title: string;
  speakerOrMusic: string;
  duration: string;
  thumbnail: string;
  description: string;
  tag: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: '1',
    title: '生演奏の温かい音楽と賛美',
    category: 'worship',
    categoryLabel: '礼拝・賛美',
    imageUrl: '/images/worship_service.jpg',
    caption: 'アコースティックギターとピアノによる優しい音楽',
    description: '明るく木目調の礼拝堂で、アコースティックな生演奏とともに心を静める時間を過ごします。歌詞はスクリーンに投影されるので手ぶらで楽しめます。'
  },
  {
    id: '2',
    title: '陽の光が差し込む木目調の礼拝堂',
    category: 'worship',
    categoryLabel: '礼拝・賛美',
    imageUrl: '/images/hero_church.jpg',
    caption: '新発田の自然を感じる解放感あふれる空間',
    description: '大きな窓からやわらかな光が差し込む礼拝堂。自由な席に座り、日常の忙しさから離れてゆったり心をリセットできます。'
  },
  {
    id: '3',
    title: '焼きたてパンとドリップコーヒーのカフェタイム',
    category: 'cafe',
    categoryLabel: '食卓・カフェ',
    imageUrl: '/images/fellowship_bread.jpg',
    caption: '礼拝後に広がる、香ばしいパンと笑顔の食卓',
    description: '「パンと食卓」を大切にする教会です。日曜礼拝の後は美味しいコーヒーと焼きたてのパンを囲んで自由におしゃべりできます（退室も完全自由）。'
  },
  {
    id: '4',
    title: '飾らない笑顔で迎える牧師夫妻',
    category: 'people',
    categoryLabel: '牧師・コミュニティ',
    imageUrl: '/images/pastor_family.jpg',
    caption: '親しみやすく人間味あふれる温かなコミュニティ',
    description: 'DIYやアウトドア、地域交流が大好きな牧師夫妻。宗教的な重苦しさは一切なく、いつでも「おかえり」と温かく迎え入れます。'
  }
];

const VIDEO_ITEMS: VideoItem[] = [
  {
    id: 'v1',
    title: '【1分でわかる】日曜礼拝の雰囲気と音楽',
    speakerOrMusic: '礼拝アコースティックバンド',
    duration: '1:45',
    thumbnail: '/images/worship_service.jpg',
    description: '実際の礼拝で流れる賛美歌の音色や、集まる人々の温かい空気感をギュッとまとめた動画です。',
    tag: '礼拝の空気感'
  },
  {
    id: 'v2',
    title: '心がすーっと軽くなる 聖書のメッセージダイジェスト',
    speakerOrMusic: '新発田いのちのパンチャーチ 牧師',
    duration: '3:20',
    thumbnail: '/images/hero_church.jpg',
    description: '難しい専門用語は使わない「人生のヒント」となる短いお話。日常の不安や疲れにそっと寄り添います。',
    tag: 'メッセージ'
  }
];

export const WorshipGallery: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'worship' | 'cafe' | 'people'>('all');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  const filteredItems = activeFilter === 'all' 
    ? GALLERY_ITEMS 
    : GALLERY_ITEMS.filter(item => item.category === activeFilter);

  return (
    <section id="worship-gallery" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#1E3D34] text-white relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D97706] text-white font-bold text-xs tracking-widest uppercase shadow-md">
            <Sparkles size={14} className="text-amber-200 animate-pulse" />
            <span>STUDIO & GALLERY</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight text-white">
            礼拝の様子・写真＆動画スタジオ
          </h2>
          <p className="text-base sm:text-lg text-stone-200 font-serif leading-relaxed">
            教会が初めての方でも「どんな雰囲気なのか」が一目でわかる写真と動画を集めました。<br className="hidden sm:inline" />
            堅苦しい場所ではなく、笑顔と音楽、温かい食卓のある場所です。
          </p>
        </div>

        {/* Video Highlights Feature */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 rounded-xl bg-[#D97706] text-white">
              <Video size={20} />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                動画で体験する「礼拝の雰囲気」
              </h3>
              <p className="text-xs sm:text-sm text-stone-300">
                1〜3分のショート動画で、音楽や説教の雰囲気を確認できます。
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {VIDEO_ITEMS.map((video) => (
              <div 
                key={video.id}
                onClick={() => setActiveVideo(video)}
                className="group cursor-pointer bg-stone-900/90 rounded-3xl border border-stone-700 hover:border-[#D97706] transition-all overflow-hidden shadow-2xl flex flex-col justify-between"
              >
                <div className="relative aspect-video overflow-hidden bg-black">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-[#D97706] text-white flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-[#b45309] transition-all">
                      <Play size={28} className="fill-current ml-1" />
                    </div>
                  </div>
                  
                  <div className="absolute top-4 left-4 bg-[#D97706] text-white text-xs px-3 py-1 rounded-full font-bold">
                    {video.tag}
                  </div>

                  <div className="absolute bottom-4 right-4 bg-black/80 text-stone-300 text-xs px-2.5 py-1 rounded-md font-mono">
                    ⏱ {video.duration}
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div className="text-xs text-amber-300 font-bold">
                    🎵 {video.speakerOrMusic}
                  </div>
                  <h4 className="text-lg font-serif font-bold text-white group-hover:text-amber-300 transition-colors">
                    {video.title}
                  </h4>
                  <p className="text-sm text-stone-300 leading-relaxed line-clamp-2">
                    {video.description}
                  </p>
                  
                  <div className="pt-3 border-t border-stone-800 flex items-center justify-between text-xs font-bold text-[#D97706]">
                    <span>動画を再生して雰囲気をたしかめる</span>
                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Photo Gallery Showcase */}
        <div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <ImageIcon size={20} />
              </div>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                フォトギャラリー
              </h3>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-stone-800 border border-stone-700 text-xs font-bold">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-4 py-2 rounded-xl transition-all ${
                  activeFilter === 'all' ? 'bg-[#D97706] text-white shadow' : 'text-stone-400 hover:text-white'
                }`}
              >
                すべて
              </button>
              <button
                onClick={() => setActiveFilter('worship')}
                className={`px-4 py-2 rounded-xl transition-all ${
                  activeFilter === 'worship' ? 'bg-[#D97706] text-white shadow' : 'text-stone-400 hover:text-white'
                }`}
              >
                礼拝・賛美
              </button>
              <button
                onClick={() => setActiveFilter('cafe')}
                className={`px-4 py-2 rounded-xl transition-all ${
                  activeFilter === 'cafe' ? 'bg-[#D97706] text-white shadow' : 'text-stone-400 hover:text-white'
                }`}
              >
                食卓・カフェ
              </button>
              <button
                onClick={() => setActiveFilter('people')}
                className={`px-4 py-2 rounded-xl transition-all ${
                  activeFilter === 'people' ? 'bg-[#D97706] text-white shadow' : 'text-stone-400 hover:text-white'
                }`}
              >
                人々・雰囲気
              </button>
            </div>
          </div>

          {/* Photos Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedImage(item)}
                className="group cursor-pointer bg-stone-900 rounded-3xl border border-stone-800 overflow-hidden shadow-lg hover:border-[#D97706] transition-all flex flex-col justify-between"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-black">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#1E3D34] text-amber-200 text-xs px-2.5 py-1 rounded-md font-bold border border-white/20">
                    {item.categoryLabel}
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <h4 className="font-serif font-bold text-base text-white group-hover:text-amber-300 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-stone-400 line-clamp-2">
                    {item.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Lightbox Modal for Photos */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
          <div className="bg-stone-900 rounded-3xl border border-stone-700 max-w-3xl w-full overflow-hidden shadow-2xl relative">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-stone-800 text-stone-300 hover:text-white hover:bg-stone-700 transition-all z-10"
              aria-label="閉じる"
            >
              <X size={20} />
            </button>

            <div className="max-h-[60vh] overflow-hidden bg-black flex items-center justify-center">
              <img 
                src={selectedImage.imageUrl} 
                alt={selectedImage.title}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="p-8 space-y-3 bg-stone-900 text-white">
              <div className="inline-block px-3 py-1 rounded-md bg-[#D97706] text-white text-xs font-bold">
                {selectedImage.categoryLabel}
              </div>
              <h3 className="text-2xl font-serif font-bold">
                {selectedImage.title}
              </h3>
              <p className="text-stone-300 text-sm leading-relaxed">
                {selectedImage.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Video Modal Player */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
          <div className="bg-stone-900 rounded-3xl border border-stone-700 max-w-4xl w-full overflow-hidden shadow-2xl relative">
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-stone-800 text-stone-300 hover:text-white hover:bg-stone-700 transition-all z-10"
              aria-label="閉じる"
            >
              <X size={20} />
            </button>

            <div className="p-6 bg-black space-y-4">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-stone-900 border border-stone-800 flex items-center justify-center">
                <img 
                  src={activeVideo.thumbnail} 
                  alt={activeVideo.title}
                  className="w-full h-full object-cover filter brightness-75"
                />
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center p-6 text-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-[#D97706] text-white flex items-center justify-center shadow-2xl animate-pulse">
                    <Play size={36} className="fill-current ml-1" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg font-serif font-bold text-white">
                      {activeVideo.title}
                    </p>
                    <p className="text-xs text-amber-300 font-mono">
                      ※ 毎週の日曜礼拝はYouTube公式チャンネルでもライブ配信中
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-stone-900 rounded-2xl border border-stone-800 space-y-2">
                <div className="text-xs text-[#D97706] font-bold">
                  {activeVideo.tag} • {activeVideo.speakerOrMusic}
                </div>
                <h3 className="text-xl font-serif font-bold text-white">
                  {activeVideo.title}
                </h3>
                <p className="text-sm text-stone-300">
                  {activeVideo.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};

export default WorshipGallery;
