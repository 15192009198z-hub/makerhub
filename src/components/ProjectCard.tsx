import Link from "next/link";
import type { ProjectRow } from "@/lib/db";

const TAG_COLORS: Record<string, string> = {
  DIY: "border-[rgba(139,200,158,0.35)] text-[#9dc9ab]",
  求购: "border-[rgba(240,180,90,0.35)] text-[#e8c07e]",
  出二手: "border-[rgba(76,141,255,0.35)] text-[#7fa8ff]",
  帮做: "border-[rgba(167,139,250,0.35)] text-[#c4b5fd]",
};

export default function ProjectCard({ project }: { project: ProjectRow }) {
  const tagColor = TAG_COLORS[project.deal_tag] || TAG_COLORS.DIY;
  const date = project.created_at ? project.created_at.slice(0, 10) : "";
  return (
    <Link href={`/p/${project.id}`} className="card block overflow-hidden">
      <div className="flex h-[140px] items-center justify-center border-b border-[rgba(255,255,255,0.06)] bg-gradient-to-b from-[#111116] to-[#0d0d10] text-[26px] text-[#565660]">
        {project.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.image_url}
            alt={project.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="mono text-[13px] tracking-[3px]">▣</span>
        )}
      </div>
      <div className="p-4.5">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-[14px] font-semibold">
            {project.title}
          </span>
          <span
            className={`shrink-0 rounded border px-1.5 py-0.5 text-[10.5px] ${tagColor}`}
          >
            {project.deal_tag}
          </span>
        </div>
        <div className="mt-2 flex items-center gap-3 text-xs text-[#6e6e78]">
          <span>{project.tool || "手工"}</span>
          <span>·</span>
          <span>❤ {project.likes}</span>
          {date && (
            <>
              <span>·</span>
              <span>{date}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
