import Link from "next/link";
import { listCollection, favoriteIds } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import FavButton from "@/components/FavButton";

export const dynamic = "force-dynamic";

const DIFF_STYLE: Record<string, string> = {
  新手: "border-[rgba(76,141,255,0.25)] text-[#8fb6ff]",
  进阶: "border-[rgba(167,139,250,0.3)] text-[#c4b5fd]",
  大佬: "border-[rgba(245,170,90,0.3)] text-[#fcd34d]",
};

const SOURCE_LABEL: Record<string, string> = {
  blueprint: "Blueprint 社区",
  reddit: "Reddit",
  instructables: "Instructables",
};

export default async function ExplorePage() {
  const [items, user] = await Promise.all([
    listCollection(60),
    getCurrentUser(),
  ]);
  const favs = user ? await favoriteIds(user.id, "collection") : [];

  const types = ["全部", ...new Set(items.map((c) => c.type))];

  return (
    <div className="mx-auto max-w-[1120px] px-6 py-16 lg:px-12">
      <div className="flex items-end justify-between">
        <div>
          <div className="kicker">COLLECTION</div>
          <h1 className="mt-3 text-4xl font-black tracking-[2px]">作品集合</h1>
          <p className="mt-4 max-w-[640px] text-[15px] leading-[1.9] text-[#8e8e98]">
            全球 AI 硬件社区的真实作品，自动聚合、AI 翻译成中文——
            不用翻墙、不用读英文，就能逛遍全球造物主的作品。
          </p>
        </div>
        <span className="mono hidden text-[12px] text-[#5e5e68] sm:block">
          {items.length} 个作品 · 每日更新
        </span>
      </div>

      {/* 类型筛选 */}
      <div className="mt-8 flex flex-wrap gap-2">
        {types.map((t) => (
          <button
            key={t}
            className="rounded-full border border-[rgba(255,255,255,0.1)] px-4 py-1.5 text-[12.5px] text-[#8e8e98] transition-colors hover:border-[rgba(76,141,255,0.5)] hover:text-[#7fa8ff]"
          >
            {t}
          </button>
        ))}
      </div>

      {/* 卡片网格 */}
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((c) => (
          <div key={c.id} className="card flex flex-col overflow-hidden">
            <div className="relative flex h-[110px] items-center justify-center border-b border-[rgba(255,255,255,0.06)] bg-gradient-to-b from-[#111116] to-[#0d0d10]">
              <span className="mono text-[11px] tracking-[4px] text-[#4a4a54]">
                {String(c.type || "其他").toUpperCase()}
              </span>
              <span className="absolute right-3 top-3">
                <FavButton
                  itemId={c.id}
                  itemType="collection"
                  initial={favs.includes(c.id)}
                />
              </span>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-center justify-between gap-2">
                <h3 className="truncate text-[15px] font-semibold">
                  {c.title_zh || c.title_en}
                </h3>
              </div>
              <p className="mt-2.5 line-clamp-3 text-[12.5px] leading-[1.75] text-[#77777f]">
                {c.desc_zh || c.desc_en}
              </p>
              <div className="mt-auto flex items-center justify-between pt-4">
                <span
                  className={`mono rounded border px-2 py-0.5 text-[10.5px] not-italic ${DIFF_STYLE[c.difficulty] || DIFF_STYLE.新手}`}
                >
                  {c.difficulty}
                </span>
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-[#5e5e68] transition-colors hover:text-[#4c8dff]"
                >
                  {SOURCE_LABEL[c.source] || c.source} · 查看原项目 ↗
                </a>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-[rgba(255,255,255,0.1)] py-24 text-center">
            <p className="text-[#8e8e98]">集合还是空的，正在抓取全球作品…</p>
          </div>
        )}
      </div>

      <div className="mt-12 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0f0f12] p-7 text-center">
        <p className="text-[14px] leading-[1.9] text-[#8e8e98]">
          看中了某个作品？联系造物主、或者找类似的现成作品——
        </p>
        <div className="mt-4 flex justify-center gap-3">
          <Link href="/market" className="btn btn-blue">
            去市场逛逛
          </Link>
          <Link href="/studio" className="btn btn-outline">
            自己试着生成
          </Link>
        </div>
      </div>
    </div>
  );
}
