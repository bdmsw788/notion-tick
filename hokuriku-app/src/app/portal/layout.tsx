import { LogOut, User, Bell } from 'lucide-react';
import Link from 'next/link';

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f7fafc' }}>
      
      {/* Top Navigation */}
      <header style={{ backgroundColor: 'white', borderBottom: '1px solid var(--color-border)', position: 'sticky', top: 0, zIndex: 50, boxShadow: 'var(--shadow-sm)' }}>
        <div className="container flex items-center justify-between" style={{ height: '60px', padding: '0 var(--spacing-md)' }}>
          <div className="flex items-center gap-md">
            <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--color-primary)' }}>北陸教区 教職ポータル</span>
            
            {/* Anchor Links (Smooth scroll navigation for single page) */}
            <nav style={{ display: 'flex', gap: '1.2rem', marginLeft: '2rem' }} className="hide-on-mobile">
              <a href="#feed" style={{ color: '#4a5568', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>最新の動き</a>
              <a href="#prayer" style={{ color: '#4a5568', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>祈り課題</a>
              <a href="#board" style={{ color: '#4a5568', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>掲示板</a>
              <a href="#admin" style={{ color: '#4a5568', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>事務・リソース</a>
            </nav>
          </div>

          <div className="flex items-center gap-md">
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#718096', position: 'relative' }}>
              <Bell size={20} />
              <span style={{ position: 'absolute', top: '-4px', right: '-4px', backgroundColor: '#e53e3e', color: 'white', fontSize: '0.6rem', padding: '2px 4px', borderRadius: '10px', fontWeight: 'bold' }}>2</span>
            </button>
            <div className="flex items-center gap-sm">
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={16} color="var(--color-primary)" />
              </div>
              <span style={{ fontSize: '0.9rem', color: '#4a5568' }} className="hide-on-mobile">テスト牧師</span>
            </div>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#e53e3e', textDecoration: 'none', fontSize: '0.85rem', marginLeft: '1rem' }}>
              <LogOut size={16} /> <span className="hide-on-mobile">ログアウト</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>
        {children}
      </main>

    </div>
  );
}
