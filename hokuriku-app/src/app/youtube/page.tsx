import { PlayCircle } from "lucide-react";

export default function YouTubeArchives() {
  return (
    <div className="container" style={{ padding: '4rem var(--spacing-md)' }}>
      <h1 className="heading-serif" style={{ fontSize: '2.5rem', color: 'var(--color-primary)', textAlign: 'center', marginBottom: '1rem' }}>
        動画アーカイブ（YouTube）
      </h1>
      <p style={{ textAlign: 'center', color: '#718096', marginBottom: '3rem' }}>
        教区の礼拝、集会、イベントの様子を動画でご覧いただけます。
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Placeholder videos */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ backgroundColor: '#e2e8f0', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <PlayCircle size={48} color="#a0aec0" />
          </div>
          <div style={{ padding: '1.5rem' }}>
            <span style={{ fontSize: '0.8rem', backgroundColor: 'var(--color-surface-hover)', padding: '0.2rem 0.6rem', borderRadius: '12px' }}>礼拝・集会</span>
            <h3 style={{ fontSize: '1.1rem', margin: '0.5rem 0' }}>第75回 教区総会 記念礼拝</h3>
            <p style={{ fontSize: '0.85rem', color: '#718096' }}>2025.04.10</p>
          </div>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ backgroundColor: '#e2e8f0', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <PlayCircle size={48} color="#a0aec0" />
          </div>
          <div style={{ padding: '1.5rem' }}>
            <span style={{ fontSize: '0.8rem', backgroundColor: '#e6fffa', color: '#234e52', padding: '0.2rem 0.6rem', borderRadius: '12px' }}>セミナー</span>
            <h3 style={{ fontSize: '1.1rem', margin: '0.5rem 0' }}>次世代育成セミナー</h3>
            <p style={{ fontSize: '0.85rem', color: '#718096' }}>2024.11.15</p>
          </div>
        </div>
      </div>
    </div>
  );
}
