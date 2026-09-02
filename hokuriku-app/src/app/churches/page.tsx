import { MapPin, User, Globe } from "lucide-react";

const REAL_CHURCHES = [
  { id: 1, name: "金沢聖書教会", pref: "石川県", pastor: "浦野 秀一 先生、慶子 先生" },
  { id: 2, name: "松任キリスト教会", pref: "石川県", pastor: "高木 順一 先生、由香 先生" },
  { id: 3, name: "小松キリスト教会", pref: "石川県", pastor: "竹田 和則 先生、寿美 先生" },
  { id: 4, name: "富山キリスト教会", pref: "富山県", pastor: "佐野 兼司 先生、里美 先生" },
  { id: 5, name: "小矢部キリスト教会", pref: "富山県", pastor: "稲葉 隆子 先生" },
  { id: 6, name: "福岡町キリスト教会", pref: "富山県", pastor: "千代 美智子 先生" },
  { id: 7, name: "氷見キリスト教会", pref: "富山県", pastor: "大引 巻代 先生" },
  { id: 8, name: "入善キリスト教会", pref: "富山県", pastor: "高木 順一 先生" },
  { id: 9, name: "黒部聖書キリスト教会", pref: "富山県", pastor: "込尾 あや 先生、言人 先生" },
  { id: 10, name: "純福音鯖江教会", pref: "福井県", pastor: "廉 順福 先生、佐島 涼 先生" },
  { id: 11, name: "敦賀宣教教会", pref: "福井県", pastor: "金 永順 先生" },
  { id: 12, name: "新発田いのちのパンチャーチ", pref: "新潟県", pastor: "井上 聖嗣 先生、すみれ 先生" },
  { id: 13, name: "新潟グレイスチャペル", pref: "新潟県", pastor: "土屋 潔 先生、康 先生、土屋 真愛 先生、ザム・トゥアング 先生" },
];

export default function Churches() {
  return (
    <div className="container" style={{ padding: '4rem var(--spacing-md)' }}>
      <h1 className="heading-serif" style={{ fontSize: '2.5rem', color: 'var(--color-primary)', textAlign: 'center', marginBottom: '1rem' }}>
        教会一覧
      </h1>
      <p style={{ textAlign: 'center', color: '#718096', marginBottom: '3rem' }}>
        北陸教区（石川・富山・福井・新潟）に所属する各教会と牧師のご案内です。お近くの教会へぜひお越しください。
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
        {REAL_CHURCHES.map(church => (
          <div key={church.id} className="card flex-col gap-sm hover:shadow-md" style={{ transition: 'all 0.3s' }}>
            <div className="flex items-center justify-between">
              <h2 className="heading-serif" style={{ fontSize: '1.25rem', color: 'var(--color-secondary)' }}>{church.name}</h2>
              <span style={{ fontSize: '0.75rem', backgroundColor: 'var(--color-surface-hover)', padding: '0.2rem 0.5rem', borderRadius: '12px', color: '#4a5568' }}>{church.pref}</span>
            </div>
            
            <div className="flex items-start gap-sm" style={{ color: '#4a5568', fontSize: '0.95rem', marginTop: '1rem' }}>
              <User size={18} color="var(--color-primary-light)" style={{ flexShrink: 0, marginTop: '0.2rem' }} /> 
              <span style={{ lineHeight: 1.5 }}>
                <span style={{ fontSize: '0.8rem', color: '#718096', display: 'block' }}>牧師・教職</span>
                <strong>{church.pastor}</strong>
              </span>
            </div>
            
            <div className="flex gap-sm" style={{ marginTop: 'auto', paddingTop: '1.5rem' }}>
              <button className="btn btn-outline" style={{ flex: 1, fontSize: '0.85rem', padding: '0.5rem' }}>
                <Globe size={16} /> WEB
              </button>
              <button className="btn btn-primary" style={{ flex: 1, fontSize: '0.85rem', padding: '0.5rem' }}>
                <MapPin size={16} /> マップ
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
