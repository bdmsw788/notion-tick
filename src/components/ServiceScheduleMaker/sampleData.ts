import { CleanScheduleData, DutyItem, Weekday } from './types';

const WEEKDAYS: Weekday[] = ['日', '月', '火', '水', '木', '金', '土'];

/**
 * 指定した年月の「日曜日」と「水曜日」を自動展開する関数
 */
export const generateMonthDuties = (year: number, month: number): DutyItem[] => {
  const daysInMonth = new Date(year, month, 0).getDate();
  const duties: DutyItem[] = [];

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month - 1, d);
    const dayOfWeek = date.getDay();

    if (dayOfWeek === 0) {
      // 日曜日
      duties.push({
        id: `duty-sun-${d}`,
        day: d,
        weekday: '日',
        serviceName: '主日礼拝',
        praiseKids: '',
        sermon: '',
        leader: '',
        music: '',
        drums: '',
        ppt: '',
        reception: '',
        prayer: '',
        notes: '',
      });
    } else if (dayOfWeek === 3) {
      // 水曜日
      duties.push({
        id: `duty-wed-${d}`,
        day: d,
        weekday: '水',
        serviceName: '祈祷会',
        praiseKids: '',
        sermon: '',
        leader: '',
        music: '',
        drums: '',
        ppt: '',
        reception: '',
        prayer: '',
        notes: '',
      });
    }
  }

  return duties.sort((a, b) => a.day - b.day);
};

/**
 * 2026年8月の初期マスターデータ（完全版）
 */
export const defaultAugust2026: CleanScheduleData = {
  year: 2026,
  month: 8,
  churchName: '新発田いのちのパンチャーチ',
  docTitle: '奉仕表 & 月間予定',
  sidebar: {
    themeYear: '2026年度 教会テーマ',
    themeText: '「ここは荒野。\n〜主と出会い、ともに成長できる場所〜」',
    scriptureRef: '2026年度 テーマ聖句（申命記8章3節）',
    scriptureText:
      'それで主はあなたを苦しめ、飢えさせて、あなたも知らず、あなたの父祖たちも知らなかったマナを食べさせてくださった。それは、人はパンだけで生きるのではなく、人は主の御口から出るすべてのことばで生きるということを、あなたに分からせるためであった。',
    newsTitle: '前月のニュース',
    newsText:
      '新潟グレイスチャペルで夫婦セミナーが開催されました！「私たちは自分の心の愚痴しか変えられず、人の心を変えるのは神の働き。私と神との関係が正しく結ばれていたら、相手は変わる。」これは夫婦関係のみならず人間関係全般で大切です。アーカイブが残っていますので、ぜひお時間あるときにご視聴ください♪',
    prayerRequests: [
      '教会メンバーの守りと祝福のため',
      '牧師家族の守りと祝福のため',
      '地域と魂の救いのため',
    ],
    memoTitle: '一言メモ',
    memoText:
      '今年はカブトムシの卵をいただき育ててみることに！お世話して見守ると幼虫から蛹になり、ついに2匹とも立派な成虫になって元気に動き始めました！「成長させたのは神です」の御言葉を深く思い起こす感謝なときとなりました！',
  },
  events: [
    {
      id: 'e-1',
      dateText: '月〜金 毎朝',
      title: 'オンライン早天祈祷',
      detail: '6:00 - 6:30 （Zoomにて配信）',
      isHighlight: true,
    },
    {
      id: 'e-2',
      dateText: '8/2 (日)',
      title: '聖嗣師 群馬教会にて奉仕',
      detail: '※新潟グレイスチャペル牧職の先生による特別説教',
    },
    {
      id: 'e-3',
      dateText: '8/10 (月)',
      title: '教会ミーティング',
      detail: '13:30 - 15:00 ◎リード: 井上師',
    },
    {
      id: 'e-4',
      dateText: '8/11 (火祝)',
      title: '子どもプログラム「教会で遊ぼうスペシャル」デイキャンプ',
      detail: '10:00 - 14:00 （藤沢オリーブチャペルチーム協力）',
      isHighlight: true,
    },
    {
      id: 'e-5',
      dateText: '8/17 (月)',
      title: '学び会『賢者の生活リズム』',
      detail: '13:30 - 15:00 教会ホールにて',
    },
    {
      id: 'e-6',
      dateText: '8/20 (木)',
      title: 'シニアの会',
      detail: '10:00〜 （お茶と賛美の交わり）',
    },
    {
      id: 'e-7',
      dateText: '8/25(火)〜27(木)',
      title: 'CBCキャンプ 聖嗣師不在（東京・駒込神学校）',
      detail: '※ 8/26(水)の祈祷会はお休みとなります',
      isHighlight: true,
    },
    {
      id: 'e-8',
      dateText: '8/31 (月)',
      title: '8月 お誕生会 ＆ 愛餐会',
      detail: '主日礼拝終了後に行います',
    },
  ],
  regularNotice: '【定期集会案内】 毎週水曜 10:30 / 19:30 祈祷会 ｜ 毎週金曜 10:00 掃除 ｜ 毎週日曜 10:30 主日礼拝',
  duties: [
    {
      id: 'd-1',
      day: 2,
      weekday: '日',
      serviceName: 'リバイバル礼拝',
      praiseKids: '',
      sermon: '新潟グレイスチャペル牧職の先生',
      leader: '',
      music: '',
      drums: '',
      ppt: '荒木',
      reception: '須藤',
      prayer: '荒木',
      notes: '★聖餐式',
    },
    {
      id: 'd-2',
      day: 5,
      weekday: '水',
      serviceName: '祈祷会 (10:30/19:30)',
      praiseKids: '',
      sermon: '井上師/吉田',
      leader: '井上師',
      music: '',
      drums: 'すみれ師',
      ppt: '荒木',
      reception: '須藤',
      prayer: '',
      notes: '',
    },
    {
      id: 'd-3',
      day: 9,
      weekday: '日',
      serviceName: 'ウェルカム礼拝',
      praiseKids: '吉田',
      sermon: '井上師',
      leader: 'すみれ師',
      music: '',
      drums: '荒木',
      ppt: '吉田',
      reception: '須藤',
      prayer: 'すみれ師',
      notes: '★愛餐会',
    },
    {
      id: 'd-4',
      day: 12,
      weekday: '水',
      serviceName: '祈祷会 (10:30/19:30)',
      praiseKids: '',
      sermon: '井上師/吉田',
      leader: 'すみれ師',
      music: '',
      drums: '荒木',
      ppt: '吉田',
      reception: '須藤',
      prayer: '',
      notes: '',
    },
    {
      id: 'd-5',
      day: 16,
      weekday: '日',
      serviceName: '主日礼拝',
      praiseKids: '吉田',
      sermon: 'すみれ師',
      leader: '吉田',
      music: '井上師(G)',
      drums: '荒木',
      ppt: '須藤',
      reception: '須藤',
      prayer: '須藤',
      notes: '★愛餐会',
    },
    {
      id: 'd-6',
      day: 19,
      weekday: '水',
      serviceName: '祈祷会 (10:30/19:30)',
      praiseKids: '',
      sermon: '井上師/吉田',
      leader: 'すみれ師',
      music: 'の(Vn)',
      drums: '荒木',
      ppt: '須藤',
      reception: '',
      prayer: '',
      notes: '',
    },
    {
      id: 'd-7',
      day: 23,
      weekday: '日',
      serviceName: '主日礼拝',
      praiseKids: '吉田',
      sermon: '井上師',
      leader: 'すみれ師',
      music: 'の(Vn)',
      drums: '荒木',
      ppt: '吉田',
      reception: '須藤',
      prayer: '荒木',
      notes: '★愛餐会',
    },
    {
      id: 'd-8',
      day: 26,
      weekday: '水',
      serviceName: '祈祷会（休会）',
      praiseKids: '',
      sermon: '（CBCキャンプのためお休み）',
      leader: '',
      music: '',
      drums: '',
      ppt: '',
      reception: '',
      prayer: '',
      notes: '休会',
    },
    {
      id: 'd-9',
      day: 30,
      weekday: '日',
      serviceName: 'アシュラム礼拝',
      praiseKids: '吉田',
      sermon: '井上師',
      leader: '吉田',
      music: '井上師(G)',
      drums: '荒木',
      ppt: '須藤',
      reception: 'すみれ師',
      prayer: '',
      notes: '★愛餐会 ★誕生会',
    },
  ],
  memberPresets: [
    '吉田',
    '井上師',
    'すみれ師',
    '荒木',
    '須藤',
    'の',
    '新潟グレイスチャペル牧職の先生',
  ],
};
