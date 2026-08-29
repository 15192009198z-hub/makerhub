// 作品 API：列表 / 发布
import { NextResponse } from "next/server";
import { createProject, listProjects } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { parseBomText } from "@/lib/bom-parser";
import type { BomItem, DealTag } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const projects = await listProjects();
    return NextResponse.json({ projects });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }
    const body = await req.json();
    const { title, description, tool, imageUrl, dealTag, rawBom } = body;
    if (!title || !description) {
      return NextResponse.json({ error: "标题和描述不能为空" }, { status: 400 });
    }
    const bomItems: BomItem[] = rawBom
      ? parseBomText(String(rawBom))
      : [];
    const id = await createProject({
      userId: user.id,
      title: String(title),
      description: String(description),
      tool: String(tool || ""),
      imageUrl: String(imageUrl || ""),
      dealTag: (["DIY", "求购", "出二手", "帮做"].includes(dealTag)
        ? dealTag
        : "DIY") as DealTag,
      rawBom: String(rawBom || ""),
      bomItems,
    });
    return NextResponse.json({ id });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
