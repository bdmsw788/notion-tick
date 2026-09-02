import Image from "next/image";

export default function About() {
  return (
    <div className="container" style={{ padding: '4rem var(--spacing-md)' }}>
      <h1 className="heading-serif" style={{ fontSize: '2.5rem', color: 'var(--color-primary)', textAlign: 'center', marginBottom: '4rem' }}>
        教区について
      </h1>
      
      <section style={{ marginBottom: '5rem', display: 'flex', gap: '4rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '320px', position: 'relative', height: '400px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
          <Image src="/images/community.jpg" alt="礼拝と交わりの様子" fill style={{ objectFit: 'cover' }} />
        </div>
        <div style={{ flex: '1', minWidth: '320px' }}>
          <h2 className="heading-serif" style={{ fontSize: '1.8rem', color: 'var(--color-secondary)', marginBottom: '1.5rem', borderBottom: '2px solid var(--color-border)', paddingBottom: '0.5rem' }}>教区の歩みとビジョン</h2>
          <div style={{ lineHeight: 1.8, fontSize: '1.05rem', color: '#4a5568' }}>
            <p>北陸教区は、石川県、富山県、福井県、そして新潟県の4県にまたがる教会から構成されています。日本海に面した美しい自然環境の中で、各教会が地域に根ざした宣教と奉仕の働きを担っています。</p>
            <p style={{ marginTop: '1rem' }}>現在、教団80周年を節目として、<strong>2033年MM33ビジョン（教会開拓、健全な教会形成、世界宣教、次世代育成）</strong>の実現に向かって共に祈り、分かち合い、協力しながら歩みを進めています。過去の「IUEP北陸」の精神（国際性・協力・働き人の育成・祈祷推進）を継承し、次世代へ福音を伝えるための一体感の醸成に努めています。</p>
          </div>
        </div>
      </section>

      {/* MM33の取り組み */}
      <section style={{ marginBottom: '5rem' }}>
        <h2 className="heading-serif" style={{ fontSize: '1.8rem', color: 'var(--color-secondary)', textAlign: 'center', marginBottom: '2rem' }}>北陸教区の重点施策（MM33への対応）</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          <div className="card">
            <h3 style={{ fontSize: '1.2rem', color: 'var(--color-primary)', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>① 教会開拓 ＜協力＞</h3>
            <p style={{ fontSize: '0.95rem', color: '#4a5568', lineHeight: 1.6 }}>個教会による開拓伝道の経済的支援、開拓地視察と祈りのサポート、ノウハウの情報共有を通じて新しい教会の誕生を推進します。</p>
          </div>
          <div className="card">
            <h3 style={{ fontSize: '1.2rem', color: 'var(--color-primary)', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>② 健全な教会形成 ＜協力・祈祷＞</h3>
            <p style={{ fontSize: '0.95rem', color: '#4a5568', lineHeight: 1.6 }}>個教会同士がビジョンや課題を分かち合う「シェアリング」の提供、祈祷課題の共有、宿泊型修養会の復活による横のつながりを強化します。</p>
          </div>
          <div className="card">
            <h3 style={{ fontSize: '1.2rem', color: 'var(--color-primary)', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>③ 世界宣教 ＜国際性＞</h3>
            <p style={{ fontSize: '0.95rem', color: '#4a5568', lineHeight: 1.6 }}>新潟・敦賀地域などの国際化対応、増加する外国人労働者への宣教対応を通じ、多文化共生の教会形成を目指します。</p>
          </div>
          <div className="card">
            <h3 style={{ fontSize: '1.2rem', color: 'var(--color-primary)', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>④ 次世代育成 ＜働き人育成＞</h3>
            <p style={{ fontSize: '0.95rem', color: '#4a5568', lineHeight: 1.6 }}>小学生向けプログラムの充実やユース世代の支援強化、教材の共有システム構築により、将来の教区を担うリーダーを養成します。</p>
          </div>
        </div>
      </section>

      {/* 組織・人事一覧 */}
      <section className="bg-gradient" style={{ padding: '4rem 2rem', borderRadius: 'var(--radius-lg)' }}>
        <h2 className="heading-serif" style={{ fontSize: '1.8rem', color: 'var(--color-secondary)', textAlign: 'center', marginBottom: '3rem' }}>組織・人事一覧</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '900px', margin: '0 auto' }}>
          
          <div className="card" style={{ border: 'none', boxShadow: 'var(--shadow-md)' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--color-primary)', borderBottom: '2px solid var(--color-primary-light)', paddingBottom: '0.5rem', marginBottom: '1rem', textAlign: 'center' }}>教区三役</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ padding: '0.8rem 0', borderBottom: '1px dashed var(--color-border)', display: 'flex', justifyContent: 'space-between' }}>
                <strong style={{ color: '#4a5568' }}>教区長</strong> <span>高木 順一 牧師</span>
              </li>
              <li style={{ padding: '0.8rem 0', borderBottom: '1px dashed var(--color-border)', display: 'flex', justifyContent: 'space-between' }}>
                <strong style={{ color: '#4a5568' }}>書記</strong> <span>井上 聖嗣 牧師</span>
              </li>
              <li style={{ padding: '0.8rem 0', display: 'flex', justifyContent: 'space-between' }}>
                <strong style={{ color: '#4a5568' }}>会計</strong> <span>浦野 秀一 牧師</span>
              </li>
            </ul>
          </div>

          <div className="card" style={{ border: 'none', boxShadow: 'var(--shadow-md)' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--color-primary)', borderBottom: '2px solid var(--color-primary-light)', paddingBottom: '0.5rem', marginBottom: '1rem', textAlign: 'center' }}>各部担当・協力員</h3>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.95rem' }}>
              <li style={{ padding: '0.5rem 0', borderBottom: '1px dashed var(--color-border)', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#4a5568' }}>国内伝道協力員</span> <strong>浦野 秀一</strong>
              </li>
              <li style={{ padding: '0.5rem 0', borderBottom: '1px dashed var(--color-border)', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#4a5568' }}>海外伝道連絡員</span> <strong>井上 聖嗣</strong>
              </li>
              <li style={{ padding: '0.5rem 0', borderBottom: '1px dashed var(--color-border)', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#4a5568' }}>青少年伝道協力委員</span> <strong>井上 すみれ</strong>
              </li>
              <li style={{ padding: '0.5rem 0', borderBottom: '1px dashed var(--color-border)', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#4a5568' }}>ろう者伝道連絡員</span> <strong>大引 巻代</strong>
              </li>
              <li style={{ padding: '0.5rem 0', borderBottom: '1px dashed var(--color-border)', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#4a5568' }}>女性活躍推進協力員</span> <strong>込尾 あや</strong>
              </li>
              <li style={{ padding: '0.5rem 0', borderBottom: '1px dashed var(--color-border)', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#4a5568' }}>祈祷推進委員</span> <strong>稲葉 隆子</strong>
              </li>
              <li style={{ padding: '0.5rem 0', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#4a5568' }}>中央聖書学校連絡員</span> <strong>千代 美智子</strong>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
