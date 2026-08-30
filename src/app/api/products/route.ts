// 商品 API：列表 / 上架
import { NextResponse } from "next/server";
import { createProduct, listProducts } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = await listProducts();
    return NextResponse.json({ products });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "请先登录" }, { status: 401 });
    const body = await req.json();
    const { title, desc, price, type, imageUrl, projectId, xianyuUrl } = body;
    if (!title || !desc) {
      return NextResponse.json({ error: "标题和描述不能为空" }, { status: 400 });
    }
    if (!["实物", "设计", "教程"].includes(type)) {
      return NextResponse.json({ error: "商品类型不正确" }, { status: 400 });
    }
    const id = await createProduct({
      userId: user.id,
      title: String(title),
      desc: String(desc),
      price: Number(price) || 0,
      type,
      imageUrl: String(imageUrl || ""),
      projectId: projectId ? Number(projectId) : null,
      xianyuUrl: String(xianyuUrl || ""),
    });
    return NextResponse.json({ id });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
