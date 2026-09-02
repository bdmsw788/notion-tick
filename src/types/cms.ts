export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  category: 'お知らせ' | 'イベント' | '礼拝説教' | 'レポート';
  publishedAt: string;
  eyecatch?: {
    url: string;
    height?: number;
    width?: number;
  };
}

export interface MessageItem {
  id: string;
  title: string;
  speaker: string;
  date: string;
  bibleVerse: string;
  summary: string;
  youtubeUrl?: string;
  audioUrl?: string;
}

export interface EventItem {
  id: string;
  title: string;
  eventDate: string;
  time: string;
  location: string;
  description: string;
  image?: string;
  target?: string;
}

export interface MicroCMSResponse<T> {
  contents: T[];
  totalCount: number;
  offset: number;
  limit: number;
}
