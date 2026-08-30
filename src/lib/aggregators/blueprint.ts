// Blueprint 社区聚合器：抓 explore 页 HTML，解析项目卡片
import { collectionExists } from "@/lib/db";

export interface RawItem {
  source: string;
  sourceId: string;
  titleEn: string;
  descEn: string;
  url: string;
}

const EXPLORE_URL = "https://blueprint.hackclub.com/explore";

function stripHtml(s: string): string {
  return s
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function unescape(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

/** 抓取并解析 Blueprint explore 页，返回新项目（已去重） */
export async function fetchBlueprintNew(): Promise<RawItem[]> {
  const res = await fetch(EXPLORE_URL, {
    headers: { "User-Agent": "Mozilla/5.0 (MakerHub aggregator)" },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Blueprint explore 抓取失败: ${res.status}`);
  const html = await res.text();

  const items: RawItem[] = [];
  const seen = new Set<string>();
  const re = /href="\/projects\/(\d+)[^"]*"[^>]*>([\s\S]*?)<\/a>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const pid = m[1];
    if (seen.has(pid)) continue;
    seen.add(pid);
    const text = unescape(stripHtml(m[2]));
    if (!text || text.length < 10) continue;
    // 标题 = 第一段（通常是项目名），描述 = 后续
    const parts = text.split(/\s{2,}|(?<=\w)(?=[A-Z][a-z])/).filter(Boolean);
    const titleEn = parts[0] || text.slice(0, 40);
    const descEn = text.replace(titleEn, "").trim().slice(0, 2000) || text;
    items.push({
      source: "blueprint",
      sourceId: pid,
      titleEn: titleEn.slice(0, 200),
      descEn: descEn.slice(0, 2000),
      url: `https://blueprint.hackclub.com/projects/${pid}`,
    });
  }

  // 去重（跳过已入库）
  const fresh: RawItem[] = [];
  for (const it of items) {
    if (await collectionExists(it.source, it.sourceId)) continue;
    fresh.push(it);
    if (fresh.length >= 20) break;
  }
  return fresh;
}
