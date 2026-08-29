"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  return (
    <Suspense fallback={null}>
      <SubmitInner />
    </Suspense>
  );
}

function SubmitInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") === "product" ? "product" : "project";
  const [tab, setTab] = useState<"project" | "product">(mode);

  return (
    <div className="mx-auto max-w-3xl px-6 py-14 lg:px-8">
      <h1 className="text-2xl font-black tracking-[2px]">
        {tab === "project" ? "🚀 发布作品" : "🛒 上架商品"}
      </h1>
      <p className="mt-2 text-[13.5px] leading-[1.8] text-[#8e8e98]">
        {tab === "project"
          ? "用 AI 做了实物？把设计过程、零件清单贴上来，社区帮你把「去哪买」解决掉。"
          : "把你的造物变成商品——卖实物、卖设计、卖教程，意向单成交走闲鱼。"}
      </p>

      {/* 切换 */}
      <div className="mt-6 flex gap-2 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0f0f12] p-1.5">
        <button
          onClick={() => setTab("project")}
          className={`flex-1 rounded-lg py-2.5 text-sm font-semibold tracking-[1px] transition-all ${
            tab === "project"
              ? "bg-[#f2f2f4] text-[#0a0a0c]"
              : "text-[#8e8e98] hover:text-[#f0f0f2]"
          }`}
        >
          发布作品
        </button>
        <button
          onClick={() => setTab("product")}
          className={`flex-1 rounded-lg py-2.5 text-sm font-semibold tracking-[1px] transition-all ${
            tab === "product"
              ? "bg-[#f2f2f4] text-[#0a0a0c]"
              : "text-[#8e8e98] hover:text-[#f0f0f2]"
          }`}
        >
          上架商品
        </button>
      </div>

      {tab === "project" ? <ProjectForm /> : <ProductForm />}
    </div>
  );
}

/* ============ 作品表单 ============ */
function ProjectForm() {
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
      if (res.ok) setParsed(data.items);
      else setMsg(data.error || "解析失败");
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
      if (res.ok) router.push(`/p/${data.id}`);
      else if (res.status === 401) setMsg("请先登录再发布 →");
      else setMsg(data.error || "发布失败");
    } finally {
      setSubmitting(false);
    }
  }

  const inputCls =
    "w-full rounded-lg border border-[rgba(255,255,255,0.12)] bg-[#0d0d10] px-3 py-2.5 text-sm text-[#e8e8ea] placeholder-[#5e5e68] outline-none focus:border-[rgba(76,141,255,0.6)] transition-colors";

  return (
    <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-5">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-[#c8c8ce]">
          作品标题 *
        </label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={80}
          placeholder="比如：AI 生成的声控灯" className={inputCls} />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-[#c8c8ce]">
          作品描述 *
        </label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required
          rows={4} placeholder="怎么想到的？用了什么 AI 工具？怎么实现的？"
          className={inputCls} />
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#c8c8ce]">
            用的 AI 工具
          </label>
          <input value={tool} onChange={(e) => setTool(e.target.value)} maxLength={60}
            placeholder="Blueprint / Cirkit / Schematik…" className={inputCls} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#c8c8ce]">
            交易意向
          </label>
          <select value={dealTag} onChange={(e) => setDealTag(e.target.value)} className={inputCls}>
            {DEAL_TAGS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <p className="mt-1 text-xs text-[#5e5e68]">站内不交易，成交走闲鱼</p>
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-[#c8c8ce]">
          成品图（图片 URL，可选）
        </label>
        <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://…（贴一张图片链接）" className={inputCls} />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-[#c8c8ce]">
          零件清单（BOM）
        </label>
        <textarea value={bomText} onChange={(e) => setBomText(e.target.value)} rows={5}
          placeholder={"每行一个零件，例如：\nDHT11 温湿度传感器 ×2\n10kΩ 电阻 x4 （1/4W）\nArduino Nano"}
          className={inputCls} />
        <button type="button" onClick={() => parseBom(false)}
          disabled={parsing || !bomText.trim()}
          className="btn btn-blue mt-2.5 !py-2 !text-[13px] disabled:opacity-40">
          {parsing ? "解析中…" : "⚡ 解析并生成找料链接"}
        </button>
        {parsed && parsed.length > 0 && (
          <div className="mt-3 overflow-hidden rounded-xl border border-[rgba(255,255,255,0.08)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[rgba(255,255,255,0.08)] bg-[#0d0d10] text-left text-xs text-[#5e5e68]">
                  <th className="px-3 py-2">零件</th>
                  <th className="w-14 px-3 py-2">数量</th>
                  <th className="px-3 py-2">备注</th>
                  <th className="px-3 py-2">找料链接</th>
                </tr>
              </thead>
              <tbody>
                {parsed.map((it, i) => (
                  <tr key={i} className="border-b border-[rgba(255,255,255,0.05)] last:border-0">
                    <td className="px-3 py-2.5 font-medium text-[#e8e8ea]">{it.name}</td>
                    <td className="px-3 py-2.5 text-[#8e8e98]">{it.qty}</td>
                    <td className="px-3 py-2.5 text-xs text-[#6e6e78]">{it.note}</td>
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
        <p className="text-sm text-[#e8c07e]">
          {msg.includes("登录") ? (
            <>{msg} <Link href="/login" className="text-[#4c8dff] underline">去登录</Link></>
          ) : msg}
        </p>
      )}
      <button type="submit" disabled={submitting}
        className="btn btn-primary w-full justify-center !py-3.5">
        {submitting ? "发布中…" : "发布作品"}
      </button>
    </form>
  );
}

/* ============ 商品表单 ============ */
function ProductForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("实物");
  const [imageUrl, setImageUrl] = useState("");
  const [projectId, setProjectId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMsg("");
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          desc,
          price: Number(price) || 0,
          type,
          imageUrl,
          projectId: projectId ? Number(projectId) : null,
        }),
      });
      const data = await res.json();
      if (res.ok) router.push(`/market/${data.id}`);
      else if (res.status === 401) setMsg("请先登录再上架 →");
      else setMsg(data.error || "上架失败");
    } finally {
      setSubmitting(false);
    }
  }

  const inputCls =
    "w-full rounded-lg border border-[rgba(255,255,255,0.12)] bg-[#0d0d10] px-3 py-2.5 text-sm text-[#e8e8ea] placeholder-[#5e5e68] outline-none focus:border-[rgba(76,141,255,0.6)] transition-colors";

  return (
    <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-5">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-[#c8c8ce]">
          商品标题 *
        </label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={80}
          placeholder="比如：AI 声控灯成品（含教程）" className={inputCls} />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-[#c8c8ce]">
          商品描述 *
        </label>
        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} required rows={4}
          placeholder="卖什么？成色/内容/包含什么？怎么交付？" className={inputCls} />
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#c8c8ce]">
            价格（元）*
          </label>
          <input value={price} onChange={(e) => setPrice(e.target.value)} required type="number"
            min={0} placeholder="68" className={inputCls} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#c8c8ce]">
            类型
          </label>
          <select value={type} onChange={(e) => setType(e.target.value)} className={inputCls}>
            <option value="实物">实物</option>
            <option value="设计">设计</option>
            <option value="教程">教程</option>
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#c8c8ce]">
            关联作品 ID（可选）
          </label>
          <input value={projectId} onChange={(e) => setProjectId(e.target.value)}
            placeholder="作品详情页的数字" className={inputCls} />
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-[#c8c8ce]">
          商品图（图片 URL，可选）
        </label>
        <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://…" className={inputCls} />
      </div>
      <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0f0f12] p-4 text-[12.5px] leading-[1.8] text-[#8e8e98]">
        💡 上架后，你的商品页会自动生成<Link href="/market" className="text-[#7fa8ff] underline">闲鱼文案</Link>，
        一键复制去闲鱼发布；意向单成交后记得回这里更新状态。
      </div>
      {msg && (
        <p className="text-sm text-[#e8c07e]">
          {msg.includes("登录") ? (
            <>{msg} <Link href="/login" className="text-[#4c8dff] underline">去登录</Link></>
          ) : msg}
        </p>
      )}
      <button type="submit" disabled={submitting}
        className="btn btn-primary w-full justify-center !py-3.5">
        {submitting ? "上架中…" : "上架商品"}
      </button>
    </form>
  );
}
