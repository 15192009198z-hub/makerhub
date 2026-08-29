"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    setMsg("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push("/");
        router.refresh();
      } else {
        setMsg(data.error || "登录失败");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20">
      <div className="w-full rounded-2xl border border-[#1e2a36] bg-[#111a22] p-8">
        <h1 className="text-xl font-bold text-slate-100">登录 MakerHub</h1>
        <p className="mt-2 text-sm text-slate-500">
          MVP 阶段先用昵称登录（GitHub OAuth 即将到来 🔜）
        </p>
        <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={30}
            placeholder="你的昵称"
            className="rounded-lg border border-[#2a3a4a] bg-[#0d151d] px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 outline-none focus:border-cyan-500/60"
          />
          {msg && <p className="text-sm text-rose-400">{msg}</p>}
          <button
            type="submit"
            disabled={busy}
            className="rounded-lg bg-cyan-500 py-2.5 font-semibold text-[#0a0f14] hover:bg-cyan-400 disabled:opacity-50"
          >
            {busy ? "登录中…" : "登录"}
          </button>
        </form>
      </div>
    </div>
  );
}
