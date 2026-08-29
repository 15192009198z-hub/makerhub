import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "MakerHub · 实物版 GitHub",
  description:
    "用 AI 做实物硬件，在这里晒作品、分享零件清单、一键找到国内购买渠道。实物版的 GitHub。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#0a0f14] text-slate-200">
        <Nav />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-[#1e2a36] py-6 text-center text-xs text-slate-500">
          MakerHub · 实物版 GitHub —— AI 做硬件，晒出来，买得到
        </footer>
      </body>
    </html>
  );
}
