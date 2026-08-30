// 收藏 API
import { NextResponse } from "next/server";
import {
  addFavorite,
  removeFavorite,
  favoriteIds,
  listFavorites,
} from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "请先登录" }, { status: 401 });
    const favs = await listFavorites(user.id);
    return NextResponse.json({ favorites: favs });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "请先登录" }, { status: 401 });
    const { itemId, itemType, action } = await req.json();
    if (!itemId || !itemType) {
      return NextResponse.json({ error: "参数不完整" }, { status: 400 });
    }
    if (action === "remove") {
      await removeFavorite(user.id, Number(itemId), String(itemType));
    } else {
      await addFavorite(user.id, Number(itemId), String(itemType));
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
