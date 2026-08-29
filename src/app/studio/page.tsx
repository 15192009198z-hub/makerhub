"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import PartLinks from "@/components/PartLinks";
import WiringDiagram from "@/components/WiringDiagram";
import { buildPartLinks } from "@/lib/parts";
import { TOOLS } from "@/lib/catalog";

interface BomItem {
  name: string;
  qty: string;
  note: string;
}

interface StudioResult {
  title: string;
  bom: BomItem[];
  wiring: string;
  connections: { a: string; b: string; note: string }[];
  steps: string[];
  notes: string[];
}

const EXAMPLES = [
  "拍手就能点亮的灯",
  "温度过高会滴滴叫的报警器",
  "能自动避开障碍的小车",
  "养植物的自动浇水器",
];

const PHASES = [
  "AI 正在理解你的想法",
  "正在选型零件",
  "正在生成接线方案",
  "正在整理组装步骤",
];

export default function StudioPage() {
  const router = useRouter();
  const [idea, setIdea] = useState("");
  const [busy, setBusy] = useState(false);
  const [phase, setPhase] = useState(0);
  const [msg, setMsg] = useState("");
  const [result, setResult] = useState<StudioResult | null>(null);
  const [tab, setTab] = useState<"parts" | "wiring" | "steps">("parts");
  const [publishing, setPublishing] = useState(false);
  const phaseTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // 生成中的阶段推进动画
  useEffect(() => {
    if (busy) {
      setPhase(0);
      phaseTimer.current = setInterval(() => {
        setPhase((p) => Math.min(p + 1, PHASES.length - 1));
      }, 1800);
    } else {
      if (phaseTimer.current) clearInterval(phaseTimer.current);
    }
    return () => {
      if (phaseTimer.current) clearInterval(phaseTimer.current);
    };
  }, [busy]);

  async function generate(text?: string) {
    const ideaText = text ?? idea;
    if (!ideaText.trim()) return;
    setBusy(true);
    setMsg("");
    setResult(null);
    setTab("parts");
    try {
      const res = await fetch("/api/studio/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: ideaText }),
      });
      const data = await res.json();
      if (res.ok) setResult(data.result);
      else setMsg(data.error || "生成失败，请稍后重试");
    } catch {
      setMsg("网络错误，请重试");
    } finally {
      setBusy(false);
    }
  }

  async function publish() {
    if (!result) return;
    setPublishing(true);
    setMsg("");
    try {
      const bomText = result.bom
        .map((b) => `${b.name} ×${b.qty}${b.note ? ` （${b.note}）` : ""}`)
        .join("\n");
      const connText = result.connections
        .map((c) => `${c.a} — ${c.b}（${c.note}）`)
        .join("；");
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: result.title,
          description: `由 MakerHub AI 造物工作室生成。\n\n🧠 想法：${idea.trim()}\n\n🔌 接线：${result.wiring}${connText ? `\n连接：${connText}` : ""}\n\n📝 步骤：${result.steps.map((s, i) => `${i + 1}. ${s}`).join(" ")}`,
          tool: "MakerHub 工作室",
          imageUrl: "",
          dealTag: "DIY",
          rawBom: bomText,
        }),
      });
      const data = await res.json();
      if (res.ok) router.push(`/p/${data.id}`);
      else if (res.status === 401) setMsg("请先登录再发布 →");
      else setMsg(data.error || "发布失败");
    } finally {
      setPublishing(false);
    }
  }

  const tabs = [
    { id: "parts" as const, label: `零件清单 · ${result?.bom.length ?? 0}` },
    { id: "wiring" as const, label: "接线图" },
    { id: "steps" as const, label: "组装步骤" },
  ];

  return (
    <div className="mx-auto max-w-[960px] px-6 py-14 lg:px-8">
      <div className="kicker">AI STUDIO</div>
      <h1 className="mt-3 text-4xl font-black tracking-[2px]">AI 造物工作室</h1>
      <p className="mt-4 max-w-[640px] text-[15px] leading-[1.9] text-[#8e8e98]">
        用一句话描述你想做的实物，AI 生成完整方案：零件清单 + 接线图 +
        组装步骤，直接接上国内购买链接。全程中文，不用跳转任何外站。
      </p>

      {/* 输入区 */}
      <div className="mt-10 rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#0f0f12] p-7">
        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          rows={3}
          maxLength={500}
          placeholder="描述你想做的实物，比如：做一个养植物的自动浇水器，缺水就提醒我"
          className="w-full rounded-lg border border-[rgba(255,255,255,0.12)] bg-[#0d0d10] px-4 py-3.5 text-[15px] leading-[1.8] text-[#e8e8ea] placeholder-[#5e5e68] outline-none focus:border-[rgba(76,141,255,0.6)]"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => {
                setIdea(ex);
                generate(ex);
              }}
              className="rounded-full border border-[rgba(255,255,255,0.1)] px-3.5 py-1.5 text-[12px] text-[#8e8e98] transition-colors hover:border-[rgba(76,141,255,0.5)] hover:text-[#7fa8ff]"
            >
              {ex}
            </button>
          ))}
        </div>
        <div className="mt-5 flex items-center gap-4">
          <button
            onClick={() => generate()}
            disabled={busy || !idea.trim()}
            className="btn btn-blue !px-8 !py-3 disabled:opacity-40"
          >
            {busy ? "生成中…" : "⚡ 生成造物方案"}
          </button>
          {busy && (
            <div className="flex items-center gap-2.5">
              <span className="h-1.5 w-1.5 animate-ping rounded-full bg-[#4c8dff]" />
              <span className="mono text-[12px] tracking-[1px] text-[#7fa8ff]">
                {PHASES[phase]}
              </span>
            </div>
          )}
        </div>
        {msg && <p className="mt-4 text-[13px] leading-[1.8] text-[#e8c07e]">{msg}</p>}
      </div>

      {/* 结果区 */}
      {result && (
        <div className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="font-serif-cn text-2xl font-black tracking-[2px]">
              {result.title}
            </h2>
            <button
              onClick={publish}
              disabled={publishing}
              className="btn btn-primary disabled:opacity-40"
            >
              {publishing ? "发布中…" : "发布到社区"}
            </button>
          </div>

          {/* 分页签 */}
          <div className="mt-6 flex gap-1 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0f0f12] p-1.5">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex-1 rounded-lg py-2.5 text-[13px] font-semibold tracking-[1px] transition-all ${
                  tab === t.id
                    ? "bg-[#f2f2f4] text-[#0a0a0c]"
                    : "text-[#8e8e98] hover:text-[#f0f0f2]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* 零件清单 */}
          {tab === "parts" && (
            <div className="mt-5 flex flex-col gap-3">
              {result.bom.map((b, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0f0f12] px-5 py-4 transition-colors hover:border-[rgba(76,141,255,0.35)]"
                >
                  <div className="mono flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[rgba(76,141,255,0.3)] text-[12px] text-[#7fa8ff]">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[14.5px] font-semibold">
                      {b.name}
                    </div>
                    {b.note && (
                      <div className="mt-0.5 text-[12px] text-[#6e6e78]">
                        {b.note}
                      </div>
                    )}
                  </div>
                  <div className="mono shrink-0 text-[13px] text-[#c8c8ce]">
                    ×{b.qty}
                  </div>
                  <div className="shrink-0">
                    <PartLinks links={buildPartLinks(b.name)} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 接线图 */}
          {tab === "wiring" && (
            <div className="mt-5 flex flex-col gap-4">
              {result.connections.length > 0 ? (
                <WiringDiagram connections={result.connections} />
              ) : (
                <p className="text-[13px] text-[#5e5e68]">暂无连接数据</p>
              )}
              {result.wiring && (
                <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0f0f12] p-6">
                  <h3 className="text-[13px] font-bold tracking-[2px] text-[#8fb6ff]">
                    🔌 接线说明
                  </h3>
                  <p className="mt-3 text-[14px] leading-[1.9] text-[#c8c8ce]">
                    {result.wiring}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 步骤 */}
          {tab === "steps" && (
            <div className="mt-5 flex flex-col gap-4">
              <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0f0f12] p-6">
                <h3 className="text-[13px] font-bold tracking-[2px] text-[#8fb6ff]">
                  🛠️ 组装步骤
                </h3>
                <ol className="mt-4 flex flex-col gap-3">
                  {result.steps.map((s, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-[14px] leading-[1.8] text-[#c8c8ce]"
                    >
                      <span className="mono mt-0.5 text-[12px] text-[#4c8dff]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {s}
                    </li>
                  ))}
                </ol>
              </div>
              {result.notes.length > 0 && (
                <div className="rounded-xl border border-[rgba(245,170,90,0.2)] bg-[rgba(245,158,11,0.04)] p-6">
                  <h3 className="text-[13px] font-bold tracking-[2px] text-[#e8c07e]">
                    ⚠️ 注意事项
                  </h3>
                  <ul className="mt-3 flex flex-col gap-2">
                    {result.notes.map((n, i) => (
                      <li
                        key={i}
                        className="text-[13.5px] leading-[1.8] text-[#c8b89a]"
                      >
                        · {n}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 进阶工具 */}
      <div className="mt-16">
        <div className="flex items-end justify-between">
          <div>
            <div className="kicker">ADVANCED TOOLS</div>
            <h2 className="mt-3 text-xl font-extrabold tracking-[2px]">
              想用原版工具？进阶选项
            </h2>
          </div>
        </div>
        <p className="mt-3 max-w-[560px] text-[13px] leading-[1.8] text-[#6e6e78]">
          工作室已覆盖大部分需求。这四个工具站功能更全（英文界面），
          适合想深入学习、做专业项目的造物主。
        </p>
        <div className="mt-6 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          {TOOLS.map((t) => (
            <a
              key={t.name}
              href={t.url}
              target="_blank"
              rel="noopener noreferrer"
              className="card block p-5"
            >
              <div className="mono text-[10.5px] text-[#4a4a54]">{t.index}</div>
              <h3 className="mt-2 text-[15px] font-semibold tracking-[1px]">
                {t.name}{" "}
                <span className="ml-1 text-[12px] text-[#565660]">↗</span>
              </h3>
              <p className="mt-1.5 text-[12px] leading-[1.7] text-[#6e6e78]">
                {t.desc}
              </p>
              <span className="mt-3 inline-block rounded border border-[rgba(76,141,255,0.25)] px-2 py-0.5 text-[10.5px] text-[#8fb6ff]">
                {t.tag}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
