import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: 'var(--color-surface)', borderTop: '1px solid var(--color-border)', padding: '3rem 0 2rem', marginTop: 'auto' }}>
      <div className="container flex-col items-center gap-lg" style={{ textAlign: 'center' }}>
        <div>
          <p className="heading-serif" style={{ color: 'var(--color-primary)', fontSize: '1.2rem', marginBottom: '0.5rem' }}>北陸教区</p>
          <p style={{ fontSize: '0.9rem', color: '#718096' }}>主の愛を、北陸の地に。</p>
        </div>
        
        <div className="flex justify-center gap-lg" style={{ fontSize: '0.9rem' }}>
          <Link href="/about">教区について</Link>
          <Link href="/churches">教会一覧</Link>
          <Link href="/portal">教職ポータル</Link>
        </div>

        <p style={{ fontSize: '0.8rem', color: '#a0aec0', marginTop: '1rem' }}>
          © {new Date().getFullYear()} Hokuriku Diocese. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
