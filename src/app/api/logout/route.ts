// 登出 API（导航栏表单提交）
import { NextResponse } from "next/server";
import { logout } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST() {
  await logout();
  return NextResponse.redirect("/", 303);
}
