"use client";

import { useState } from "react";
import type { Comment } from "@/lib/types";

export default function CommentBox({
  projectId,
  initialComments,
}: {
  projectId: number;
  initialComments: Comment[];
}) {
  const [comments, setComments] = useState(initialComments);
  const [content, setContent] = useState("");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    const res = await fetch(`/api/projects/${projectId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    if (res.ok) {
      setComments([...comments, { id: 0, content, createdAt: "", authorName: "我" }]);
      setContent("");
      setMsg("");
    } else {
      const data = await res.json();
      setMsg(data.error || "评论失败");
    }
  }

  return (
    <div className="rounded-xl border border-[#1e2a36] bg-[#111a22] p-5">
      <h3 className="mb-3 font-semibold text-slate-200">
        评论（{comments.length}）
      </h3>
      <form onSubmit={onSubmit} className="mb-4 flex gap-2">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="说点什么…"
          className="flex-1 rounded-md border border-[#2a3a4a] bg-[#0d151d] px-3 py-2 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-cyan-500/50"
        />
        <button
          type="submit"
          className="rounded-md bg-cyan-500/90 px-4 py-2 text-sm font-medium text-[#0a0f14] hover:bg-cyan-400"
        >
          发送
        </button>
      </form>
      {msg && <p className="mb-2 text-xs text-rose-400">{msg}</p>}
      <ul className="flex flex-col gap-3">
        {comments.map((c, i) => (
          <li key={i} className="text-sm">
            <span className="font-medium text-cyan-400">{c.authorName}</span>
            <span className="ml-2 text-xs text-slate-600">{c.createdAt}</span>
            <p className="mt-0.5 text-slate-300">{c.content}</p>
          </li>
        ))}
        {comments.length === 0 && (
          <li className="text-sm text-slate-500">还没有评论，来抢沙发</li>
        )}
      </ul>
    </div>
  );
}
