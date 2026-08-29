import type { Metadata } from "next";
import { Noto_Serif_SC } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";

const serifCn = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["600", "700", "900"],
  variable: "--font-serif-cn",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MakerHub · 造物主社区",
  description:
    "实物 VibeCoding 集合社区——用 AI 造物，晒出来，买得到。发现工具、挑设计清单、生成实物、找料交易。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className={`${serifCn.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-[rgba(255,255,255,0.05)] py-10 text-center text-xs tracking-[2px] text-[#4a4a54]">
          MakerHub · 造物主社区 —— AI 造物 · 晒出来 · 买得到
        </footer>
      </body>
    </html>
  );
}
