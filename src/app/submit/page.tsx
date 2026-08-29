"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PartLinks from "@/components/PartLinks";
import { DEAL_TAGS } from "@/lib/types";
import type { PartLink } from "@/lib/types";

interface ParsedItem {
  name: string;
  qty: string;
  note: string;
  links: PartLink[];
}

export default function SubmitPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tool, setTool] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [dealTag, setDealTag] = useState("DIY");
  const [bomText, setBomText] = useState("");
  const [parsed, setParsed] = useState<ParsedItem[] | null>(null);
  const [parsing, setParsing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState("");
  const [showParseHint, setShowParseHint] = useState(false);

  async function parseBom(useLlm = false) {
    if (!bomText.trim()) return;
    setParsing(true);
    setMsg("");
    try {
      const res = await fetch("/api/bom/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: bomText, useLlm }),
      });
      const data = await res.json();
      if (res.ok) {
        setParsed(data.items);
      } else {
        setMsg(data.error || "解析失败");
      }
    } finally {
      setParsing(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMsg("");
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          tool,
          imageUrl,
          dealTag,
          rawBom: bomText,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push(`/p/${data.id}`);
      } else if (res.status === 401) {
        setMsg("请先登录再发布 →");
      } else {
        setMsg(data.error || "发布失败");
      }
    } finally {
      setSubmitting(false);
    }
  }

  const inputCls =
    "w-full rounded-lg border border-[#2a3a4a] bg-[#0d151d] px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 outline-none focus:border-cyan-500/60 transition-colors";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-100">🚀 发布作品</h1>
      <p className="mt-2 text-sm text-slate-500">
        用 AI 做了实物？把设计过程、零件清单贴上来，社区帮你把"去哪买"解决掉。
      </p>

      <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">
            作品标题 *
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={80}
            placeholder="比如：AI 生成的声控灯"
            className={inputCls}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">
            作品描述 *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            placeholder="怎么想到的？用了什么 AI 工具？怎么实现的？踩了什么坑？"
            className={inputCls}
          />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">
              用的 AI 工具
            </label>
            <input
              value={tool}
              onChange={(e) => setTool(e.target.value)}
              maxLength={60}
              placeholder="Blueprint / Cirkit / Schematik…"
              className={inputCls}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">
              交易意向
            </label>
            <select
              value={dealTag}
              onChange={(e) => setDealTag(e.target.value)}
              className={inputCls}
            >
              {DEAL_TAGS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-slate-600">
              站内不交易，成交走闲鱼
            </p>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">
            成品图（图片 URL，可选）
          </label>
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://…（贴一张图片链接，或用图床）"
            className={inputCls}
          />
          {imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt="预览"
              className="mt-2 h-40 rounded-lg border border-[#1e2a36] object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          )}
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="block text-sm font-medium text-slate-300">
              零件清单（BOM）
            </label>
            <button
              type="button"
              onClick={() => setShowParseHint(!showParseHint)}
              className="text-xs text-slate-500 hover:text-cyan-400"
            >
              支持什么格式？
            </button>
          </div>
          <textarea
            value={bomText}
            onChange={(e) => setBomText(e.target.value)}
            rows={5}
            placeholder={"每行一个零件，例如：\nDHT11 温湿度传感器 ×2\n10kΩ 电阻 x4 （1/4W）\nArduino Nano\n面包板 830孔"}
            className={inputCls}
          />
          {showParseHint && (
            <p className="mt-1.5 rounded-lg bg-[#12202c] p-3 text-xs text-slate-400">
              每行一个零件：名称 + 数量（×2 / x4 / 5个）+ 备注（括号里）。
              也可以直接粘贴 Blueprint / Cirkit 导出的 BOM 文本，或
              ChatGPT 给的零件方案，自动解析。
            </p>
          )}
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={() => parseBom(false)}
              disabled={parsing || !bomText.trim()}
              className="rounded-md bg-cyan-500/90 px-4 py-2 text-sm font-medium text-[#0a0f14] hover:bg-cyan-400 disabled:opacity-40"
            >
              {parsing ? "解析中…" : "⚡ 解析并生成找料链接"}
            </button>
          </div>

          {parsed && parsed.length > 0 && (
            <div className="mt-3 overflow-hidden rounded-xl border border-[#1e2a36]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#1e2a36] bg-[#0d151d] text-left text-xs text-slate-500">
                    <th className="px-3 py-2">零件</th>
                    <th className="px-3 py-2 w-14">数量</th>
                    <th className="px-3 py-2">备注</th>
                    <th className="px-3 py-2">找料链接</th>
                  </tr>
                </thead>
                <tbody>
                  {parsed.map((it, i) => (
                    <tr
                      key={i}
                      className="border-b border-[#16222e] last:border-0"
                    >
                      <td className="px-3 py-2.5 font-medium text-slate-200">
                        {it.name}
                      </td>
                      <td className="px-3 py-2.5 text-slate-400">{it.qty}</td>
                      <td className="px-3 py-2.5 text-xs text-slate-500">
                        {it.note}
                      </td>
                      <td className="px-3 py-2.5">
                        <PartLinks links={it.links} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {msg && (
          <p className="text-sm text-amber-400">
            {msg.includes("登录") ? (
              <>
                {msg}{" "}
                <Link href="/login" className="text-cyan-400 underline">
                  去登录
                </Link>
              </>
            ) : (
              msg
            )}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-cyan-500 py-3 font-semibold text-[#0a0f14] hover:bg-cyan-400 disabled:opacity-50 transition-colors"
        >
          {submitting ? "发布中…" : "发布作品"}
        </button>
      </form>
    </div>
  );
}
