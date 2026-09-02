export default function Home() {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="container hero-content">
          <h1 className="hero-title">北陸教区へようこそ</h1>
          <blockquote className="hero-verse">
            「すべて労する者、重荷を負う者は、わたしのところに来なさい。<br />
            わたしがあなたがたを休ませてあげます。」
            <footer>(マタイの福音書 11:28 - 新改訳2017)</footer>
          </blockquote>
          <a href="/about" className="btn mt-4">私たちについて</a>
        </div>
      </section>

      <div className="container">
        <div className="home-grid">
          <section className="news-section">
            <h2>最新のお知らせ</h2>
            <div className="news-list">
              {/* This will be populated from Firebase */}
              <div className="card news-item">
                <span className="news-date">202x.xx.xx</span>
                <h3 className="news-title">新しいポータルサイトを公開しました</h3>
              </div>
              <div className="card news-item">
                <span className="news-date">202x.xx.xx</span>
                <h3 className="news-title">〇〇特別集会のお知らせ</h3>
              </div>
            </div>
            <div className="view-more">
              <a href="/news" className="btn btn-secondary mt-4">お知らせ一覧を見る</a>
            </div>
          </section>

          <aside className="sidebar">
            <section className="calendar-section card">
              <h2>教区カレンダー</h2>
              <div className="calendar-placeholder">
                {/* Google Calendar iframe will go here */}
                <p>カレンダー読み込み中...</p>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
