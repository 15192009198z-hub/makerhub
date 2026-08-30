"use client";

/** 商品上架/下架切换按钮 */
export default function ProductStatusToggle({
  productId,
  status,
}: {
  productId: number;
  status: string;
}) {
  return (
    <button
      onClick={async () => {
        const next = status === "在售" ? "下架" : "在售";
        const res = await fetch(`/api/products/${productId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: next }),
        });
        if (res.ok) location.reload();
      }}
      className="btn btn-outline !px-3 !py-1.5 !text-xs"
    >
      {status === "在售" ? "下架" : "上架"}
    </button>
  );
}
