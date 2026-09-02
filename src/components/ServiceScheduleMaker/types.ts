export type Weekday = '日' | '月' | '火' | '水' | '木' | '金' | '土';

export interface DutyItem {
  id: string;
  day: number; // 2, 5, 9, 12, 16, 19, 23, 26, 30
  weekday: Weekday;
  serviceName: string; // 主日礼拝, 祈祷会, リバイバル礼拝, ウェルカム礼拝, アシュラム礼拝 など
  praiseKids?: string; // パンきっず
  sermon?: string; // 説教
  leader?: string; // 司会
  music?: string; // ピアノ/奏楽
  drums?: string; // ドラム/カホン
  ppt?: string; // PPT
  reception?: string; // 受付
  prayer?: string; // 祈祷
  notes?: string; // 備考（★聖餐式, ★愛餐会, ★お誕生会 など）
}

export interface EventItem {
  id: string;
  dateText: string; // "月〜金 毎朝", "8/2(日)", "8/11(火祝)", "8/25(火)〜27(木)"
  title: string; // "オンライン早天祈祷", "子どもプログラム「教会で遊ぼう」", "CBCキャンプ"
  detail?: string; // "6:00-6:30", "10:00-14:00 @教会", "聖嗣師不在"
  isHighlight?: boolean;
}

export interface SidebarData {
  themeYear: string; // 2026年度
  themeText: string; // 「ここは荒野。〜主と出会い、ともに成長できる場所〜」
  scriptureRef: string; // 申命記8章 3節
  scriptureText: string; // 聖句本文
  newsTitle: string; // 前月のニュース
  newsText: string; // 前月ニュース本文
  prayerRequests: string[]; // 祈祷課題
  memoTitle: string; // 一言メモ
  memoText: string; // 一言メモ本文
}

export interface CleanScheduleData {
  year: number;
  month: number;
  churchName: string;
  docTitle: string;
  sidebar: SidebarData;
  events: EventItem[];
  regularNotice: string;
  duties: DutyItem[];
  memberPresets: string[];
}
