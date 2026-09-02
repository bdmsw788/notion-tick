import { Calendar, ChevronRight, MapPin, PlayCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section style={{ 
        position: 'relative', 
        height: '600px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: -1 }}>
          <Image 
            src="/images/hero.jpg" 
            alt="北陸教区の美しい風景" 
            fill 
            style={{ objectFit: 'cover', filter: 'brightness(0.65)' }}
            priority
          />
        </div>
        <div className="container" style={{ textAlign: 'center', zIndex: 1 }}>
          <h1 className="heading-serif" style={{ fontSize: '3rem', color: 'white', marginBottom: '1.5rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
            主の愛を、北陸の地に。
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.95)', fontSize: '1.15rem', maxWidth: '600px', margin: '0 auto 2.5rem', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
            北陸教区は、日本海に面した美しい自然の中で、神の言葉を分かち合い、地域社会に仕える教会が集まる群れです。
          </p>
          <div className="bible-verse glass-card" style={{ display: 'inline-block', padding: '2rem 3rem', maxWidth: '90%' }}>
            「わたしは、あなたがたに平安を残します。<br/>わたしの平安を与えます。」<br />
            <span style={{ fontSize: '0.9rem', color: 'var(--color-primary)', marginTop: '1.5rem', display: 'block', fontWeight: 'bold' }}>（ヨハネの福音書 14:27 / 新改訳2017）</span>
          </div>
        </div>
      </section>

      {/* Weekly Devotional Section */}
      <section style={{ padding: '4rem 0', backgroundColor: 'var(--color-surface)' }}>
        <div className="container">
          <div className="card glass-card" style={{ padding: '3rem', border: 'none', borderLeft: '6px solid var(--color-primary)', display: 'flex', flexDirection: 'column', gap: '1.5rem', boxShadow: 'var(--shadow-md)' }}>
            <div className="flex items-center justify-between" style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
              <div className="flex items-center gap-sm">
                <span style={{ backgroundColor: 'var(--color-primary)', color: 'white', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>NEW</span>
                <h2 className="heading-serif" style={{ fontSize: '1.6rem', margin: 0, color: 'var(--color-secondary)' }}>今週の御言葉</h2>
              </div>
              <span style={{ color: '#718096', fontSize: '0.9rem' }}>2024.11.10 更新</span>
            </div>
            
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              <div style={{ flex: '1', minWidth: '300px' }}>
                <p className="bible-verse" style={{ padding: '1rem 2rem', fontSize: '1.35rem', textAlign: 'left', lineHeight: 1.8 }}>
                  「私たちは、見えるものにではなく、見えないものに目を留めます。見えるものは一時的であり、見えないものは永遠に続くからです。」
                  <span style={{ display: 'block', fontSize: '0.9rem', color: 'var(--color-primary)', marginTop: '1rem' }}>コリント人への手紙 第二 4:18（新改訳2017）</span>
                </p>
              </div>
              <div style={{ flex: '1', minWidth: '300px', backgroundColor: 'white', padding: '1.5rem', borderRadius: 'var(--radius-md)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--color-foreground)' }}>見えないものに目を留める</h3>
                <p style={{ color: '#4a5568', lineHeight: 1.7, fontSize: '0.95rem' }}>
                  日常の忙しさや目の前の問題に心が奪われそうになる時、この御言葉は私たちの視点を天に向けさせてくれます。状況がどうであれ、神様の変わらない愛と永遠の計画が私たちを包んでいます。今週も、永遠なる主を見上げて歩みましょう。
                </p>
                <div className="flex items-center justify-between" style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px dashed var(--color-border)' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--color-secondary)' }}>〇〇キリスト教会　〇〇牧師</span>
                  <button className="btn btn-outline" style={{ padding: '0.3rem 0.8rem', fontSize: '0.85rem' }}>過去の御言葉一覧</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="bg-gradient" style={{ padding: '5rem 0' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem' }}>
          
          {/* News & Updates */}
          <div className="card" style={{ padding: '2rem', border: 'none', boxShadow: 'var(--shadow-md)' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: '1.5rem', borderBottom: '2px solid var(--color-border)', paddingBottom: '0.5rem' }}>
              <h2 className="heading-serif" style={{ fontSize: '1.5rem', color: 'var(--color-secondary)' }}>最新情報・教区会</h2>
              <Link href="/news" style={{ fontSize: '0.9rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center' }}>
                一覧を見る <ChevronRight size={16} />
              </Link>
            </div>
            <div className="flex-col gap-md">
              {/* Real Data Integration */}
              <div style={{ padding: '1rem', borderBottom: '1px solid var(--color-surface-hover)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 'bold', display: 'block', marginBottom: '0.25rem' }}>2026年度 年間予定</span>
                <h3 style={{ fontSize: '1.05rem', margin: '0 0 0.5rem 0' }}>巡回型教区会の再開について</h3>
                <p style={{ fontSize: '0.9rem', color: '#4a5568' }}>今年度は各県を巡回するハイブリッド形式で教区会を実施します（3月:福井、5月:石川、7月:富山、11月:新潟）。</p>
              </div>
              <div style={{ padding: '1rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 'bold', display: 'block', marginBottom: '0.25rem' }}>教区の取り組み</span>
                <h3 style={{ fontSize: '1.05rem', margin: '0 0 0.5rem 0' }}>教団80周年記念事業 MM33への参画</h3>
                <p style={{ fontSize: '0.9rem', color: '#4a5568' }}>教会開拓、健全な教会形成など4つの柱に基づき、IUEP北陸の精神を継続発展させます。</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="card" style={{ padding: '2rem', border: 'none' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: '1.5rem', borderBottom: '2px solid var(--color-border)', paddingBottom: '0.5rem' }}>
              <h2 className="heading-serif" style={{ fontSize: '1.5rem', color: 'var(--color-secondary)' }}>教区の働き</h2>
            </div>
            <div className="flex-col gap-md">
              <Link href="/churches" style={{ textDecoration: 'none', padding: '1rem', backgroundColor: 'var(--color-surface-hover)', borderRadius: 'var(--radius-md)', display: 'block', transition: 'background-color 0.2s' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-md">
                    <div style={{ backgroundColor: 'white', padding: '0.75rem', borderRadius: '50%', boxShadow: 'var(--shadow-sm)' }}>
                      <MapPin color="var(--color-primary)" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', color: 'var(--color-foreground)' }}>教会一覧</h3>
                      <p style={{ fontSize: '0.85rem', color: '#718096' }}>お近くの教会を探す</p>
                    </div>
                  </div>
                  <ChevronRight color="#a0aec0" />
                </div>
              </Link>

              <Link href="/youtube" style={{ textDecoration: 'none', padding: '1rem', backgroundColor: 'var(--color-surface-hover)', borderRadius: 'var(--radius-md)', display: 'block', transition: 'background-color 0.2s' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-md">
                    <div style={{ backgroundColor: 'white', padding: '0.75rem', borderRadius: '50%', boxShadow: 'var(--shadow-sm)' }}>
                      <PlayCircle color="var(--color-primary)" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', color: 'var(--color-foreground)' }}>YouTubeアーカイブ</h3>
                      <p style={{ fontSize: '0.85rem', color: '#718096' }}>教区の礼拝・集会動画を見る</p>
                    </div>
                  </div>
                  <ChevronRight color="#a0aec0" />
                </div>
              </Link>

              <div style={{ padding: '1rem', backgroundColor: 'var(--color-surface-hover)', borderRadius: 'var(--radius-md)' }}>
                <div className="flex items-center gap-sm" style={{ marginBottom: '1rem' }}>
                  <Calendar color="var(--color-secondary)" size={20} />
                  <h3 style={{ fontSize: '1.1rem' }}>教区カレンダー</h3>
                </div>
                {/* Google Calendar Embed Placeholder */}
                <div style={{ backgroundColor: 'white', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-sm)', color: '#718096', fontSize: '0.9rem', boxShadow: 'var(--shadow-sm)' }}>
                  Googleカレンダー 読み込み中...
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
