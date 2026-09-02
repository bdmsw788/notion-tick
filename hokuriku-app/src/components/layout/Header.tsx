import Link from 'next/link';

export default function Header() {
  return (
    <header style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'white', position: 'sticky', top: 0, zIndex: 10 }}>
      <div className="container flex items-center justify-between" style={{ height: '72px' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="heading-serif" style={{ fontSize: '1.25rem', color: 'var(--color-primary)' }}>北陸教区</span>
        </Link>
        <nav className="flex items-center gap-md" style={{ fontSize: '0.95rem', fontWeight: 500 }}>
          <Link href="/">ホーム</Link>
          <Link href="/about">教区について</Link>
          <Link href="/churches">教会一覧</Link>
          <Link href="/archives">アーカイブ</Link>
          <Link href="/portal" className="btn btn-outline" style={{ padding: '0.4rem 1rem', borderRadius: 'var(--radius-sm)' }}>
            教職ポータル
          </Link>
          <Link href="/donate" className="btn btn-primary" style={{ padding: '0.4rem 1rem', borderRadius: 'var(--radius-sm)' }}>
            オンライン献金
          </Link>
        </nav>
      </div>
    </header>
  );
}
