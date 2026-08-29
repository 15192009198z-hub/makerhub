import Link from "next/link";
import ProjectCard from "@/components/ProjectCard";
import { listProjects } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Home() {
  const projects = await listProjects();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Hero */}
      <section className="mb-10 rounded-2xl border border-[#1e2a36] bg-gradient-to-br from-[#12202c] via-[#0e1720] to-[#0a0f14] p-8 sm:p-12">
        <h1 className="max-w-2xl text-3xl font-black leading-tight text-slate-100 sm:text-4xl">
          用 AI 做实物，{" "}
          <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            晒出来，买得到
          </span>
        </h1>
        <p className="mt-4 max-w-2xl text-slate-400">
          让 Blueprint / Cirkit / Schematik 这类 AI 工具生成你的硬件设计，
          在这里发布作品、分享零件清单，一键直达淘宝 / 1688 / 拼多多买料。
          实物版的 GitHub。
        </p>
        <div className="mt-6 flex gap-3">
          <Link
            href="/submit"
            className="rounded-lg bg-cyan-500 px-5 py-2.5 font-semibold text-[#0a0f14] hover:bg-cyan-400 transition-colors"
          >
            🚀 发布我的作品
          </Link>
          <Link
            href="/about"
            className="rounded-lg px-5 py-2.5 ring-1 ring-[#2a3a4a] text-slate-300 hover:ring-cyan-500/40 transition-all"
          >
            了解愿景
          </Link>
        </div>
      </section>

      {/* 作品流 */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-100">
          最新作品{" "}
          <span className="ml-1 text-sm font-normal text-slate-500">
            {projects.length} 个
          </span>
        </h2>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-[#2a3a4a] py-20 text-center">
          <span className="text-5xl">🛠️</span>
          <p className="text-slate-400">
            还没有作品，<span className="text-cyan-400">成为第一个晒作品的人</span>
          </p>
          <Link
            href="/submit"
            className="rounded-md bg-cyan-500/90 px-4 py-2 text-sm font-medium text-[#0a0f14] hover:bg-cyan-400"
          >
            发布作品
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}
    </div>
  );
}
