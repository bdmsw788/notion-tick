import React, { useState, useEffect } from 'react';
import { getNews, getMessages, getEvents } from '../lib/microcms';
import { NewsArticle, MessageItem, EventItem } from '../types/cms';
import { Calendar, Youtube, Bell, Video, Sparkles, ChevronRight, ExternalLink } from 'lucide-react';

export const CmsContent: React.FC = () => {
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
    <section id="cms-updates" className="py-24 px-4 sm:px-6 lg:px-8 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 font-bold text-xs tracking-widest uppercase">
            <span>Powered by microCMS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-900 tracking-tight">
            最新のお知らせ & メッセージ動画
          </h2>
          <p className="text-base sm:text-lg text-stone-600 font-serif leading-relaxed">
            日常の更新情報や日曜礼拝のメッセージアーカイブをお届けします。
          </p>
        </div>

        {/* CMS Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 rounded-2xl bg-stone-100 border border-stone-200 max-w-md w-full">
            <button
              onClick={() => setActiveTab('news')}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                activeTab === 'news'
                  ? 'bg-amber-700 text-white shadow-md'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Bell size={16} />
              <span>お知らせ ({newsList.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                activeTab === 'messages'
                  ? 'bg-amber-700 text-white shadow-md'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Video size={16} />
              <span>説教・動画 ({messageList.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                activeTab === 'events'
                  ? 'bg-amber-700 text-white shadow-md'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Calendar size={16} />
              <span>集会案内 ({eventList.length})</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        {loading ? (
          <div className="py-16 text-center text-stone-500 font-serif">
            データを読み込み中...
          </div>
        ) : (
          <div>
            {/* News Tab */}
            {activeTab === 'news' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {newsList.map((item) => (
                  <article 
                    key={item.id}
                    className="bg-stone-50 rounded-3xl border border-stone-200 overflow-hidden hover:shadow-xl hover:border-amber-300 transition-all flex flex-col justify-between"
                  >
                    {item.eyecatch && (
                      <div className="h-48 overflow-hidden relative">
                        <img 
                          src={item.eyecatch.url} 
                          alt={item.title} 
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-7 space-y-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-amber-100 text-amber-800">
                            {item.category}
                          </span>
                          <time className="text-xs text-stone-400 font-mono">
                            {new Date(item.publishedAt).toLocaleDateString('ja-JP')}
                          </time>
                        </div>
                        <h3 className="text-lg font-serif font-bold text-stone-900 leading-snug">
                          {item.title}
                        </h3>
                        <p className="text-stone-600 text-sm line-clamp-3 leading-relaxed">
                          {item.content}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-stone-200 text-xs font-bold text-amber-700 flex items-center justify-between">
                        <span>詳細を見る</span>
                        <ChevronRight size={14} />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* Messages / YouTube Video Tab */}
            {activeTab === 'messages' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {messageList.map((item) => (
                  <div 
                    key={item.id}
                    className="bg-stone-900 text-white rounded-3xl p-7 border border-stone-800 hover:border-amber-500 transition-all flex flex-col justify-between shadow-lg"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs text-amber-400">
                        <span className="font-mono">{item.date}</span>
                        <span className="bg-amber-950 px-2 py-0.5 rounded border border-amber-800">{item.speaker}</span>
                      </div>
                      
                      <h3 className="text-xl font-serif font-bold text-amber-100">
                        {item.title}
                      </h3>

                      <div className="text-xs font-mono bg-stone-800 p-2.5 rounded-lg text-stone-300 border border-stone-700">
                        📖 聖句: {item.bibleVerse}
                      </div>

                      <p className="text-stone-300 text-sm leading-relaxed">
                        {item.summary}
                      </p>
                    </div>

                    <div className="pt-6 mt-6 border-t border-stone-800">
                      <a
                        href={item.youtubeUrl || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md"
                      >
                        <Youtube size={18} />
                        <span>YouTubeでメッセージを聴く</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Events Tab */}
            {activeTab === 'events' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {eventList.map((item) => (
                  <div 
                    key={item.id}
                    className="bg-stone-50 rounded-3xl p-7 border border-stone-200 hover:border-amber-300 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                        <Calendar size={14} />
                        <span>{item.eventDate} ({item.time})</span>
                      </div>

                      <h3 className="text-xl font-serif font-bold text-stone-900">
                        {item.title}
                      </h3>

                      <div className="text-xs text-stone-500 font-medium">
                        📍 場所: {item.location}
                      </div>

                      <p className="text-stone-600 text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-6 mt-4 border-t border-stone-200 text-xs font-bold text-stone-500">
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
