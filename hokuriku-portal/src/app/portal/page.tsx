import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "教職専用ポータル | 北陸教区",
};

export default function PortalDashboard() {
  return (
    <div className="container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1>🔒 教職専用ポータル</h1>
        <button className="btn btn-secondary">ログアウト</button>
      </div>
      
      <div className="card" style={{ backgroundColor: "var(--secondary-color)", marginBottom: "2rem" }}>
        <h2>💡 今週の祈祷課題ピックアップ</h2>
        <ul style={{ marginLeft: "1.5rem", marginTop: "1rem" }}>
          <li>〇〇教会の特別集会の祝福のため</li>
          <li>体調を崩されている先生方のため</li>
        </ul>
      </div>

      <div className="home-grid">
        <section className="card">
          <h2>📂 教区運営・事務アーカイブ</h2>
          <div className="news-list mt-4">
            <div className="news-item" style={{ borderBottom: "1px solid var(--secondary-color)" }}>
              <h3 className="news-title">202x年 秋季総会議事録</h3>
              <a href="#" className="news-date">ダウンロード</a>
            </div>
            <div className="news-item" style={{ borderBottom: "1px solid var(--secondary-color)" }}>
              <h3 className="news-title">次年度 役割人事表</h3>
              <a href="#" className="news-date">ダウンロード</a>
            </div>
          </div>
        </section>

        <section className="card">
          <h2>🛠️ プロジェクト＆IT相談窓口</h2>
          <div className="mt-4" style={{ marginBottom: "1rem" }}>
            <a href="#" className="btn">新しいIT相談を投稿する</a>
          </div>
          <div className="news-list">
            <div className="news-item" style={{ borderLeft: "4px solid #d9534f", backgroundColor: "#faf9f6" }}>
              <span style={{ fontSize: "0.8rem", color: "#d9534f", fontWeight: "bold" }}>未対応</span>
              <h3 className="news-title mt-2">〇〇教会の配信PCの調子が悪い</h3>
              <span className="news-date">〇〇牧師</span>
            </div>
            <div className="news-item" style={{ borderLeft: "4px solid var(--primary-color)", backgroundColor: "#faf9f6" }}>
              <span style={{ fontSize: "0.8rem", color: var(--primary-color), fontWeight: "bold" }}>解決済</span>
              <h3 className="news-title mt-2">オンライン聖書学校のZoom設定</h3>
              <span className="news-date">管理者</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
