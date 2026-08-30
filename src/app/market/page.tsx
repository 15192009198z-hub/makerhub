import Link from "next/link";
import CoverArt from "@/components/CoverArt";
import { listProducts } from "@/lib/db";

export const dynamic = "force-dynamic";

const TYPE_STYLE: Record<string, string> = {
  实物: "border-[rgba(240,180,90,0.35)] text-[#e8c07e]",
  设计: "border-[rgba(76,141,255,0.35)] text-[#7fa8ff]",
  教程: "border-[rgba(167,139,250,0.35)] text-[#c4b5fd]",
};

export default async function MarketPage() {
  const products = await listProducts();

  return (
    <div className="mx-auto max-w-[1120px] px-6 py-16 lg:px-12">
      <div className="flex items-end justify-between">
        <div>
          <div className="kicker">MARKET</div>
          <h1 className="mt-3 text-4xl font-black tracking-[2px]">造物市场</h1>
          <p className="mt-4 max-w-[560px] text-[15px] leading-[1.9] text-[#8e8e98]">
            实物、设计、教程——造物主们在这里交易。看中商品留下意向单，
            卖家与你联系，闲鱼成交。
          </p>
        </div>
        <Link href="/submit?mode=product" className="btn btn-primary">
          + 上架商品
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="mt-14 rounded-2xl border border-dashed border-[rgba(255,255,255,0.1)] py-24 text-center">
          <p className="text-[#8e8e98]">市场还是空的——上架你的第一件作品</p>
          <Link href="/submit?mode=product" className="btn btn-blue mt-6">
            上架商品
          </Link>
        </div>
      ) : (
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <Link key={p.id} href={`/market/${p.id}`} className="card block overflow-hidden">
              <div className="relative">
                {p.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.image_url}
                    alt={p.title}
                    className="h-[140px] w-full object-cover"
                  />
                ) : (
                  <CoverArt type={p.type} title={p.title} height="h-[140px]" />
                )}
                <span className={`absolute left-3 top-3 rounded border px-2 py-0.5 text-[10.5px] ${TYPE_STYLE[p.type] || TYPE_STYLE.实物}`}>
                  {p.type}
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-[14.5px] font-semibold">
                    {p.title}
                  </span>
                  <span className="mono shrink-0 text-[15px] font-bold text-[#f2f2f4]">
                    ¥{p.price}
                  </span>
                </div>
                <div className="mt-2.5 flex items-center gap-3 text-xs text-[#6e6e78]">
                  <span className={`rounded border px-1.5 py-0.5 text-[10.5px] ${TYPE_STYLE[p.type] || TYPE_STYLE.实物}`}>
                    {p.type}
                  </span>
                  <span>👤 {p.author_name}</span>
                  <span>·</span>
                  <span>{p.created_at.slice(0, 10)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
