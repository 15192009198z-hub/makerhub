// 商品详情 / 状态更新
import { NextResponse } from "next/server";
import { getProduct, setProductStatus } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await getProduct(Number(id));
    if (!product) return NextResponse.json({ error: "商品不存在" }, { status: 404 });
    return NextResponse.json({ product });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "请先登录" }, { status: 401 });
    const { id } = await params;
    const { status } = await req.json();
    if (!["在售", "下架"].includes(status)) {
      return NextResponse.json({ error: "状态不正确" }, { status: 400 });
    }
    await setProductStatus(Number(id), user.id, status);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
