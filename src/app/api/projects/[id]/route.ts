// 作品详情 API
import { NextResponse } from "next/server";
import { getProject } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const project = await getProject(Number(id));
    if (!project) {
      return NextResponse.json({ error: "作品不存在" }, { status: 404 });
    }
    return NextResponse.json({ project });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
