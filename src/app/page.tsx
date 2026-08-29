import Link from "next/link";
import ProjectCard from "@/components/ProjectCard";
import HeroParticles from "@/components/HeroParticles";
import CubeTower from "@/components/CubeTower";
import Journey from "@/components/Journey";
import { listProjects } from "@/lib/db";
import { TOOLS, DESIGNS } from "@/lib/catalog";

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
          <div className="mt-16 grid max-w-[880px] grid-cols-4 border-t border-[rgba(255,255,255,0.07)] pt-11">
            {[
              ["128", "AI 设计清单"],
              ["06", "接入工具"],
              ["2,431", "实物作品"],
              ["¥36", "平均造物成本"],
            ].map(([num, label]) => (
              <div key={label} className="text-center">
                <div className="mono text-3xl font-bold tracking-[-0.5px]">
                  {num}
                </div>
                <div className="mt-1.5 text-[12.5px] tracking-[1.5px] text-[#6e6e78]">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
        <CubeTower />
      </section>

      {/* ===== 造物旅程 ===== */}
      <Journey />

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

      {/* ===== 设计清单 ===== */}
      <section className="mx-auto max-w-[1120px] px-6 pb-24 lg:px-12">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <div className="kicker">DESIGNS</div>
            <h2 className="mt-3 text-3xl font-extrabold tracking-[2px] lg:text-4xl">
              可以试的 AI 设计清单
            </h2>
          </div>
          <Link href="/designs" className="text-[13px] text-[#5e5e68] hover:text-[#4c8dff]">
            全部清单 →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-3.5 md:grid-cols-3">
          {DESIGNS.map((d) => (
            <Link key={d.id} href={`/designs/${d.id}`} className="card overflow-hidden">
              <div className="flex h-[108px] items-center justify-center border-b border-[rgba(255,255,255,0.06)] text-[26px] text-[#565660]">
                {d.icon}
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between text-[15px] font-semibold">
                  {d.title}
                  <span className="text-[13px] text-[#565660] transition-all hover:text-[#4c8dff]">
                    →
                  </span>
                </div>
                <p className="mt-2 text-[12.5px] leading-[1.6] text-[#77777f]">
                  {d.desc}
                </p>
                <div className="mt-4 flex gap-3 text-[11.5px] text-[#9a9aa3]">
                  <span>
                    难度
                    <em
                      className={`mono ml-1 rounded border px-1.5 py-0.5 not-italic ${DIFF_STYLE[d.difficulty]}`}
                    >
                      {d.difficulty}
                    </em>
                  </span>
                  <span>
                    成本<em className="mono ml-1 not-italic text-[#c9c9cf]">¥{d.cost}</em>
                  </span>
                  <span>
                    时长<em className="mono ml-1 not-italic text-[#c9c9cf]">{d.duration}</em>
                  </span>
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
