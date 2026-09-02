import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "オンライン献金・サポート | 北陸教区",
};

export default function SupportPage() {
  return (
    <div className="container" style={{ maxWidth: "600px", textAlign: "center", padding: "4rem 1rem" }}>
      <h1>オンライン献金・サポート窓口</h1>
      <p className="mt-4" style={{ fontSize: "1.1rem" }}>
        全国の皆様からのご支援を感謝いたします。<br />
        お預かりした献金は、北陸教区の宣教と各教会の働きの支援のために大切に用いさせていただきます。
      </p>
      
      <div className="card mt-4" style={{ padding: "3rem 2rem" }}>
        <h3>クレジットカードで献金する</h3>
        <p className="mt-4" style={{ opacity: 0.8, fontSize: "0.9rem" }}>
          ※Stripe社の安全な決済システムを利用しています。
        </p>
        <div style={{ marginTop: "2rem", display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center" }}>
          <a href="#" className="btn" style={{ width: "100%", maxWidth: "300px" }}>任意の金額を献金する</a>
          <a href="#" className="btn btn-secondary" style={{ width: "100%", maxWidth: "300px" }}>毎月の定額サポート</a>
        </div>
      </div>
    </div>
  );
}
