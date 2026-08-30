// 聚合同步 API：抓取 → 翻译 → 入库（管理员 / Vercel Cron）
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";
import { insertCollection } from "@/lib/db";
import { fetchBlueprintNew } from "@/lib/aggregators/blueprint";
import { fetchRedditNew } from "@/lib/aggregators/reddit";
import { translateItems } from "@/lib/aggregators/translate";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function GET(req: Request) {
  try {
    // 管理员鉴权（Vercel Cron 调用时无 cookie，用 CRON_SECRET 兜底）
    const user = await getCurrentUser();
    const cronSecret = req.headers.get("authorization")?.replace("Bearer ", "");
    const isCron =
      process.env.CRON_SECRET && cronSecret === process.env.CRON_SECRET;
    if (!isAdmin(user) && !isCron) {
      return NextResponse.json({ error: "无权限" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const source = searchParams.get("source") || "all";

    // 抓取（各源独立报错，不静默）
    let fresh: Awaited<ReturnType<typeof fetchBlueprintNew>> = [];
    const status: Record<string, string> = {};
    if (source === "all" || source === "blueprint") {
      try {
        fresh = fresh.concat(await fetchBlueprintNew());
        status.blueprint = "ok";
      } catch (e) {
        status.blueprint = "fail: " + String(e).slice(0, 100);
      }
    }
    if (source === "all" || source === "reddit") {
      try {
        fresh = fresh.concat(await fetchRedditNew());
        status.reddit = "ok";
      } catch (e) {
        status.reddit = "fail: " + String(e).slice(0, 100);
      }
    }
    if (fresh.length === 0) {
      return NextResponse.json({ added: 0, msg: "没有新内容", status });
    }

    // 翻译
    const translated = await translateItems(fresh.slice(0, 15));

    // 入库
    let added = 0;
    for (let i = 0; i < fresh.length; i++) {
      const it = fresh[i];
      const t = translated[i];
      await insertCollection({
        source: it.source,
        sourceId: it.sourceId,
        titleEn: it.titleEn,
        descEn: it.descEn,
        titleZh: t.titleZh,
        descZh: t.descZh,
        difficulty: t.difficulty,
        type: t.type,
        url: it.url,
      });
      added++;
    }
    return NextResponse.json({ added, total: fresh.length, status });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
