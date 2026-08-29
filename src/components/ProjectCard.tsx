import Link from "next/link";
import type { ProjectRow } from "@/lib/db";

const TAG_COLORS: Record<string, string> = {
  DIY: "bg-emerald-500/15 text-emerald-400 ring-emerald-500/30",
  求购: "bg-amber-500/15 text-amber-400 ring-amber-500/30",
  出二手: "bg-sky-500/15 text-sky-400 ring-sky-500/30",
  帮做: "bg-fuchsia-500/15 text-fuchsia-400 ring-fuchsia-500/30",
};

export default function ProjectCard({ project }: { project: ProjectRow }) {
  const tagColor = TAG_COLORS[project.deal_tag] || TAG_COLORS.DIY;
  const date = project.created_at
    ? project.created_at.slice(0, 10)
    : "";
  return (
    <Link
      href={`/p/${project.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-[#1e2a36] bg-[#111a22] transition-all hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/5"
    >
      {/* 封面 */}
      <div className="relative flex h-40 items-center justify-center overflow-hidden bg-gradient-to-br from-[#14202b] to-[#0d151d]">
        {project.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.image_url}
            alt={project.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <span className="text-5xl">🔧</span>
        )}
        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${tagColor}`}
        >
          {project.deal_tag}
        </span>
      </div>
      {/* 内容 */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-1 font-semibold text-slate-100 group-hover:text-cyan-400 transition-colors">
          {project.title}
        </h3>
        <p className="line-clamp-2 text-sm text-slate-400">
          {project.description}
        </p>
        <div className="mt-auto flex items-center justify-between pt-2 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            {project.tool && (
              <span className="rounded bg-cyan-500/10 px-1.5 py-0.5 text-cyan-400/90 ring-1 ring-cyan-500/20">
                {project.tool}
              </span>
            )}
            <span>👤 {project.author_name}</span>
          </span>
          <span className="flex items-center gap-2">
            <span>❤️ {project.likes}</span>
            {date && <span>{date}</span>}
          </span>
        </div>
      </div>
    </Link>
  );
}
