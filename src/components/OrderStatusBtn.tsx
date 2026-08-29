"use client";

import { useState } from "react";

const STATUSES = ["待联系", "已联系", "已完成"];

export default function OrderStatusBtn({
  orderId,
  status,
}: {
  orderId: number;
  status: string;
}) {
  const [cur, setCur] = useState(status);

  async function next() {
    const i = STATUSES.indexOf(cur);
    const nxt = STATUSES[(i + 1) % STATUSES.length];
    const res = await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nxt }),
    });
    if (res.ok) setCur(nxt);
  }

  return (
    <button
      onClick={next}
      className="rounded border border-[rgba(76,141,255,0.35)] px-2.5 py-1 text-[11.5px] text-[#7fa8ff] transition-colors hover:bg-[rgba(76,141,255,0.1)]"
      title="点击切换状态"
    >
      {cur} ↻
    </button>
  );
}
