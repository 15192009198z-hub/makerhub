"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OrderForm({ productId }: { productId: number }) {
  const router = useRouter();
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!contact.trim()) return;
    setBusy(true);
    setMsg("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, contact, message }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg("✅ 意向单已发出！卖家会通过你留的联系方式找你，站外（闲鱼/微信）成交。");
        setContact("");
        setMessage("");
      } else if (res.status === 401) {
        setMsg("请先登录再下单 →");
        router.push("/login");
      } else {
        setMsg(data.error || "下单失败");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0f0f12] p-6"
    >
      <h3 className="text-base font-bold tracking-[1px]">购买意向单</h3>
      <p className="mt-2 text-[12.5px] leading-[1.7] text-[#6e6e78]">
        站内不做支付——留下联系方式，卖家与你联系后走闲鱼成交，安全有保障。
      </p>
      <input
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        required
        maxLength={100}
        placeholder="你的联系方式（微信号 / 闲鱼昵称）"
        className="mt-4 w-full rounded-lg border border-[rgba(255,255,255,0.12)] bg-[#0d0d10] px-3 py-2.5 text-sm text-[#e8e8ea] placeholder-[#5e5e68] outline-none focus:border-[rgba(76,141,255,0.6)]"
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={3}
        maxLength={500}
        placeholder="想说的话（可选）：想怎么交易、要什么版本…"
        className="mt-3 w-full rounded-lg border border-[rgba(255,255,255,0.12)] bg-[#0d0d10] px-3 py-2.5 text-sm text-[#e8e8ea] placeholder-[#5e5e68] outline-none focus:border-[rgba(76,141,255,0.6)]"
      />
      {msg && <p className="mt-3 text-[13px] leading-[1.7] text-[#e8c07e]">{msg}</p>}
      <button
        type="submit"
        disabled={busy}
        className="btn btn-blue mt-4 w-full justify-center"
      >
        {busy ? "发送中…" : "发送意向单"}
      </button>
    </form>
  );
}
