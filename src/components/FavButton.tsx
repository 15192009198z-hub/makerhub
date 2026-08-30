"use client";

import { useState } from "react";

/**
 * 收藏按钮（集合/作品通用）
 * itemType: "collection" | "project"
 */
export default function FavButton({
  itemId,
  itemType,
  initial,
}: {
  itemId: number;
  itemType: string;
  initial: boolean;
}) {
  const [fav, setFav] = useState(initial);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    if (busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId,
          itemType,
          action: fav ? "remove" : "add",
        }),
      });
      if (res.ok) setFav(!fav);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={toggle}
      title={fav ? "取消收藏" : "收藏"}
      className={`flex h-8 w-8 items-center justify-center rounded-full border text-[13px] transition-all ${
        fav
          ? "border-[rgba(240,180,90,0.5)] bg-[rgba(245,158,11,0.12)] text-[#fcd34d]"
          : "border-[rgba(255,255,255,0.12)] text-[#5e5e68] hover:border-[rgba(240,180,90,0.4)] hover:text-[#e8c07e]"
      }`}
    >
      {fav ? "★" : "☆"}
    </button>
  );
}
