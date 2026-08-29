// 管理后台统计 API（仅管理员）
import { NextResponse } from "next/server";
import { getAdminStats } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!isAdmin(user)) {
      return NextResponse.json({ error: "无权限" }, { status: 403 });
    }
    const data = await getAdminStats();
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
