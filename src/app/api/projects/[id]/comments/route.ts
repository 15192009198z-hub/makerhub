// 评论 API
import { NextResponse } from "next/server";
import { addComment } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }
    const { id } = await params;
    const { content } = await req.json();
    if (!content || typeof content !== "string") {
      return NextResponse.json({ error: "评论不能为空" }, { status: 400 });
    }
    await addComment(Number(id), user.id, content);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
