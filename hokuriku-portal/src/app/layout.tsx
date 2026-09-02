import type { Metadata } from "next";
import { Noto_Serif_JP } from "next/font/google";
import "./globals.css";

const notoSerif = Noto_Serif_JP({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-noto-serif",
});

export const metadata: Metadata = {
  title: "北陸教区 公式ポータル",
  description: "北陸教区の公式WEBサイトおよび教職・教会運営支援ポータルです。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={notoSerif.className}>
        <div className="layout-wrapper">
          <header className="site-header">
            <div className="container header-content">
              <div className="logo">北陸教区</div>
              <nav className="main-nav">
                <a href="/">ホーム</a>
                <a href="/archive">アーカイブ</a>
                <a href="/support" className="nav-support">オンライン献金</a>
                <a href="/portal" className="nav-portal">🔒教職専用</a>
              </nav>
            </div>
          </header>
          <main className="site-main">{children}</main>
          <footer className="site-footer">
            <div className="container">
              <p>&copy; {new Date().getFullYear()} 北陸教区. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
