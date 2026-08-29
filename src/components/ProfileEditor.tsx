"use client";

import { useState } from "react";

export default function ProfileEditor({ bio }: { bio: string }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(bio);
  const [msg, setMsg] = useState("");

  async function save() {
    const res = await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bio: text }),
    });
    if (res.ok) {
      setOpen(false);
      location.reload();
    } else {
      setMsg("保存失败");
    }
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="btn btn-outline !px-4 !py-2 !text-xs">
        编辑资料
      </button>
    );
  }
  return (
    <div className="flex flex-col items-end gap-2">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={2}
        maxLength={200}
        placeholder="介绍一下自己（200 字内）"
        className="w-72 rounded-lg border border-[rgba(255,255,255,0.12)] bg-[#0d0d10] px-3 py-2 text-sm text-[#e8e8ea] placeholder-[#5e5e68] outline-none focus:border-[rgba(76,141,255,0.6)]"
      />
      {msg && <p className="text-xs text-rose-400">{msg}</p>}
      <div className="flex gap-2">
        <button onClick={() => setOpen(false)} className="btn btn-outline !px-3 !py-1.5 !text-xs">
          取消
        </button>
        <button onClick={save} className="btn btn-blue !px-3 !py-1.5 !text-xs">
          保存
        </button>
      </div>
    </div>
  );
}
