import Link from "next/link";
import { DESIGNS } from "@/lib/catalog";

const DIFF_STYLE: Record<string, string> = {
  新手: "border-[rgba(76,141,255,0.25)] text-[#8fb6ff]",
  进阶: "border-[rgba(167,139,250,0.3)] text-[#c4b5fd]",
  大佬: "border-[rgba(245,170,90,0.3)] text-[#fcd34d]",
};

export default function DesignsPage() {
  return (
    <div className="mx-auto max-w-[1120px] px-6 py-16 lg:px-12">
      <div className="kicker">DESIGNS</div>
      <h1 className="mt-3 text-4xl font-black tracking-[2px]">AI 设计清单</h1>
      <p className="mt-4 max-w-[600px] text-[15px] leading-[1.9] text-[#8e8e98]">
        每个清单都包含完整的零件表、找料链接和组装步骤——从任何一个出发，
        用 AI 生成设计，做出你的第一个实物。
      </p>

      <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {DESIGNS.map((d) => (
          <Link key={d.id} href={`/designs/${d.id}`} className="card overflow-hidden">
            <div className="flex h-[120px] items-center justify-center border-b border-[rgba(255,255,255,0.06)] text-[30px] text-[#565660]">
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
    </div>
  );
}
