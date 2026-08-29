// 登录 / 登出 API
import { NextResponse } from "next/server";
import { loginAs, logout, getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  return NextResponse.json({ user });
}

export async function POST(req: Request) {
  try {
    const { name } = await req.json();
    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "昵称不能为空" }, { status: 400 });
    }
    const user = await loginAs(name);
    return NextResponse.json({ user });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE() {
  await logout();
  return NextResponse.json({ ok: true });
}
