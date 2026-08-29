// 管理后台统计 API（仅管理员）
import { NextResponse } from "next/server";
import { db, initDb } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!isAdmin(user)) {
      return NextResponse.json({ error: "无权限" }, { status: 403 });
    }
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
    return NextResponse.json({
      stats: {
        users: Number(users.rows[0].c),
        projects: Number(projects.rows[0].c),
        products: Number(products.rows[0].c),
        orders: Number(orders.rows[0].c),
      },
      recent: recent.rows.map((r) => ({
        kind: r.kind,
        id: Number(r.id),
        title: r.title,
        author: r.author,
        created_at: r.created_at,
        extra: Number(r.extra || 0),
      })),
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
