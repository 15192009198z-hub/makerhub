// 意向单状态更新（卖家）
import { NextResponse } from "next/server";
import { setOrderStatus } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "请先登录" }, { status: 401 });
    const { id } = await params;
    const { status } = await req.json();
    if (!["待联系", "已联系", "已完成"].includes(status)) {
      return NextResponse.json({ error: "状态不正确" }, { status: 400 });
    }
    await setOrderStatus(Number(id), user.id, status);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
