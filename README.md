# 新発田いのちのパンチャーチ 公式ウェブサイト (リニューアル版)

![Shibata Bread of Life Church](public/images/hero_church.jpg)

新発田いのちのパンチャーチ（Shibata Bread of Life Church）の公式リニューアルWebアプリケーションです。

> **「パン屋じゃない。でも、心が空腹な人のための場所。」**  
> **「信じる前に、来ていい。」**

「教会に興味はあるけれど少し怖そう」「何をするのかわからない」という未信者の方々の心理的ハードルを徹底的に下げ、温かく安心して一歩を踏み出せる「招待装置」として設計されています。

---

## 🌟 特長と主要コンテンツ

1. **4つの扉（パーソナライズ導線）**
   - 子育て世代・シニア・静けさを求める方・居場所を探す若者それぞれに向けたインタラクティブなコンテンツ切替。
2. **5つの安心（教会のトリセツ）**
   - 服装自由 / 手ぶらOK / 献金完全自由 / 勧誘なし / 子連れ・一人参加大歓迎の透明化。
3. **日曜90分体験のタイムライン**
   - 10:30〜12:00の流れ（音楽・聖書メッセージ・カフェタイム）をステップバイステップで解説。
4. **microCMS リアルタイム動的更新**
   - お知らせ・ニュース、説教動画アーカイブ、イベント案内をmicroCMS管理画面から日常的に更新可能。未設定時はフォールバックモックデータが綺麗に表示されます。
5. **初回来訪予約・質問フォームモーダル**
   - 行く前の疑問（駐車場や子連れ参加）を気軽に送れるUI。

---

## 🚀 開発・動作方法

### 1. 依存関係のインストール
```bash
npm install
```

### 2. ローカル開発サーバーの起動
```bash
npm run dev
```
ブラウザで `http://localhost:5173` が開きます。

### 3. プロダクションビルド
```bash
npm run build
```

---

## 🔗 microCMS 連携設定

詳細な設定手順は [docs/microcms-setup.md](docs/microcms-setup.md) をご覧ください。

`.env.local` を作成し、以下を設定することでmicroCMSからのリアルタイムデータ表示に切り替わります：
```env
VITE_MICROCMS_SERVICE_DOMAIN=your-service-domain
VITE_MICROCMS_API_KEY=your-api-key
```

---

## 💻 Cursor での日常更新 ＆ Git/GitHub連携

### Cursorでの日常更新
- サイトのテキストや文言を変更したい場合：`src/components/` 配下の各コンポーネントを修正。
- `.cursorrules` が配置されているため、CursorのAIチャットで「〜の文言を修正して」「イベント情報を追加して」と指示するだけで正確に修正が行えます。

### GitHubへのプッシュ手順
```bash
# 変更のコミット
git add .
git commit -m "feat: 新発田いのちのパンチャーチ リニューアルWebサイト完成"

# リポジトリの準備・プッシュ (例)
git remote add origin https://github.com/your-account/shibata-bread-church.git
git branch -M main
git push -u origin main
```

---

## 🎨 技術スタック
- **Core**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS + Noto Serif JP / Noto Sans JP
- **Icons**: Lucide React
- **CMS**: microCMS
- **Hosting**: Vercel / Netlify / GitHub Pages 対応
