// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AmplifyBridge from "./AmplifyBridge"; // 💡 新しく作ったブリッジをここで読み込みます

// ✕【削除】バグの原因になっていたここの初期化（Amplify.configure）コードは完全に消去しました！
// 代わりに新しく作成した「AmplifyBridge」が安全に初期化を担当してくれます。

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// タイトルと説明文（お二人の大切な設定をそのまま引き継いでいます）
export const metadata: Metadata = {
  title: "Wedding Invitation",
  description: "結婚式のご出欠のお伺い",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* 💡 children（画面の中身）を AmplifyBridge で包むことで、すれ違いエラーを確実に防ぎます */}
        <AmplifyBridge>
          {children}
        </AmplifyBridge>
      </body>
    </html>
  );
}