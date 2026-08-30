// Reddit 聚合器：r/arduino、r/diyelectronics 热门帖（公开 JSON API）
import { collectionExists } from "@/lib/db";
import type { RawItem } from "./blueprint";

const SUBS = ["arduino", "diyelectronics"];

export async function fetchRedditNew(limit = 15): Promise<RawItem[]> {
  const items: RawItem[] = [];
  for (const sub of SUBS) {
    const url = `https://www.reddit.com/r/${sub}/top.json?limit=${limit}&t=month`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "MakerHub-aggregator/1.0 (hardware community aggregator)",
      },
      cache: "no-store",
    });
    if (!res.ok) continue; // 单个源失败不阻塞
    const data = await res.json();
    const posts = data?.data?.children || [];
    for (const child of posts) {
      const p = child?.data;
      if (!p || p.stickied || p.over_18) continue;
      const title = String(p.title || "").slice(0, 200);
      if (!title) continue;
      // 描述：selftext 或外部链接标题
      let descEn = String(p.selftext || "").replace(/\s+/g, " ").trim().slice(0, 2000);
      if (!descEn && p.url) descEn = `Reddit 讨论帖，点击查看详情。`;
      const permalink = `https://www.reddit.com${p.permalink}`;
      if (await collectionExists("reddit", p.id)) continue;
      items.push({
        source: "reddit",
        sourceId: String(p.id),
        titleEn: title,
        descEn: descEn || "Reddit 硬件社区热帖",
        url: permalink,
      });
    }
  }
  return items.slice(0, 30);
}
