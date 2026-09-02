'use client';
import { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';
import Image from 'next/image';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/portal');
    } catch (err) {
      setError('ログインに失敗しました。メールアドレスとパスワードをご確認ください。');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push('/portal');
    } catch (err) {
      setError('Googleログインに失敗しました。');
    }
  };

  const handleMockLogin = () => {
    localStorage.setItem('mockLogin', 'true');
    window.location.href = '/portal';
  }

  return (
    <div className="bg-gradient flex items-center justify-center" style={{ minHeight: 'calc(100vh - 72px)', padding: '2rem 1rem' }}>
      <div className="card" style={{ display: 'flex', maxWidth: '900px', width: '100%', padding: '0', overflow: 'hidden', border: 'none', boxShadow: 'var(--shadow-lg)' }}>
        
        {/* Illustration Side */}
        <div style={{ flex: '1', backgroundColor: '#e6f2f5', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="hidden sm:flex">
          {/* Using inline style for hiding on very small screens is tricky without a CSS class, but we can rely on standard responsive techniques or just let flex handle it. Since we are using standard React, let's use a standard wrapper. */}
          <div style={{ position: 'absolute', inset: 0 }}>
            <img src="/images/portal.jpg" alt="コミュニティの繋がり" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>

        {/* Login Form Side */}
        <div className="flex-col" style={{ flex: '1', padding: '4rem 3rem' }}>
          <div className="flex-col items-center gap-sm" style={{ marginBottom: '2rem' }}>
            <div style={{ backgroundColor: 'var(--color-surface)', padding: '1rem', borderRadius: '50%', boxShadow: 'var(--shadow-sm)' }}>
              <Lock size={32} color="var(--color-secondary)" />
            </div>
            <h1 className="heading-serif" style={{ fontSize: '1.6rem', color: 'var(--color-foreground)', marginTop: '0.5rem' }}>
              教職ポータル
            </h1>
            <p style={{ color: '#718096', fontSize: '0.9rem' }}>ログインしてダッシュボードにアクセス</p>
          </div>

          {error && (
            <div style={{ backgroundColor: '#fed7d7', color: '#c53030', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="flex-col gap-md">
            <div className="flex-col gap-xs">
              <label style={{ fontSize: '0.9rem', fontWeight: 500, color: '#4a5568' }}>メールアドレス</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{ padding: '0.8rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', outline: 'none' }}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
              />
            </div>
            <div className="flex-col gap-xs">
              <label style={{ fontSize: '0.9rem', fontWeight: 500, color: '#4a5568' }}>パスワード</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{ padding: '0.8rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', outline: 'none' }}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '0.8rem', fontSize: '1rem', borderRadius: 'var(--radius-md)' }}>
              ログイン
            </button>
          </form>

          <div style={{ textAlign: 'center', margin: '2rem 0', color: '#a0aec0', fontSize: '0.9rem', position: 'relative' }}>
            <span style={{ backgroundColor: 'white', padding: '0 10px', position: 'relative', zIndex: 1 }}>または</span>
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', backgroundColor: 'var(--color-border)', zIndex: 0 }}></div>
          </div>

          <button onClick={handleGoogleLogin} className="btn btn-outline" style={{ width: '100%', padding: '0.8rem', borderRadius: 'var(--radius-md)' }}>
            Googleアカウントでログイン
          </button>

          {/* 開発時用モックボタン */}
          <button onClick={handleMockLogin} style={{ width: '100%', padding: '0.5rem', marginTop: '2rem', color: '#a0aec0', textDecoration: 'underline', fontSize: '0.85rem', cursor: 'pointer', background: 'none', border: 'none' }}>
            【開発用】ログインをスキップして進む
          </button>
        </div>

      </div>
    </div>
  );
}
