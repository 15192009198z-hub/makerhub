import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject } from "@/lib/db";
import { buildPartLinks } from "@/lib/parts";
import LikeButton from "@/components/LikeButton";
import CommentBox from "@/components/CommentBox";
import PartLinks from "@/components/PartLinks";

export const dynamic = "force-dynamic";

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProject(Number(id));
  if (!project) notFound();

  const tagStyle: Record<string, string> = {
    DIY: "bg-emerald-500/15 text-emerald-400 ring-emerald-500/30",
    求购: "bg-amber-500/15 text-amber-400 ring-amber-500/30",
    出二手: "bg-sky-500/15 text-sky-400 ring-sky-500/30",
    帮做: "bg-fuchsia-500/15 text-fuchsia-400 ring-fuchsia-500/30",
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Link
        href="/"
        className="text-sm text-slate-500 hover:text-cyan-400 transition-colors"
      >
        ← 返回作品流
      </Link>

      <article className="mt-4 overflow-hidden rounded-2xl border border-[#1e2a36] bg-[#111a22]">
        {/* 封面 */}
        <div className="flex h-72 items-center justify-center bg-gradient-to-br from-[#14202b] to-[#0d151d]">
          {project.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.imageUrl}
              alt={project.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-7xl">🔧</span>
          )}
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-100">
              {project.title}
            </h1>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${tagStyle[project.dealTag]}`}
            >
              {project.dealTag}
            </span>
            {project.tool && (
              <span className="rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-xs text-cyan-400 ring-1 ring-cyan-500/20">
                ⚡ {project.tool}
              </span>
            )}
          </div>

          <p className="mt-3 text-sm text-slate-500">
            👤 {project.authorName} · 发布于 {project.createdAt}
          </p>

          <p className="mt-5 whitespace-pre-wrap leading-relaxed text-slate-300">
            {project.description}
          </p>

          <div className="mt-5 flex items-center gap-3">
            <LikeButton projectId={project.id} initialLikes={project.likes} />
            {project.dealTag !== "DIY" && (
              <a
                href="https://www.goofish.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md px-3 py-1.5 text-sm ring-1 ring-amber-500/40 text-amber-400 hover:bg-amber-500/10 transition-colors"
              >
                {project.dealTag === "求购" ? "去闲鱼发布求购" : "去闲鱼交易"} ↗
              </a>
            )}
          </div>

          {/* BOM 零件清单 */}
          {project.bomItems.length > 0 && (
            <section className="mt-8">
              <h2 className="mb-3 text-lg font-bold text-slate-100">
                📦 零件清单（BOM）
              </h2>
              <div className="overflow-x-auto rounded-xl border border-[#1e2a36]">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#1e2a36] bg-[#0d151d] text-left text-xs text-slate-500">
                      <th className="px-4 py-2.5">零件</th>
                      <th className="px-4 py-2.5 w-16">数量</th>
                      <th className="px-4 py-2.5">备注</th>
                      <th className="px-4 py-2.5">去哪买</th>
                    </tr>
                  </thead>
                  <tbody>
                    {project.bomItems.map((it, i) => (
                      <tr
                        key={i}
                        className="border-b border-[#16222e] last:border-0"
                      >
                        <td className="px-4 py-3 font-medium text-slate-200">
                          {it.name}
                        </td>
                        <td className="px-4 py-3 text-slate-400">{it.qty}</td>
                        <td className="px-4 py-3 text-xs text-slate-500">
                          {it.note}
                        </td>
                        <td className="px-4 py-3">
                          <PartLinks links={buildPartLinks(it.name)} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-xs text-slate-600">
                💡 点击渠道按钮直接打开对应平台的搜索结果
              </p>
            </section>
          )}

          {/* 评论 */}
          <div className="mt-10">
            <CommentBox
              projectId={project.id}
              initialComments={project.comments}
            />
          </div>
        </div>
      </article>
    </div>
  );
}
