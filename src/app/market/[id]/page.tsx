import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import OrderForm from "@/components/OrderForm";

export const dynamic = "force-dynamic";

const TYPE_STYLE: Record<string, string> = {
  实物: "border-[rgba(240,180,90,0.35)] text-[#e8c07e]",
  设计: "border-[rgba(76,141,255,0.35)] text-[#7fa8ff]",
  教程: "border-[rgba(167,139,250,0.35)] text-[#c4b5fd]",
};

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, user] = await Promise.all([
    getProduct(Number(id)),
    getCurrentUser(),
  ]);
  if (!product) notFound();

  const isOwner = user && user.id === product.user_id;
  const isSoldOut = product.status !== "在售";

  return (
    <div className="mx-auto max-w-[860px] px-6 py-14 lg:px-8">
      <Link href="/market" className="text-[13px] text-[#5e5e68] hover:text-[#4c8dff]">
        ← 返回市场
      </Link>

      <div className="mt-6 overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#0f0f12]">
        <div className="flex h-64 items-center justify-center bg-gradient-to-br from-[#111116] to-[#0d0d10] text-[40px] text-[#565660]">
          {product.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.image_url}
              alt={product.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="mono text-[15px] tracking-[4px]">▣</span>
          )}
        </div>
        <div className="p-7">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-[1px]">{product.title}</h1>
            <span
              className={`rounded border px-2 py-0.5 text-[11px] ${TYPE_STYLE[product.type] || TYPE_STYLE.实物}`}
            >
              {product.type}
            </span>
            {isSoldOut && (
              <span className="rounded border border-[rgba(255,255,255,0.2)] px-2 py-0.5 text-[11px] text-[#8e8e98]">
                已下架
              </span>
            )}
          </div>
          <div className="mt-2 text-[13px] text-[#6e6e78]">
            卖家：{product.author_name} · {product.created_at.slice(0, 10)}
          </div>
          <div className="mt-5 flex items-baseline gap-2">
            <span className="mono text-3xl font-black text-[#f2f2f4]">
              ¥{product.price}
            </span>
            {product.type === "教程" && (
              <span className="text-xs text-[#6e6e78]">含全套文档 + 答疑</span>
            )}
          </div>
          {product.xianyu_url && (
            <a
              href={product.xianyu_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-blue mt-4 !px-6"
            >
              去闲鱼购买 ↗
            </a>
          )}
          <p className="mt-5 whitespace-pre-wrap leading-[1.9] text-[#c8c8ce]">
            {product.desc}
          </p>
          {product.project_id && (
            <Link
              href={`/p/${product.project_id}`}
              className="mt-5 inline-block text-[13px] text-[#7fa8ff] hover:underline"
            >
              查看关联作品 →
            </Link>
          )}
        </div>
      </div>

      <div className="mt-8">
        {isOwner ? (
          <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0f0f12] p-6 text-center">
            <p className="text-[#8e8e98]">这是你上架的商品</p>
            <a href="/u/me" className="btn btn-outline mt-4">
              管理我的商品与意向单
            </a>
          </div>
        ) : isSoldOut ? (
          <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0f0f12] p-6 text-center text-[#8e8e98]">
            该商品已下架
          </div>
        ) : (
          <OrderForm productId={product.id} />
        )}
      </div>
    </div>
  );
}
