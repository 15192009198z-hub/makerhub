// 意向单 API：下单 / 查询我的
import { NextResponse } from "next/server";
import { createOrder, listOrdersForBuyer, listOrdersForSeller } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "请先登录" }, { status: 401 });
    const [sold, bought] = await Promise.all([
      listOrdersForSeller(user.id),
      listOrdersForBuyer(user.id),
    ]);
    return NextResponse.json({ sold, bought });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "请先登录" }, { status: 401 });
    const body = await req.json();
    const { productId, contact, message } = body;
    if (!productId || !contact) {
      return NextResponse.json({ error: "缺少商品或联系方式" }, { status: 400 });
    }
    await createOrder({
      productId: Number(productId),
      buyerId: user.id,
      contact: String(contact),
      message: String(message || ""),
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
