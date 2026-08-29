import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";

export default async function Nav() {
  const user = await getCurrentUser();
  return (
    <header className="sticky top-0 z-10 border-b border-[#1e2a36] bg-[#0a0f14]/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-cyan-500/20 text-sm font-black text-cyan-400 ring-1 ring-cyan-500/40">
            M
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-100">
            MakerHub
          </span>
        </Link>
        <nav className="flex flex-1 items-center gap-5 text-sm text-slate-400">
          <Link href="/" className="hover:text-cyan-400 transition-colors">
            作品
          </Link>
          <Link href="/about" className="hover:text-cyan-400 transition-colors">
            关于
          </Link>
        </nav>
        <div className="flex items-center gap-3 text-sm">
          {user ? (
            <>
              <span className="text-slate-300">
                👋 <span className="font-medium text-cyan-400">{user.name}</span>
              </span>
              <form action="/api/logout" method="POST">
                <button className="text-slate-500 hover:text-slate-300 transition-colors">
                  退出
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-md px-3 py-1.5 text-slate-300 ring-1 ring-[#2a3a4a] hover:ring-cyan-500/50 hover:text-cyan-400 transition-all"
            >
              登录
            </Link>
          )}
          <Link
            href="/submit"
            className="rounded-md bg-cyan-500/90 px-3.5 py-1.5 font-medium text-[#0a0f14] hover:bg-cyan-400 transition-colors"
          >
            发布作品
          </Link>
        </div>
      </div>
    </header>
  );
}
