export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="text-3xl font-black text-slate-100">关于 MakerHub</h1>

      <section className="mt-8 space-y-6 text-slate-400 leading-relaxed">
        <div className="rounded-xl border border-[#1e2a36] bg-[#111a22] p-6">
          <h2 className="mb-2 font-bold text-slate-200">🎯 这是什么</h2>
          <p>
            MakerHub 是一个围绕"AI 生成的实物硬件"的开源社区。GitHub
            上大家发代码仓库，MakerHub 上大家发实物作品——用 Blueprint、
            Cirkit Designer、Schematik 这些 AI 工具设计出来的硬件，晒作品、
            分享零件清单（BOM）、一键找到国内购买渠道。
          </p>
        </div>

        <div className="rounded-xl border border-[#1e2a36] bg-[#111a22] p-6">
          <h2 className="mb-2 font-bold text-slate-200">🔩 核心功能</h2>
          <ul className="list-inside list-disc space-y-1.5">
            <li>
              <span className="text-cyan-400">作品卡片</span>
              ：描述 + 成品图 + 用的 AI 工具 + 交易意向
            </li>
            <li>
              <span className="text-cyan-400">BOM 智能解析</span>
              ：粘贴零件清单，自动解析成结构化表格
            </li>
            <li>
              <span className="text-cyan-400">一键找料</span>
              ：每个零件自动生成淘宝 / 1688 / 拼多多搜索链接
            </li>
            <li>
              <span className="text-cyan-400">交易意向</span>
              ：求购 / 出二手 / 帮做，成交一律走闲鱼，站内不做支付
            </li>
          </ul>
        </div>

        <div className="rounded-xl border border-[#1e2a36] bg-[#111a22] p-6">
          <h2 className="mb-2 font-bold text-slate-200">🌱 开放与开源</h2>
          <p>
            MakerHub 本身就是一个 vibecoding 的产物——全站由 AI
            生成。代码完全开源，欢迎提交作品、提需求、写代码。
            <br />
            <span className="text-slate-600">
              （开源仓库地址上线后公布）
            </span>
          </p>
        </div>
      </section>
    </div>
  );
}
