import { Image as ImageIcon, Video, FileText, Download } from "lucide-react";

export default function Archives() {
  return (
    <div className="container" style={{ padding: '4rem var(--spacing-md)' }}>
      <h1 className="heading-serif" style={{ fontSize: '2.5rem', color: 'var(--color-primary)', textAlign: 'center', marginBottom: '1rem' }}>
        イベントアーカイブ
      </h1>
      <p style={{ textAlign: 'center', color: '#718096', marginBottom: '3rem' }}>
        過去のイベント写真、動画アーカイブ、チラシなどを掲載しています。
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
        {/* Mock Item 1 */}
        <div className="card flex-col gap-sm">
          <div style={{ backgroundColor: 'var(--color-surface)', height: '180px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a0aec0' }}>
            <Video size={48} />
          </div>
          <h2 style={{ fontSize: '1.2rem', marginTop: '0.5rem' }}>2023年 教区修養会 メッセージ</h2>
          <p style={{ fontSize: '0.9rem', color: '#718096' }}>YouTubeでの見逃し配信リンクです。</p>
          <button className="btn btn-primary" style={{ marginTop: 'auto', padding: '0.5rem' }}>視聴する</button>
        </div>

        {/* Mock Item 2 */}
        <div className="card flex-col gap-sm">
          <div style={{ backgroundColor: 'var(--color-surface)', height: '180px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a0aec0' }}>
            <ImageIcon size={48} />
          </div>
          <h2 style={{ fontSize: '1.2rem', marginTop: '0.5rem' }}>2023年 ユースキャンプ 写真</h2>
          <p style={{ fontSize: '0.9rem', color: '#718096' }}>参加者向けのアルバムです。</p>
          <button className="btn btn-outline" style={{ marginTop: 'auto', padding: '0.5rem' }}>アルバムを見る</button>
        </div>

        {/* Mock Item 3 */}
        <div className="card flex-col gap-sm">
          <div style={{ backgroundColor: 'var(--color-surface)', height: '180px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a0aec0' }}>
            <FileText size={48} />
          </div>
          <h2 style={{ fontSize: '1.2rem', marginTop: '0.5rem' }}>2024年 春の特別集会 チラシ</h2>
          <p style={{ fontSize: '0.9rem', color: '#718096' }}>ご案内のPDFデータです。ご自由にお使いください。</p>
          <button className="btn btn-secondary" style={{ marginTop: 'auto', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <Download size={16} /> ダウンロード (PDF)
          </button>
        </div>
      </div>
    </div>
  );
}
