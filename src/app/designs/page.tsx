import Link from "next/link";
import { REAL_PROJECTS } from "@/lib/catalog";

const DIFF_STYLE: Record<string, string> = {
  新手: "border-[rgba(76,141,255,0.25)] text-[#8fb6ff]",
  进阶: "border-[rgba(167,139,250,0.3)] text-[#c4b5fd]",
  大佬: "border-[rgba(245,170,90,0.3)] text-[#fcd34d]",
};

export default function DesignsPage() {
  return (
    <div className="mx-auto max-w-[1120px] px-6 py-16 lg:px-12">
      <div className="kicker">REAL PROJECTS</div>
      <h1 className="mt-3 text-4xl font-black tracking-[2px]">真实造物案例</h1>
      <p className="mt-4 max-w-[640px] text-[15px] leading-[1.9] text-[#8e8e98]">
        这些是来自 Blueprint 社区的真实硬件项目——别人用 AI
        工具设计并做出来的东西。点进原项目看完整过程，找找灵感，
        然后从你自己的第一个想法开始。
      </p>

      <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {REAL_PROJECTS.map((d) => (
          <Link key={d.id} href={`/designs/${d.id}`} className="card flex flex-col overflow-hidden">
            <div className="flex h-[110px] items-center justify-center border-b border-[rgba(255,255,255,0.06)]">
              <span className="mono text-[12px] tracking-[4px] text-[#565660]">
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
              <p className="mt-2 text-[12.5px] leading-[1.7] text-[#77777f]">
                {d.desc}
              </p>
              <div className="mt-auto flex items-center justify-between pt-4">
                <span
                  className={`mono rounded border px-2 py-0.5 text-[11px] not-italic ${DIFF_STYLE[d.difficulty]}`}
                >
                  {d.difficulty}
                </span>
                <span className="text-[11.5px] text-[#5e5e68]">
                  👤 {d.author}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-12 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0f0f12] p-7">
        <h3 className="text-base font-bold tracking-[1px]">💡 怎么开始？</h3>
        <p className="mt-3 text-[14px] leading-[1.9] text-[#8e8e98]">
          打开一个工具（Blueprint / Cirkit / Schematik），描述你的想法 →
          生成设计拿到零件清单 → 回到 MakerHub 发布，一键找料 →
          买料做出实物 → 把你的作品挂上交易意向。
        </p>
        <Link href="/tools" className="btn btn-blue mt-5">
          去工具站看看
        </Link>
      </div>
    </div>
  );
}
