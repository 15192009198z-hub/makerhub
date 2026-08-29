import Link from "next/link";
import { notFound } from "next/navigation";
import { REAL_PROJECTS } from "@/lib/catalog";

export const dynamicParams = false;

export function generateStaticParams() {
  return REAL_PROJECTS.map((d) => ({ id: d.id }));
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
  const project = REAL_PROJECTS.find((d) => d.id === id);
  if (!project) notFound();

  return (
    <div className="mx-auto max-w-[860px] px-6 py-14 lg:px-8">
      <Link
        href="/designs"
        className="text-[13px] text-[#5e5e68] hover:text-[#4c8dff]"
      >
        ← 全部案例
      </Link>

      <div className="mt-6 flex items-center gap-5">
        <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0f0f12]">
          <span className="mono text-[11px] tracking-[2px] text-[#4c8dff]">
            REAL
          </span>
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-[2px]">{project.title}</h1>
          <div className="mt-2 flex gap-4 text-[12px] text-[#9a9aa3]">
            <span>
              难度
              <em
                className={`mono ml-1 rounded border px-1.5 py-0.5 not-italic ${DIFF_STYLE[project.difficulty]}`}
              >
                {project.difficulty}
              </em>
            </span>
            <span>作者 <em className="ml-1 not-italic text-[#c9c9cf]">{project.author}</em></span>
            <span>来源 <em className="ml-1 not-italic text-[#8fb6ff]">{project.source}</em></span>
          </div>
        </div>
      </div>

      <p className="mt-7 text-[15px] leading-[1.9] text-[#c8c8ce]">
        {project.desc}
      </p>

      <div className="mt-10 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0f0f12] p-7">
        <h2 className="text-lg font-bold tracking-[1px]">📎 原项目</h2>
        <p className="mt-3 text-[13.5px] leading-[1.8] text-[#8e8e98]">
          这个项目来自 Blueprint 社区，包含完整的设计过程、零件清单和组装记录。
          去原项目查看全部细节，或者学习它的思路。
        </p>
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary mt-5"
        >
          查看原项目 ↗
        </a>
      </div>

      <div className="mt-8 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0f0f12] p-7">
        <h2 className="text-lg font-bold tracking-[1px]">🚀 受到启发了？</h2>
        <p className="mt-3 text-[13.5px] leading-[1.8] text-[#8e8e98]">
          用 AI 工具生成你自己的版本：打开工具描述想法 → 拿到零件清单 →
          回到 MakerHub 发布作品，一键生成国内购买链接。
        </p>
        <div className="mt-5 flex gap-3">
          <Link href="/tools" className="btn btn-outline">
            去工具站
          </Link>
          <Link href="/submit" className="btn btn-blue">
            发布我的作品
          </Link>
        </div>
      </div>
    </div>
  );
}
