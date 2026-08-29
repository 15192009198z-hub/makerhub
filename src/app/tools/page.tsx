import { TOOLS } from "@/lib/catalog";

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-[1120px] px-6 py-16 lg:px-12">
      <div className="kicker">TOOLS</div>
      <h1 className="mt-3 text-4xl font-black tracking-[2px]">AI 造物工具</h1>
      <p className="mt-4 max-w-[600px] text-[15px] leading-[1.9] text-[#8e8e98]">
        从这里的任意工具出发生成你的设计——生成后把零件清单带回 MakerHub，
        一键找到国内购买渠道。
      </p>

      <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2">
        {TOOLS.map((t) => (
          <a
            key={t.name}
            href={t.url}
            target="_blank"
            rel="noopener noreferrer"
            className="card flex items-start gap-5 p-7"
          >
            <div className="mono text-[12px] text-[#4a4a54]">{t.index}</div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold tracking-[1px]">{t.name}</h3>
              <p className="mt-2 text-[13px] leading-[1.7] text-[#77777f]">
                {t.desc}
              </p>
              <span className="mt-4 inline-block rounded border border-[rgba(76,141,255,0.25)] px-2.5 py-1 text-[11px] text-[#8fb6ff]">
                {t.tag} · 免费使用
              </span>
            </div>
            <span className="text-[15px] text-[#565660] transition-all group-hover:text-[#4c8dff]">
              ↗
            </span>
          </a>
        ))}
      </div>

      <div className="mt-14 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0f0f12] p-7">
        <h3 className="text-base font-bold tracking-[1px]">💡 工作流</h3>
        <p className="mt-3 text-[14px] leading-[1.9] text-[#8e8e98]">
          在工具里生成设计 → 拿到零件清单（BOM）→ 回到 MakerHub
          发布作品（粘贴 BOM，自动生成国内找料链接）→ 买料做出实物 →
          作品挂上交易意向，被更多人看到。
        </p>
      </div>
    </div>
  );
}
