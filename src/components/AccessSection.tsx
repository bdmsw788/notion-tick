import React from 'react';
import { MapPin, Navigation, Car, Clock, Phone, Mail, ExternalLink, CheckCircle2 } from 'lucide-react';

export const AccessSection: React.FC = () => {
  return (
    <section id="access" className="py-24 px-4 sm:px-6 lg:px-8 bg-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 font-bold text-xs tracking-widest uppercase">
            <span>Location & Access Guide</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-900 tracking-tight">
            アクセス・駐車場案内
          </h2>
          <p className="text-base sm:text-lg text-stone-600 font-serif leading-relaxed">
            新発田駅から徒歩圏内。迷わずに安心してお越しいただけるよう、<br className="hidden sm:inline" />
            道順や駐車場の位置、入口写真を案内します。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          {/* Map & Google Map Embed mockup / iFrame */}
          <div className="lg:col-span-7 bg-white p-4 rounded-3xl border border-stone-200 shadow-xl overflow-hidden flex flex-col justify-between space-y-4">
            <div className="w-full h-[360px] rounded-2xl overflow-hidden relative bg-stone-200">
              <iframe 
                title="新発田いのちのパンチャーチ アクセスマップ"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12574.654516390159!2d139.3241!3d37.9482!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5f8b5fdf5f5f5f5f%3A0x0!2z44CSOTU3LTAwNTYgO-aWsOWZuu-aheaWsOWZr-W4giDvvJXkuIFn44Oq!5e0!3m2!1sja!2sjp!4v1620000000000!5m2!1sja!2sjp" 
                className="w-full h-full border-0"
                allowFullScreen={false}
                loading="lazy"
              />
            </div>
            
            <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-stone-50 rounded-2xl border border-stone-100">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-xs font-bold text-amber-700">教会所在地</span>
                <p className="font-bold text-stone-900 text-base">〒957-0000 新潟県新発田市中央町</p>
                <p className="text-xs text-stone-500">JR新発田駅より徒歩5分 / タクシー約2分</p>
              </div>
              <a
                href="https://maps.google.com/?q=新発田駅"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-full bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition-colors flex items-center gap-1.5 shrink-0"
              >
                <Navigation size={14} />
                <span>Googleマップで開く</span>
              </a>
            </div>
          </div>

          {/* Detailed Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* By Train / Walk */}
            <div className="bg-white p-7 rounded-3xl border border-stone-200 shadow-md space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  🚶‍♂️
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-stone-900">新発田駅からの徒歩ルート</h3>
                  <span className="text-xs text-stone-500">駅から徒歩約5分・分かりやすい直進ルート</span>
                </div>
              </div>
              <ul className="space-y-2 text-stone-600 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-amber-700 shrink-0 mt-0.5" />
                  <span>JR新発田駅の改札（正面口）を出てまっすぐ進みます。</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-amber-700 shrink-0 mt-0.5" />
                  <span>最初の交差点を右折し、目印の看板の通りに進みます。</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-amber-700 shrink-0 mt-0.5" />
                  <span>木目調の看板と温かい照明の建物が「いのちのパンチャーチ」です。</span>
                </li>
              </ul>
            </div>

            {/* By Car / Parking */}
            <div className="bg-white p-7 rounded-3xl border border-stone-200 shadow-md space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  🚗
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-stone-900">お車でお越しの方（駐車場10台）</h3>
                  <span className="text-xs text-stone-500">敷地内駐車場はすべて無料です</span>
                </div>
              </div>
              <p className="text-stone-600 text-sm leading-relaxed">
                教会の敷地内に10台分の無料駐車場を完備しています。満車の場合でも近隣の提携パーキングをご案内できますので、スタッフに声をおかけください。
              </p>
            </div>

            {/* Worship Times */}
            <div className="bg-amber-900 text-white p-7 rounded-3xl shadow-md space-y-3">
              <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
                <Clock size={16} />
                <span>REGULAR SERVICES</span>
              </div>
              <div className="space-y-1">
                <h4 className="font-serif font-bold text-xl text-white">日曜礼拝: 毎週 10:30 〜 12:00</h4>
                <p className="text-stone-300 text-xs">水曜祈り会: 毎週 19:30 〜 20:30</p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
