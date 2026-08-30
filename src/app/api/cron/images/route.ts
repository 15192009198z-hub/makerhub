// 集合补图：抓取原项目页 og:image 存库
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";
import {
  listCollectionNoImage,
  updateCollectionImage,
} from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

async function fetchOgImage(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (MakerHub aggregator)" },
    cache: "no-store",
  });
  if (!res.ok) return "";
  const html = await res.text();
  // og:image
  const m = html.match(
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i
  );
  if (m) return m[1];
  const m2 = html.match(
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i
  );
  return m2 ? m2[1] : "";
}

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    const cronSecret = req.headers.get("authorization")?.replace("Bearer ", "");
    const isCron =
      process.env.CRON_SECRET && cronSecret === process.env.CRON_SECRET;
    if (!isAdmin(user) && !isCron) {
      return NextResponse.json({ error: "无权限" }, { status: 403 });
    }

    const items = await listCollectionNoImage(20);
    let updated = 0;
    for (const it of items) {
      try {
        const img = await fetchOgImage(it.url);
        if (img) {
          await updateCollectionImage(it.id, img);
          updated++;
        }
      } catch {
        // 单条失败继续
      }
    }
    return NextResponse.json({ checked: items.length, updated });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
