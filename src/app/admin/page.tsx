import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

const KIND_LABEL: Record<string, string> = {
  project: "作品",
  product: "商品",
  order: "意向单",
};

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!isAdmin(user)) redirect("/");

  // 直接服务端查统计（管理员）
  const { db, initDb } = await import("@/lib/db");
  await initDb();
  const [users, projects, products, orders] = await Promise.all([
    db.execute("SELECT COUNT(*) AS c FROM users"),
    db.execute("SELECT COUNT(*) AS c FROM projects"),
    db.execute("SELECT COUNT(*) AS c FROM products"),
    db.execute("SELECT COUNT(*) AS c FROM orders"),
  ]);
  const recent = await db.execute(`
    SELECT 'project' AS kind, p.id, p.title, u.name AS author, p.created_at, p.likes AS extra
    FROM projects p JOIN users u ON p.user_id = u.id
    UNION ALL
    SELECT 'product' AS kind, p.id, p.title, u.name AS author, p.created_at, p.price AS extra
    FROM products p JOIN users u ON p.user_id = u.id
    UNION ALL
    SELECT 'order' AS kind, o.id, pr.title, u.name AS author, o.created_at, 0 AS extra
    FROM orders o JOIN products pr ON o.product_id = pr.id JOIN users u ON o.buyer_id = u.id
    ORDER BY created_at DESC LIMIT 30
  `);

  const stats = [
    ["用户", Number(users.rows[0].c)],
    ["作品", Number(projects.rows[0].c)],
    ["商品", Number(products.rows[0].c)],
    ["意向单", Number(orders.rows[0].c)],
  ];

  return (
    <div className="mx-auto max-w-[960px] px-6 py-14 lg:px-8">
      <div className="kicker">ADMIN</div>
      <h1 className="mt-3 text-3xl font-black tracking-[2px]">管理后台</h1>
      <p className="mt-2 text-[13px] text-[#5e5e68]">
        仅站长可见 · 数据实时统计
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map(([label, n]) => (
          <div key={label} className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0f0f12] p-5 text-center">
            <div className="mono text-3xl font-black text-[#f2f2f4]">{n}</div>
            <div className="mt-1.5 text-[12px] tracking-[2px] text-[#5e5e68]">{label}</div>
          </div>
        ))}
      </div>

      <h2 className="mb-4 mt-12 text-lg font-bold tracking-[2px]">最近动态</h2>
      <div className="overflow-hidden rounded-xl border border-[rgba(255,255,255,0.08)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[rgba(255,255,255,0.08)] bg-[#0d0d10] text-left text-xs text-[#5e5e68]">
              <th className="px-4 py-3">类型</th>
              <th className="px-4 py-3">内容</th>
              <th className="px-4 py-3">作者</th>
              <th className="px-4 py-3">时间</th>
              <th className="px-4 py-3">链接</th>
            </tr>
          </thead>
          <tbody>
            {recent.rows.map((r, i) => (
              <tr key={i} className="border-b border-[rgba(255,255,255,0.05)] last:border-0">
                <td className="px-4 py-3">
                  <span className="rounded border border-[rgba(76,141,255,0.3)] px-1.5 py-0.5 text-[10.5px] text-[#8fb6ff]">
                    {KIND_LABEL[String(r.kind)] || String(r.kind)}
                  </span>
                </td>
                <td className="max-w-[280px] truncate px-4 py-3 text-[#e8e8ea]">{String(r.title)}</td>
                <td className="px-4 py-3 text-[#8e8e98]">{String(r.author)}</td>
                <td className="px-4 py-3 text-xs text-[#5e5e68]">{String(r.created_at)}</td>
                <td className="px-4 py-3">
                  <Link
                    href={
                      r.kind === "project"
                        ? `/p/${r.id}`
                        : r.kind === "product"
                          ? `/market/${r.id}`
                          : "#"
                    }
                    className="text-[12px] text-[#7fa8ff] hover:underline"
                  >
                    查看 →
                  </Link>
                </td>
              </tr>
            ))}
            {recent.rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[#5e5e68]">
                  暂无动态
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
