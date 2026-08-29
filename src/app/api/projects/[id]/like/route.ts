// 点赞 API
import { NextResponse } from "next/server";
import { likeProject } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const likes = await likeProject(Number(id));
    return NextResponse.json({ likes });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
