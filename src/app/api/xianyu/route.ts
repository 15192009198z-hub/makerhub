// 闲鱼文案生成：根据商品信息生成可直接粘贴的闲鱼发布文案
import { NextResponse } from "next/server";
import { getProduct } from "@/lib/db";

export const dynamic = "force-dynamic";

const TYPE_HINT: Record<string, string> = {
  实物: "实物包邮，到手即用",
  设计: "包含完整设计文件（BOM + 接线图 + 组装说明），买设计自己动手",
  教程: "含全套文档 + 在线答疑，跟着做就能复刻",
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = Number(searchParams.get("product") || 0);
    if (!productId) return NextResponse.json({ error: "缺少商品" }, { status: 400 });
    const product = await getProduct(productId);
    if (!product) return NextResponse.json({ error: "商品不存在" }, { status: 404 });

    const type = product.type === "设计" ? "设计" : product.type === "教程" ? "教程" : "实物";
    const text = `【AI 造物 · ${product.title}】

${product.desc}

💰 价格：¥${product.price}（${TYPE_HINT[type] || "可小刀"}）
🤖 出自 MakerHub 造物主社区：用 AI 设计 + 国内买料做出
📦 来自 ${product.author_name} 的造物车间

#AI造物 #DIY #创客 #手工 #MakerHub

（本商品来自 MakerHub 造物主社区 ${process.env.NEXT_PUBLIC_SITE_URL || "https://makerhub-eight.vercel.app"}/market/${product.id}）`;
    return NextResponse.json({ text });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
