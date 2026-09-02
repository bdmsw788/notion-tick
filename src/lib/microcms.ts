import { NewsArticle, MessageItem, EventItem, MicroCMSResponse } from '../types/cms';

const SERVICE_DOMAIN = import.meta.env.VITE_MICROCMS_SERVICE_DOMAIN || '';
const API_KEY = import.meta.env.VITE_MICROCMS_API_KEY || '';

// モックデータ (microCMS未設定時のフォールバック用)
export const MOCK_NEWS: NewsArticle[] = [
  {
    id: 'news-1',
    title: '【お知らせ】初めての方のための日曜カフェタイムがリニューアルしました',
    content: '礼拝後の12:00から開催しているカフェタイムにて、焼きたてのパンとこだわりのドリップコーヒーをご用意しています。どなたでもご自由にご参加いただけます（参加無料）。',
    category: 'お知らせ',
    publishedAt: '2026-07-28T10:00:00.000Z',
    eyecatch: {
      url: '/images/bread_community.jpg'
    }
  },
  {
    id: 'news-2',
    title: '8月 夏のオープンチャーチ＆子ども食堂のご案内',
    content: '子どもから大人までどなたでも気軽に立ち寄れるオープンデーです。気軽においしいお昼ごはんを食べながら、涼しい空間でゆっくりお過ごしください。',
    category: 'イベント',
    publishedAt: '2026-07-20T14:30:00.000Z'
  },
  {
    id: 'news-3',
    title: '水曜 祈り会・心を整える時間のご案内（毎週19:30〜）',
    content: '週の半ば、仕事や生活で疲れた心をリセットする静かな30分間です。途中参加・途中退室自由です。',
    category: 'お知らせ',
    publishedAt: '2026-07-15T09:00:00.000Z'
  }
];

export const MOCK_MESSAGES: MessageItem[] = [
  {
    id: 'msg-1',
    title: '「重荷を降ろして、ひと息つく場所」',
    speaker: '新発田いのちのパンチャーチ 牧師',
    date: '2026-07-26',
    bibleVerse: 'マタイの福音書 11章28節',
    summary: '「すべて疲れた人、重荷を負っている人はわたしのもとに来なさい。わたしがあなたがたを休ませてあげます。」が教える本当の安らぎについて。',
    youtubeUrl: 'https://www.youtube.com/watch?v=example1'
  },
  {
    id: 'msg-2',
    title: '「パン屋じゃない、でも心が満たされる理由」',
    speaker: '新発田いのちのパンチャーチ 牧師',
    date: '2026-07-19',
    bibleVerse: 'ヨハネの福音書 6章35節',
    summary: '物質的な豊かさの中でも感じる「心の空腹」。聖書が語る変わらない希望と人生の土台について。',
    youtubeUrl: 'https://www.youtube.com/watch?v=example2'
  },
  {
    id: 'msg-3',
    title: '「そのままのあなたで歩む一歩」',
    speaker: '新発田いのちのパンチャーチ 牧師',
    date: '2026-07-12',
    bibleVerse: '詩篇 23篇1-3節',
    summary: '完璧になろうと焦る日々に、飾らない自分を受け入れてくれる場所と愛のメッセージ。',
    youtubeUrl: 'https://www.youtube.com/watch?v=example3'
  }
];

export const MOCK_EVENTS: EventItem[] = [
  {
    id: 'event-1',
    title: '日曜礼拝（心を整える時間）',
    eventDate: '毎週日曜日',
    time: '10:30 〜 12:00',
    location: '新発田いのちのパンチャーチ 礼拝堂',
    description: '賛美歌の音楽と、分かりやすい聖書のメッセージ。初めての方も予約不要で私服のままお気軽にお越しいただけます。',
    target: 'どなたでも大歓迎'
  },
  {
    id: 'event-2',
    title: '水曜 祈り会',
    eventDate: '毎週水曜日',
    time: '19:30 〜 20:30',
    location: '教会アトリウム / オンライン配信あり',
    description: '静かな音楽の中で心を落ち着かせ、自分自身や家族、地域の平和のために祈る時間です。',
    target: '静かな時間を過ごしたい方'
  },
  {
    id: 'event-3',
    title: '子育てファミリー応援カフェ＆子ども食堂',
    eventDate: '毎月第2土曜日',
    time: '11:30 〜 14:00',
    location: '教会ホール',
    description: 'ベビーカーOK、キッズスペース完備。子育て中のパパ・ママが息抜きできるアットホームなコミュニティです。',
    target: '未就学児〜小中学生のファミリー'
  }
];

// 汎用microCMS fetch関数
async function fetchMicroCMS<T>(endpoint: string): Promise<T[]> {
  if (!SERVICE_DOMAIN || !API_KEY) {
    console.info(`[microCMS] API key or domain missing. Using fallback mock data for '${endpoint}'.`);
    if (endpoint === 'news') return MOCK_NEWS as unknown as T[];
    if (endpoint === 'messages') return MOCK_MESSAGES as unknown as T[];
    if (endpoint === 'events') return MOCK_EVENTS as unknown as T[];
    return [];
  }

  try {
    const res = await fetch(
      `https://${SERVICE_DOMAIN}.microcms.io/api/v1/${endpoint}`,
      {
        headers: {
          'X-MICROCMS-API-KEY': API_KEY,
        },
      }
    );
    if (!res.ok) {
      throw new Error(`microCMS fetch error: ${res.statusText}`);
    }
    const data: MicroCMSResponse<T> = await res.json();
    return data.contents;
  } catch (err) {
    console.error(`[microCMS] Error fetching '${endpoint}', falling back to mock data:`, err);
    if (endpoint === 'news') return MOCK_NEWS as unknown as T[];
    if (endpoint === 'messages') return MOCK_MESSAGES as unknown as T[];
    if (endpoint === 'events') return MOCK_EVENTS as unknown as T[];
    return [];
  }
}

export async function getNews(): Promise<NewsArticle[]> {
  return fetchMicroCMS<NewsArticle>('news');
}

export async function getMessages(): Promise<MessageItem[]> {
  return fetchMicroCMS<MessageItem>('messages');
}

export async function getEvents(): Promise<EventItem[]> {
  return fetchMicroCMS<EventItem>('events');
}
