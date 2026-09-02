import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/lib/auth/AuthContext";

export const metadata: Metadata = {
  title: "北陸教区 | Hokuriku Diocese",
  description: "北陸教区の公式WEBサイトおよび教職向けポータルです。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AuthProvider>
          <Header />
          <main style={{ flex: 1 }}>
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
