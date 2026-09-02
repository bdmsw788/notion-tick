import { Heart } from "lucide-react";

export default function Donate() {
  return (
    <div className="container" style={{ padding: '4rem var(--spacing-md)', maxWidth: '800px' }}>
      <div className="card flex-col items-center gap-md" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <div style={{ backgroundColor: 'var(--color-surface)', padding: '1rem', borderRadius: '50%', marginBottom: '1rem' }}>
          <Heart size={48} color="var(--color-accent)" fill="var(--color-accent)" />
        </div>
        
        <h1 className="heading-serif" style={{ fontSize: '2.2rem', color: 'var(--color-primary)' }}>
          オンライン献金
        </h1>
        
        <p style={{ fontSize: '1.1rem', color: '#4a5568', lineHeight: 1.8, marginBottom: '2rem' }}>
          北陸教区の働きのために、お祈りとご支援を心より感謝いたします。<br />
          皆様からの献金は、諸教会の支援や宣教活動のために大切に用いられます。
        </p>

        <button className="btn btn-primary" style={{ fontSize: '1.2rem', padding: '1rem 3rem', borderRadius: 'var(--radius-lg)' }}>
          クレジットカードで献金する
        </button>
        <p style={{ fontSize: '0.85rem', color: '#a0aec0', marginTop: '1rem' }}>
          ※安全な外部決済システム（Stripe）へ移動します。
        </p>
      </div>
    </div>
  );
}
