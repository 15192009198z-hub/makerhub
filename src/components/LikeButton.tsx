"use client";

import { useState } from "react";

export default function LikeButton({
  projectId,
  initialLikes,
}: {
  projectId: number;
  initialLikes: number;
}) {
  const [likes, setLikes] = useState(initialLikes);
  const [busy, setBusy] = useState(false);

  async function onLike() {
    if (busy) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/like`, {
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json();
        setLikes(data.likes);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={onLike}
      className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm ring-1 ring-[#2a3a4a] transition-all hover:ring-rose-500/50 hover:text-rose-400"
    >
      <span>❤️</span> {likes}
    </button>
  );
}
