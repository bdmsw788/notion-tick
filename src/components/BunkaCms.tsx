import React, { useState, useEffect } from 'react';
import { getNews, getMessages, getEvents } from '../lib/microcms';
import { NewsArticle, MessageItem, EventItem } from '../types/cms';
import { Bell, Video, Calendar, Youtube, ChevronRight } from 'lucide-react';

export const BunkaCms: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'news' | 'messages' | 'events'>('news');
  const [newsList, setNewsList] = useState<NewsArticle[]>([]);
  const [messageList, setMessageList] = useState<MessageItem[]>([]);
  const [eventList, setEventList] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCMSData() {
      try {
        setLoading(true);
        const [newsData, msgData, evtData] = await Promise.all([
          getNews(),
          getMessages(),
          getEvents()
        ]);
        setNewsList(newsData);
        setMessageList(msgData);
        setEventList(evtData);
      } catch (err) {
        console.error("Error loading microCMS content:", err);
      } finally {
        setLoading(false);
      }
    }
    loadCMSData();
  }, []);

  return (
    <section id="cms" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#F9F4F0] border-b border-[#DBD2C5]">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-block px-4 py-1 rounded-full bg-[#7AA093] text-white text-xs font-serif font-bold tracking-widest uppercase">
            <span>Powered by microCMS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#302929]">
            最新のお知らせ & メッセージ動画
          </h2>
          <p className="text-base sm:text-lg font-serif text-[#302929]/80">
            日常の更新情報や日曜説教動画をお届けします。
          </p>
        </div>

        {/* CMS Tabs (Bunka Style) */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 rounded-full bg-white border border-[#DBD2C5] max-w-md w-full shadow-sm">
            <button
              onClick={() => setActiveTab('news')}
              className={`flex-1 py-2.5 px-4 rounded-full font-serif font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                activeTab === 'news'
                  ? 'bg-[#D04E2F] text-white shadow-md'
                  : 'text-[#302929] hover:text-[#D04E2F]'
              }`}
            >
              <Bell size={14} />
              <span>お知らせ</span>
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`flex-1 py-2.5 px-4 rounded-full font-serif font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                activeTab === 'messages'
                  ? 'bg-[#D04E2F] text-white shadow-md'
                  : 'text-[#302929] hover:text-[#D04E2F]'
              }`}
            >
              <Video size={14} />
              <span>説教動画</span>
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`flex-1 py-2.5 px-4 rounded-full font-serif font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                activeTab === 'events'
                  ? 'bg-[#D04E2F] text-white shadow-md'
                  : 'text-[#302929] hover:text-[#D04E2F]'
              }`}
            >
              <Calendar size={14} />
              <span>集会案内</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        {loading ? (
          <div className="py-12 text-center font-serif text-[#302929]/60">
            データを読み込み中...
          </div>
        ) : (
          <div>
            {/* News */}
            {activeTab === 'news' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {newsList.map((item) => (
                  <article 
                    key={item.id}
                    className="bg-white rounded-3xl border border-[#DBD2C5] overflow-hidden hover:shadow-xl hover:border-[#D04E2F] transition-all flex flex-col justify-between"
                  >
                    {item.eyecatch && (
                      <div className="aspect-4-3 overflow-hidden relative bg-stone-200">
                        <img 
                          src={item.eyecatch.url} 
                          alt={item.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
                        />
                      </div>
                    )}
                    <div className="p-6 space-y-4 font-serif flex-1 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold px-2.5 py-0.5 rounded-full bg-[#D04E2F]/10 text-[#D04E2F]">
                            {item.category}
                          </span>
                          <time className="text-[#302929]/50 font-mono">
                            {new Date(item.publishedAt).toLocaleDateString('ja-JP')}
                          </time>
                        </div>
                        <h3 className="text-lg font-bold text-[#302929] leading-snug">
                          {item.title}
                        </h3>
                        <p className="text-xs text-[#302929]/80 line-clamp-3 leading-relaxed">
                          {item.content}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-[#DBD2C5]/60 text-xs font-bold text-[#D04E2F] flex items-center justify-between">
                        <span>詳細を見る</span>
                        <ChevronRight size={14} />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* Messages / YouTube */}
            {activeTab === 'messages' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {messageList.map((item) => (
                  <div 
                    key={item.id}
                    className="bg-[#302929] text-white rounded-3xl p-7 shadow-xl border border-stone-800 flex flex-col justify-between font-serif"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs text-[#EDEB6A]">
                        <span className="font-mono">{item.date}</span>
                        <span className="bg-stone-800 px-2 py-0.5 rounded border border-stone-700">{item.speaker}</span>
                      </div>

                      <h3 className="text-xl font-bold text-[#F9F4F0]">
                        {item.title}
                      </h3>

                      <div className="text-xs font-mono bg-stone-800/80 p-2.5 rounded-xl text-stone-300 border border-stone-700">
                        📖 聖句: {item.bibleVerse}
                      </div>

                      <p className="text-xs text-stone-300 leading-relaxed">
                        {item.summary}
                      </p>
                    </div>

                    <div className="pt-6 mt-6 border-t border-stone-800">
                      <a 
                        href={item.youtubeUrl || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow"
                      >
                        <Youtube size={16} />
                        <span>YouTubeでメッセージを聴く</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Events */}
            {activeTab === 'events' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {eventList.map((item) => (
                  <div 
                    key={item.id}
                    className="bg-white rounded-3xl p-7 border border-[#DBD2C5] shadow-md font-serif flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div className="inline-block px-3 py-1 rounded-full bg-[#7AA093] text-white text-xs font-bold">
                        {item.eventDate} ({item.time})
                      </div>

                      <h3 className="text-xl font-bold text-[#302929]">
                        {item.title}
                      </h3>

                      <div className="text-xs text-[#302929]/70 font-bold">
                        📍 {item.location}
                      </div>

                      <p className="text-xs text-[#302929]/80 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-[#DBD2C5]/60 text-xs font-bold text-[#302929]/60">
                      対象: {item.target || 'どなたでも'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
};
