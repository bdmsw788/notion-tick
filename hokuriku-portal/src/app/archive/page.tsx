import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "アーカイブ | 北陸教区",
};

export default function ArchivePage() {
  return (
    <div className="container">
      <h1>学びと励ましのアーカイブ</h1>
      <p>過去の特会や聖書の学び会、おすすめの書籍やリンク集を掲載しています。</p>
      
      <div className="home-grid mt-4">
        <section className="archive-videos card">
          <h2>オンライン聖書学校・イベント動画</h2>
          <div className="news-list mt-4">
            <div className="news-item" style={{ borderBottom: "1px solid var(--secondary-color)" }}>
              <h3 className="news-title">202x年 秋季特別集会「恵みによって」</h3>
              <a href="#" className="news-date">動画を視聴する →</a>
            </div>
            <div className="news-item" style={{ borderBottom: "1px solid var(--secondary-color)" }}>
              <h3 className="news-title">ホームスクール用教材（音声）</h3>
              <a href="#" className="news-date">音声を聴く →</a>
            </div>
          </div>
        </section>

        <section className="archive-resources card">
          <h2>おすすめコンテンツ紹介</h2>
          <ul style={{ listStyleType: "none", display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
            <li>
              <strong>宣教に役立つ書籍</strong>
              <p style={{ fontSize: "0.9rem", opacity: 0.8 }}>『〇〇の神学』 - 日常のインプットに最適です。</p>
            </li>
            <li>
              <strong>礼拝用BGM</strong>
              <p style={{ fontSize: "0.9rem", opacity: 0.8 }}>祈りの時間に合うプレイリスト</p>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
