import { MessageSquare, BookOpen, FolderOpen, Heart, Plus, Paperclip, MessageCircle, MoreHorizontal, CheckCircle2, ChevronRight, Download } from 'lucide-react';
import Image from 'next/image';

export default function PortalDashboard() {
  return (
    <div style={{ paddingBottom: '5rem' }}>
      
      {/* 1. Hero & Pastor Care Section */}
      <section style={{ position: 'relative', backgroundColor: '#2c3e50', color: 'white', padding: '4rem 0', overflow: 'hidden' }}>
        <Image 
          src="/images/portal_hero_study.jpg" 
          alt="Pastor Study" 
          fill 
          style={{ objectFit: 'cover', opacity: 0.3 }} 
        />
        <div className="container relative z-10" style={{ padding: '0 var(--spacing-md)' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <h1 className="heading-serif" style={{ fontSize: '2.5rem', marginBottom: '1rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
              主の平和が<br/>あなたと共にありますように
            </h1>
            
            {/* 今日の一言（教職ケア） */}
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(10px)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.2)', marginTop: '2rem' }}>
              <p style={{ fontSize: '1.2rem', fontStyle: 'italic', marginBottom: '1rem', lineHeight: 1.6 }}>
                「疲れた者、重荷を負う者は、だれでもわたしのもとに来なさい。休ませてあげよう。」
              </p>
              <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>マタイによる福音書 11章28節</p>
              <div style={{ width: '40px', height: '2px', backgroundColor: 'var(--color-secondary)', margin: '1.5rem auto' }}></div>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.5, opacity: 0.9 }}>
                今週も牧会の働き、お疲れ様です。一人で抱え込まず、ここで祈りと知恵を分かち合いましょう。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 統合アクティビティ・フィード */}
      <section id="feed" className="container" style={{ padding: '3rem var(--spacing-md) 1rem' }}>
        <h2 className="heading-serif" style={{ fontSize: '1.8rem', color: 'var(--color-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MessageSquare size={24} /> 最近の動き
        </h2>
        <div className="card flex-col gap-sm" style={{ padding: '1rem 1.5rem' }}>
          
          <div className="flex items-center gap-md" style={{ padding: '0.8rem 0', borderBottom: '1px solid var(--color-border)' }}>
            <div style={{ backgroundColor: '#ebf8ff', padding: '0.5rem', borderRadius: '50%' }}><MessageSquare color="#3182ce" size={18} /></div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: '0.95rem' }}><span style={{ fontWeight: 'bold' }}>富山希望教会</span>さんが掲示板に「CS合同キャンプの提案」を投稿しました。</p>
              <span style={{ fontSize: '0.75rem', color: '#a0aec0' }}>2時間前</span>
            </div>
          </div>

          <div className="flex items-center gap-md" style={{ padding: '0.8rem 0', borderBottom: '1px solid var(--color-border)' }}>
            <div style={{ backgroundColor: '#f0fdf4', padding: '0.5rem', borderRadius: '50%' }}><CheckCircle2 color="#22c55e" size={18} /></div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: '0.95rem' }}><span style={{ fontWeight: 'bold' }}>金沢聖書教会</span>さんが祈り課題の感謝の報告を追加しました。</p>
              <span style={{ fontSize: '0.75rem', color: '#a0aec0' }}>5時間前</span>
            </div>
          </div>

          <div className="flex items-center gap-md" style={{ padding: '0.8rem 0' }}>
            <div style={{ backgroundColor: '#fff5f5', padding: '0.5rem', borderRadius: '50%' }}><Heart color="#e53e3e" size={18} /></div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: '0.95rem' }}><span style={{ fontWeight: 'bold' }}>新発田いのちのパンチャーチ</span>さんが新しい祈り課題を追加しました。</p>
              <span style={{ fontSize: '0.75rem', color: '#a0aec0' }}>昨日</span>
            </div>
          </div>

        </div>
      </section>

      {/* 3. 祈り課題 & 感謝の報告 */}
      <section id="prayer" className="container" style={{ padding: '3rem var(--spacing-md) 1rem' }}>
        <div className="flex items-center justify-between" style={{ marginBottom: '1.5rem' }}>
          <h2 className="heading-serif" style={{ fontSize: '1.8rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Heart size={24} /> 祈り課題と感謝
          </h2>
          <button className="btn btn-primary" style={{ padding: '0.4rem 1rem' }}><Plus size={16} /> 祈りを投稿</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {/* Active Prayers */}
          <div className="flex-col gap-md">
            <h3 style={{ fontSize: '1.1rem', color: '#4a5568', borderBottom: '2px solid var(--color-border)', paddingBottom: '0.5rem' }}>今週の祈り課題</h3>
            
            <div className="card" style={{ padding: '1.2rem', borderLeft: '4px solid var(--color-accent)' }}>
              <div className="flex items-center justify-between" style={{ marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: 'bold' }}>小松キリスト教会</span>
                <span style={{ fontSize: '0.8rem', color: '#718096' }}>竹田先生</span>
              </div>
              <ul style={{ fontSize: '0.95rem', color: '#4a5568', lineHeight: 1.6, paddingLeft: '1.2rem', margin: '0.5rem 0' }}>
                <li>小松キリスト教会が小松のランドマークとなれるように</li>
              </ul>
              <div className="flex items-center gap-sm" style={{ marginTop: '1rem' }}>
                <button className="btn btn-outline" style={{ padding: '0.2rem 0.6rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Heart size={14} /> 祈っています (12)
                </button>
              </div>
            </div>
            
            <button className="btn btn-outline" style={{ width: '100%', fontSize: '0.9rem' }}>すべての祈りを見る</button>
          </div>

          {/* Answered Prayers */}
          <div className="flex-col gap-md">
            <h3 style={{ fontSize: '1.1rem', color: '#166534', borderBottom: '2px solid #bbf7d0', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={18} /> 感謝の証し（祈りのリレー）
            </h3>

            <div className="card" style={{ padding: '1.2rem', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
              <div className="flex items-center justify-between" style={{ marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: '#166534', fontWeight: 'bold' }}>金沢聖書教会</span>
                <span style={{ fontSize: '0.8rem', color: '#15803d' }}>2日前</span>
              </div>
              <p style={{ fontSize: '0.95rem', color: '#166534', lineHeight: 1.6, margin: '0.5rem 0' }}>
                【報告】玄関で転んで骨折した姉妹が、無事に退院されました！順調に回復に向かっています。お祈りありがとうございました。
              </p>
              <div className="flex items-center gap-sm" style={{ marginTop: '1rem' }}>
                <button className="btn" style={{ padding: '0.2rem 0.6rem', fontSize: '0.8rem', backgroundColor: 'white', color: '#166534', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Heart size={14} /> ハレルヤ (15)
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. 掲示板 */}
      <section id="board" className="container" style={{ padding: '3rem var(--spacing-md) 1rem' }}>
        <div className="flex items-center justify-between" style={{ marginBottom: '1.5rem' }}>
          <h2 className="heading-serif" style={{ fontSize: '1.8rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MessageSquare size={24} /> 掲示板
          </h2>
          <button className="btn btn-primary" style={{ padding: '0.4rem 1rem' }}><Plus size={16} /> 新規投稿</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '1.5rem' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: '1rem' }}>
              <div className="flex items-center gap-sm">
                <span style={{ fontSize: '0.8rem', backgroundColor: 'var(--color-surface-hover)', padding: '0.2rem 0.6rem', borderRadius: '12px' }}>アイデア</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#4a5568' }}>富山希望教会 CS担当</span>
              </div>
            </div>
            <h3 style={{ fontSize: '1.2rem', margin: '0 0 0.5rem 0' }}>CS合同キャンプの提案</h3>
            <p style={{ fontSize: '0.95rem', color: '#4a5568', lineHeight: 1.5, marginBottom: '1rem' }}>
              来年の夏、北陸教区全体で合同のCSキャンプを企画できないでしょうか？過去の資料を添付します。
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem', backgroundColor: '#edf2f7', padding: '0.2rem 0.5rem', borderRadius: '4px' }}><Paperclip size={14}/> 企画書.pdf</span>
            </div>
            <div className="flex items-center gap-md" style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
              <span style={{ fontSize: '0.85rem', color: '#718096', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Heart size={16}/> 5</span>
              <span style={{ fontSize: '0.85rem', color: '#718096', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><MessageCircle size={16}/> 3</span>
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <button className="btn btn-outline">掲示板をもっと見る</button>
        </div>
      </section>

      {/* 5. 事務・リソース */}
      <section id="admin" className="container" style={{ padding: '3rem var(--spacing-md) 1rem' }}>
        <h2 className="heading-serif" style={{ fontSize: '1.8rem', color: 'var(--color-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FolderOpen size={24} /> 事務・リソース
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '1.5rem', borderTop: '4px solid var(--color-secondary)' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>各種フォーマット</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <li>
                <a href="#" style={{ color: 'var(--color-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
                  <Download size={16} /> 交通費精算書 (Excel)
                </a>
              </li>
              <li>
                <a href="#" style={{ color: 'var(--color-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
                  <Download size={16} /> 役員会報告書 (Word)
                </a>
              </li>
            </ul>
          </div>
          
          <div className="card" style={{ padding: '1.5rem', borderTop: '4px solid var(--color-primary)' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>教区規定・マニュアル</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <li>
                <a href="#" style={{ color: 'var(--color-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
                  <BookOpen size={16} /> 北陸教区 規則・細則
                </a>
              </li>
              <li>
                <a href="#" style={{ color: 'var(--color-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
                  <BookOpen size={16} /> 危機管理マニュアル
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Quick Action FAB */}
      <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 100 }}>
        <button style={{ 
          width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'var(--color-secondary)', color: 'white', 
          border: 'none', boxShadow: '0 4px 12px rgba(221,107,32,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'transform 0.2s'
        }}>
          <Plus size={28} />
        </button>
      </div>

    </div>
  );
}
