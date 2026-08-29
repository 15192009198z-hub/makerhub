import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <div className="mono text-[13px] tracking-[6px] text-[#4c8dff]">404</div>
      <h1 className="mt-5 font-serif-cn text-4xl font-black tracking-[4px]">
        页面不存在
      </h1>
      <p className="mt-4 max-w-[420px] text-[14px] leading-[1.9] text-[#8e8e98]">
        这个页面可能被移动或删除了。回到首页，去工作室造点东西吧。
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/" className="btn btn-primary">
          回到首页
        </Link>
        <Link href="/studio" className="btn btn-outline">
          去 AI 工作室
        </Link>
      </div>
    </div>
  );
}
