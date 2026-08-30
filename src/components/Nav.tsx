import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";
import Logo from "./Logo";

export default async function Nav() {
  const user = await getCurrentUser();
  const links = [
    { href: "/", label: "作品" },
    { href: "/explore", label: "集合" },
    { href: "/market", label: "市场" },
  ];
  return (
    <header className="sticky top-0 z-50 border-b border-[rgba(255,255,255,0.05)] bg-[rgba(10,10,12,0.7)] backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center px-6 lg:px-10">
        <Link href="/" className="flex items-center gap-3">
          <Logo />
          <span>
            <span className="block text-base font-semibold tracking-[2px] text-[#f0f0f2]">
              MakerHub
            </span>
            <span className="block text-[10px] tracking-[4px] text-[#5e5e68]">
              造物主社区
            </span>
          </span>
        </Link>
        <nav className="ml-10 flex gap-8 lg:ml-16 lg:gap-10">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="relative py-1 text-sm tracking-[1px] text-[#8e8e98] transition-colors hover:text-[#f0f0f2] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-[#4c8dff] after:transition-all after:duration-300 hover:after:w-full"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-5">
          {user ? (
            <>
              {isAdmin(user) && (
                <Link
                  href="/admin"
                  className="text-sm text-[#7fa8ff] transition-colors hover:text-[#4c8dff]"
                >
                  管理后台
                </Link>
              )}
              <Link
                href={`/u/${encodeURIComponent(user.name)}`}
                className="text-sm text-[#8e8e98] transition-colors hover:text-[#f0f0f2]"
              >
                {user.name}
              </Link>
              <form action="/api/logout" method="POST">
                <button className="text-sm text-[#5e5e68] transition-colors hover:text-[#8e8e98]">
                  退出
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="text-sm text-[#8e8e98] transition-colors hover:text-[#f0f0f2]"
            >
              登录
            </Link>
          )}
          <Link href="/submit" className="btn btn-primary !py-2.5 !px-5">
            发布作品
          </Link>
        </div>
      </div>
    </header>
  );
}
