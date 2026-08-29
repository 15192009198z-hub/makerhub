import Link from "next/link";
import { notFound } from "next/navigation";
import { DESIGNS } from "@/lib/catalog";
import PartLinks from "@/components/PartLinks";
import { buildPartLinks } from "@/lib/parts";

export const dynamicParams = false;

export function generateStaticParams() {
  return DESIGNS.map((d) => ({ id: d.id }));
}

const DIFF_STYLE: Record<string, string> = {
  新手: "border-[rgba(76,141,255,0.25)] text-[#8fb6ff]",
  进阶: "border-[rgba(167,139,250,0.3)] text-[#c4b5fd]",
  大佬: "border-[rgba(245,170,90,0.3)] text-[#fcd34d]",
};

export default async function DesignDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const design = DESIGNS.find((d) => d.id === id);
  if (!design) notFound();

  // 解析 BOM 行（catalog 里是 "名称 x1 （备注）" 格式）
  const bomRows = design.bom.map((line) => {
    const m = line.match(/^(.*?)\s*[×x]\s*(\d+)\s*(?:（(.*?)）)?\s*$/);
    return m
      ? { name: m[1], qty: m[2], note: m[3] || "" }
      : { name: line, qty: "1", note: "" };
  });

  return (
    <div className="mx-auto max-w-[860px] px-6 py-14 lg:px-8">
      <Link href="/designs" className="text-[13px] text-[#5e5e68] hover:text-[#4c8dff]">
        ← 全部设计清单
      </Link>

      <div className="mt-6 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0f0f12] text-[26px]">
          {design.icon}
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-[2px]">{design.title}</h1>
          <div className="mt-2 flex gap-3 text-[12px] text-[#9a9aa3]">
            <span>
              难度
              <em
                className={`mono ml-1 rounded border px-1.5 py-0.5 not-italic ${DIFF_STYLE[design.difficulty]}`}
              >
                {design.difficulty}
              </em>
            </span>
            <span>
              成本<em className="mono ml-1 not-italic">¥{design.cost}</em>
            </span>
            <span>
              时长<em className="mono ml-1 not-italic">{design.duration}</em>
            </span>
            <span>
              工具<em className="ml-1 not-italic text-[#8fb6ff]">{design.tool}</em>
            </span>
          </div>
        </div>
      </div>

      <p className="mt-6 text-[15px] leading-[1.9] text-[#8e8e98]">
        {design.desc}
      </p>

      {/* 开始步骤 */}
      <div className="mt-10 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0f0f12] p-6">
        <h2 className="text-lg font-bold tracking-[1px]">开始造物</h2>
        <ol className="mt-4 flex flex-col gap-3">
          {design.steps.map((s, i) => (
            <li key={i} className="flex items-start gap-3 text-[14px] leading-[1.7] text-[#c8c8ce]">
              <span className="mono mt-0.5 text-[12px] text-[#4c8dff]">
                {String(i + 1).padStart(2, "0")}
              </span>
              {s}
            </li>
          ))}
        </ol>
        <a
          href={TOOLS_URL(design.tool)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary mt-6"
        >
          去 {design.tool} 生成 →
        </a>
      </div>

      {/* BOM */}
      <div className="mt-8">
        <h2 className="text-lg font-bold tracking-[1px]">📦 零件清单</h2>
        <div className="mt-4 overflow-hidden rounded-xl border border-[rgba(255,255,255,0.08)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.08)] bg-[#0d0d10] text-left text-xs text-[#5e5e68]">
                <th className="px-4 py-2.5">零件</th>
                <th className="w-16 px-4 py-2.5">数量</th>
                <th className="px-4 py-2.5">备注</th>
                <th className="px-4 py-2.5">去哪买</th>
              </tr>
            </thead>
            <tbody>
              {bomRows.map((it, i) => (
                <tr key={i} className="border-b border-[rgba(255,255,255,0.05)] last:border-0">
                  <td className="px-4 py-3 font-medium text-[#e8e8ea]">
                    {it.name}
                  </td>
                  <td className="px-4 py-3 text-[#8e8e98]">{it.qty}</td>
                  <td className="px-4 py-3 text-xs text-[#6e6e78]">{it.note}</td>
                  <td className="px-4 py-3">
                    <PartLinks links={buildPartLinks(it.name)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const TOOL_URLS: Record<string, string> = {
  Blueprint: "https://www.blueprint.io/",
  "Cirkit Designer": "https://www.cirkitdesigner.com/",
  Schematik: "https://www.schematik.io/",
  "Flux.ai": "https://www.flux.ai/",
};
function TOOLS_URL(name: string): string {
  return TOOL_URLS[name] || "https://www.blueprint.io/";
}
