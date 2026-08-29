import Link from "next/link";
import ProjectCard from "@/components/ProjectCard";
import HeroParticles from "@/components/HeroParticles";
import CubeTower from "@/components/CubeTower";
import Journey from "@/components/Journey";
import { listProjects } from "@/lib/db";
import { TOOLS, REAL_PROJECTS } from "@/lib/catalog";

export const dynamic = "force-dynamic";

const DIFF_STYLE: Record<string, string> = {
  新手: "border-[rgba(76,141,255,0.25)] text-[#8fb6ff]",
  进阶: "border-[rgba(167,139,250,0.3)] text-[#c4b5fd]",
  大佬: "border-[rgba(245,170,90,0.3)] text-[#fcd34d]",
};

export default async function Home() {
  const projects = await listProjects();

  return (
    <>
      {/* ===== Hero ===== */}
      <section className="relative flex min-h-screen flex-col justify-center overflow-hidden px-6 lg:px-14">
        <HeroParticles />
        <div className="relative z-[2] max-w-[860px]">
          <span className="inline-flex items-center gap-2.5 rounded-full border border-[rgba(255,255,255,0.1)] px-4.5 py-2 text-[12.5px] tracking-[3px] text-[#8e8e98]">
            <span className="h-[5px] w-[5px] animate-pulse rounded-full bg-[#4c8dff]" />
            实物 VibeCoding 集合社区
          </span>
          <h1 className="mt-8 font-serif-cn text-5xl font-black leading-[1.12] tracking-[4px] text-[#f4f4f6] lg:text-[84px]">
            用 AI 造物，
            <br />
            晒出来，<span className="text-[#4c8dff]">买得到</span>
          </h1>
          <p className="mt-7 max-w-[560px] text-base leading-[1.9] text-[#8e8e98]">
            从想法到实物，只差一次生成。发现工具、挑一个设计清单，作品回到这里展示、找料、交易。
          </p>
          <div className="mt-11 flex gap-3.5">
            <Link href="/designs" className="btn btn-primary !px-8 !py-3.5 !text-[15px]">
              去生成我的第一个实物
            </Link>
            <Link href="/designs" className="btn btn-outline !px-8 !py-3.5 !text-[15px]">
              浏览设计清单
            </Link>
          </div>
        </div>
        <CubeTower />
      </section>

      {/* ===== 造物旅程 ===== */}
      <Journey />

      {/* ===== 如何使用 ===== */}
      <section className="border-t border-[rgba(255,255,255,0.05)]">
        <div className="mx-auto max-w-[1120px] px-6 py-24 lg:px-12">
          <div className="text-center">
            <div className="kicker">HOW IT WORKS</div>
            <h2 className="mt-3 text-3xl font-extrabold tracking-[2px] lg:text-4xl">
              三步，从想法到实物
            </h2>
          </div>
          <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              {
                n: "01",
                t: "去生成",
                d: "打开 Blueprint / Cirkit / Schematik，用一句话描述你的想法，AI 生成设计 + 零件清单。",
                cta: "去工具站",
                href: "/tools",
              },
              {
                n: "02",
                t: "来发布",
                d: "回到 MakerHub 发布作品，粘贴零件清单（BOM），自动生成淘宝 / 1688 / 拼多多找料链接。",
                cta: "发布作品",
                href: "/submit",
              },
              {
                n: "03",
                t: "做出它",
                d: "按链接买料（平均几十块），照着组装说明做出来，晒实物、挂交易意向，闲鱼成交。",
                cta: "逛逛市场",
                href: "/market",
              },
            ].map((g) => (
              <div
                key={g.n}
                className="card flex flex-col p-7"
              >
                <div className="mono text-[13px] text-[#4c8dff]">{g.n}</div>
                <h3 className="mt-4 text-lg font-bold tracking-[2px]">{g.t}</h3>
                <p className="mt-3 flex-1 text-[13px] leading-[1.9] text-[#77777f]">
                  {g.d}
                </p>
                <Link
                  href={g.href}
                  className="mt-6 inline-block text-[13px] tracking-[1px] text-[#7fa8ff] transition-colors hover:text-[#4c8dff]"
                >
                  {g.cta} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 工具集合 ===== */}
      <section className="mx-auto max-w-[1120px] px-6 py-24 lg:px-12">
        <div className="mb-10">
          <div className="kicker">TOOLS</div>
          <h2 className="mt-3 text-3xl font-extrabold tracking-[2px] lg:text-4xl">
            接入的 AI 造物工具
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          {TOOLS.map((t) => (
            <a
              key={t.name}
              href={t.url}
              target="_blank"
              rel="noopener noreferrer"
              className="card block p-6"
            >
              <div className="mono text-[11px] text-[#4a4a54]">{t.index}</div>
              <h3 className="mt-3 text-base font-semibold tracking-[1px]">
                {t.name}
              </h3>
              <p className="mt-2 text-[12.5px] leading-[1.7] text-[#6e6e78]">
                {t.desc}
              </p>
              <span className="mt-3.5 inline-block rounded border border-[rgba(76,141,255,0.25)] px-2.5 py-1 text-[11px] text-[#8fb6ff]">
                {t.tag}
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* ===== 真实案例 ===== */}
      <section className="mx-auto max-w-[1120px] px-6 pb-24 lg:px-12">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <div className="kicker">REAL PROJECTS</div>
            <h2 className="mt-3 text-3xl font-extrabold tracking-[2px] lg:text-4xl">
              真实造物案例
            </h2>
          </div>
          <Link href="/designs" className="text-[13px] text-[#5e5e68] hover:text-[#4c8dff]">
            全部案例 →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-3.5 md:grid-cols-3">
          {REAL_PROJECTS.map((d) => (
            <Link key={d.id} href={`/designs/${d.id}`} className="card flex flex-col overflow-hidden">
              <div className="flex h-[96px] items-center justify-center border-b border-[rgba(255,255,255,0.06)]">
                <span className="mono text-[11px] tracking-[4px] text-[#565660]">
                  {d.source}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center justify-between text-[15px] font-semibold">
                  {d.title}
                  <span className="text-[13px] text-[#565660] transition-all hover:text-[#4c8dff]">
                    →
                  </span>
                </div>
                <p className="mt-2 line-clamp-2 text-[12.5px] leading-[1.7] text-[#77777f]">
                  {d.desc}
                </p>
                <div className="mt-auto flex items-center justify-between pt-4 text-[11.5px] text-[#5e5e68]">
                  <span className="mono rounded border border-[rgba(76,141,255,0.25)] px-2 py-0.5 text-[11px] not-italic text-[#8fb6ff]">
                    {d.difficulty}
                  </span>
                  <span>👤 {d.author}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== 作品流 ===== */}
      <section className="mx-auto max-w-[1120px] px-6 pb-24 lg:px-12">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <div className="kicker">WORKS</div>
            <h2 className="mt-3 text-3xl font-extrabold tracking-[2px] lg:text-4xl">
              社区精选作品
            </h2>
          </div>
          <Link href="/" className="text-[13px] text-[#5e5e68] hover:text-[#4c8dff]">
            全部作品 →
          </Link>
        </div>
        {projects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[rgba(255,255,255,0.1)] py-20 text-center">
            <p className="text-[#8e8e98]">还没有作品，成为第一个晒作品的人</p>
            <Link href="/submit" className="btn btn-blue mt-6">
              发布作品
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3.5 md:grid-cols-3">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
