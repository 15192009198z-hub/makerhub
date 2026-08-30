import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getUserByName,
  listProjectsByUser,
  listProductsByUser,
  listOrdersForSeller,
  listOrdersForBuyer,
  listCollection,
  favoriteIds,
} from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import ProjectCard from "@/components/ProjectCard";
import ProfileEditor from "@/components/ProfileEditor";
import OrderStatusBtn from "@/components/OrderStatusBtn";
import ProductStatusToggle from "@/components/ProductStatusToggle";

export const dynamic = "force-dynamic";

export default async function UserPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const [user, me] = await Promise.all([
    getUserByName(decodeURIComponent(name)),
    getCurrentUser(),
  ]);
  if (!user) notFound();

  const isMe = me && me.id === user.id;
  const [projects, products, sold, bought] = await Promise.all([
    listProjectsByUser(user.id),
    listProductsByUser(user.id),
    isMe ? listOrdersForSeller(user.id) : Promise.resolve([]),
    isMe ? listOrdersForBuyer(user.id) : Promise.resolve([]),
  ]);

  // 我的收藏（集合项）
  let myFavs: Awaited<ReturnType<typeof listCollection>> = [];
  if (isMe) {
    const favIds = await favoriteIds(user.id, "collection");
    if (favIds.length > 0) {
      try {
        const all = await listCollection(200);
        myFavs = all.filter((c) => favIds.includes(c.id));
      } catch (e) {
        console.error("fav load error:", e);
      }
    }
  }

  return (
    <div className="mx-auto max-w-[960px] px-6 py-14 lg:px-8">
      {/* 资料卡 */}
      <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#0f0f12] p-8">
        <div className="flex items-center gap-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-[rgba(76,141,255,0.3)] bg-[#0d0d10] text-3xl">
            {user.name.slice(0, 1)}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-black tracking-[2px]">{user.name}</h1>
            <p className="mt-2 text-[14px] leading-[1.8] text-[#8e8e98]">
              {user.bio || "造物主，用 AI 把想法变成实物。"}
            </p>
          </div>
          {isMe && <ProfileEditor bio={user.bio} />}
        </div>
        <div className="mt-6 flex gap-10 border-t border-[rgba(255,255,255,0.06)] pt-5 text-center">
          <div>
            <div className="mono text-xl font-bold">{projects.length}</div>
            <div className="mt-1 text-[11.5px] tracking-[2px] text-[#5e5e68]">作品</div>
          </div>
          <div>
            <div className="mono text-xl font-bold">{products.length}</div>
            <div className="mt-1 text-[11.5px] tracking-[2px] text-[#5e5e68]">商品</div>
          </div>
          {isMe && (
            <div>
              <div className="mono text-xl font-bold">{sold.length}</div>
              <div className="mt-1 text-[11.5px] tracking-[2px] text-[#5e5e68]">卖出意向</div>
            </div>
          )}
        </div>
      </div>

      {/* 作品 */}
      <section className="mt-12">
        <h2 className="mb-6 text-xl font-bold tracking-[2px]">作品</h2>
        {projects.length === 0 ? (
          <p className="text-[14px] text-[#5e5e68]">还没有发布作品</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}
      </section>

      {/* 商品 */}
      <section className="mt-12">
        <h2 className="mb-6 text-xl font-bold tracking-[2px]">商品</h2>
        {products.length === 0 ? (
          <p className="text-[14px] text-[#5e5e68]">还没有上架商品</p>
        ) : (
          <div className="flex flex-col gap-3">
            {products.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0f0f12] px-5 py-4"
              >
                <Link href={`/market/${p.id}`} className="min-w-0">
                  <div className="truncate text-[14.5px] font-semibold">{p.title}</div>
                  <div className="mt-1 text-xs text-[#6e6e78]">
                    {p.type} · <span className="mono">¥{p.price}</span> ·{" "}
                    <span className={p.status === "在售" ? "text-[#9dc9ab]" : "text-[#6e6e78]"}>
                      {p.status}
                    </span>
                  </div>
                </Link>
                {isMe && (
                  <div className="flex gap-2">
                    <a
                      href={`/api/xianyu?product=${p.id}`}
                      className="btn btn-outline !px-3 !py-1.5 !text-xs"
                      onClick={(e) => {
                        e.preventDefault();
                        window.open(`/api/xianyu?product=${p.id}`, "_blank");
                      }}
                    >
                      闲鱼文案
                    </a>
                    <ProductStatusToggle productId={p.id} status={p.status} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 我的收藏 */}
      {isMe && myFavs.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-6 text-xl font-bold tracking-[2px]">我的收藏</h2>
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {myFavs.map((c) => (
              <a
                key={c.id}
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card block overflow-hidden"
              >
                <div className="flex h-[80px] items-center justify-center border-b border-[rgba(255,255,255,0.06)]">
                  <span className="mono text-[10.5px] tracking-[4px] text-[#4a4a54]">
                    {String(c.type).toUpperCase()}
                  </span>
                </div>
                <div className="p-4">
                  <div className="truncate text-[14px] font-semibold">
                    {c.title_zh || c.title_en}
                  </div>
                  <div className="mt-1.5 line-clamp-2 text-[12px] leading-[1.7] text-[#6e6e78]">
                    {c.desc_zh || c.desc_en}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* 我的意向单 */}
      {isMe && (
        <section className="mt-12">
          <h2 className="mb-6 text-xl font-bold tracking-[2px]">意向单</h2>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <h3 className="mb-3 text-[13px] tracking-[2px] text-[#8e8e98]">
                我卖出的（{sold.length}）
              </h3>
              {sold.length === 0 ? (
                <p className="text-[13px] text-[#5e5e68]">暂无</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {sold.map((o) => (
                    <div
                      key={o.id}
                      className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0f0f12] p-4"
                    >
                      <div className="text-[14px] font-semibold">{o.product_title}</div>
                      <div className="mt-1 text-xs text-[#6e6e78]">
                        买家 {o.buyer_name} · 联系方式：{o.contact}
                      </div>
                      {o.message && (
                        <div className="mt-2 rounded bg-[#0d0d10] p-2.5 text-[12.5px] text-[#9a9aa3]">
                          {o.message}
                        </div>
                      )}
                      <div className="mt-3 flex items-center gap-3">
                        <span className="text-xs text-[#5e5e68]">{o.created_at.slice(0, 16)}</span>
                        <OrderStatusBtn orderId={o.id} status={o.status} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <h3 className="mb-3 text-[13px] tracking-[2px] text-[#8e8e98]">
                我买下的（{bought.length}）
              </h3>
              {bought.length === 0 ? (
                <p className="text-[13px] text-[#5e5e68]">暂无</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {bought.map((o) => (
                    <div
                      key={o.id}
                      className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0f0f12] p-4"
                    >
                      <div className="text-[14px] font-semibold">{o.product_title}</div>
                      <div className="mt-1 text-xs text-[#6e6e78]">
                        状态：{o.status} · {o.created_at.slice(0, 16)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
