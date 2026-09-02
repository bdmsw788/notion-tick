import React from 'react';
import { MapPin, Navigation, Car, Clock } from 'lucide-react';

export const BunkaAccess: React.FC = () => {
  return (
    <section id="access" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#F9F4F0] border-b border-[#DBD2C5]">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-block px-4 py-1 rounded-full bg-[#D04E2F] text-white text-xs font-serif font-bold tracking-widest uppercase">
            <span>LOCATION & ACCESS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#302929]">
            アクセス・駐車場案内
          </h2>
          <p className="text-base sm:text-lg font-serif text-[#302929]/80">
            新発田駅から徒歩5分。迷わずにお越しいただけるようガイドします。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          {/* Map Container */}
          <div className="lg:col-span-7 bg-white p-4 rounded-3xl border border-[#DBD2C5] shadow-xl overflow-hidden flex flex-col justify-between space-y-4">
            <div className="w-full h-[360px] rounded-2xl overflow-hidden bg-stone-200">
              <iframe 
                title="新発田いのちのパンチャーチ アクセスマップ"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12574.654516390159!2d139.3241!3d37.9482!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5f8b5fdf5f5f5f5f%3A0x0!2z44CSOTU3LTAwNTYgO-aWsOWZuu-aheaWsOWZr-W4giDvvJXkuIFn44Oq!5e0!3m2!1sja!2sjp!4v1620000000000!5m2!1sja!2sjp" 
                className="w-full h-full border-0"
                allowFullScreen={false}
                loading="lazy"
              />
            </div>
            
            <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#F9F4F0] rounded-2xl border border-[#DBD2C5]/60 font-serif">
              <div>
                <span className="text-xs font-bold text-[#D04E2F] block">所在地</span>
                <p className="font-bold text-[#302929] text-base">〒957-0000 新潟県新発田市中央町</p>
                <p className="text-xs text-[#302929]/60">JR新発田駅より徒歩5分 / タクシー約2分</p>
              </div>
              <a 
                href="https://maps.google.com/?q=新発田駅"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-full bg-[#302929] text-white text-xs font-bold hover:bg-[#D04E2F] transition-colors flex items-center gap-1.5 shrink-0 shadow"
              >
                <Navigation size={14} />
                <span>Googleマップで開く</span>
              </a>
            </div>
          </div>

          {/* Right Info Cards */}
          <div className="lg:col-span-5 space-y-6 font-serif">
            
            {/* Walk */}
            <div className="bg-white p-7 rounded-3xl border border-[#DBD2C5] shadow-md space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#D04E2F] text-white flex items-center justify-center font-bold text-lg">
                  🚶‍♂️
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#302929]">新発田駅からのルート</h3>
                  <span className="text-xs text-[#302929]/60">改札から直進徒歩約5分</span>
                </div>
              </div>
              <p className="text-xs text-[#302929]/80 leading-relaxed">
                駅改札（正面口）を出てまっすぐお進みください。木目調の看板と温かい灯りのある建物が「いのちのパンチャーチ」です。
              </p>
            </div>

            {/* Parking */}
            <div className="bg-white p-7 rounded-3xl border border-[#DBD2C5] shadow-md space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#7AA093] text-white flex items-center justify-center font-bold text-lg">
                  🚗
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#302929]">駐車場（10台完備・無料）</h3>
                  <span className="text-xs text-[#302929]/60">敷地内駐車場はすべて完全無料です</span>
                </div>
              </div>
              <p className="text-xs text-[#302929]/80 leading-relaxed">
                お車でお越しの方のために10台分の無料駐車場を用意しています。万一満車の場合でもご案内できますのでご安心ください。
              </p>
            </div>

            {/* Service Time */}
            <div className="bg-[#302929] text-white p-7 rounded-3xl shadow-xl space-y-2 border border-stone-800">
              <div className="text-xs text-[#EDEB6A] font-bold flex items-center gap-2">
                <Clock size={14} />
                <span>REGULAR SERVICES</span>
              </div>
              <h4 className="font-bold text-xl text-[#F9F4F0]">日曜礼拝: 毎週 10:30 〜 12:00</h4>
              <p className="text-xs text-stone-400">水曜祈り会: 毎週 19:30 〜 20:30</p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
