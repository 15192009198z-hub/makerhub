// DeepSeek 批量翻译：把聚合的英文项目翻译成中文简介
import type { RawItem } from "./blueprint";

export interface Translated {
  titleZh: string;
  descZh: string;
  difficulty: "新手" | "进阶" | "大佬";
  type: string;
}

/** 批量翻译（一次调用翻译最多 15 条） */
export async function translateItems(items: RawItem[]): Promise<Translated[]> {
  const apiKey = process.env.LLM_API_KEY;
  if (!apiKey) {
    throw new Error("LLM_API_KEY 未配置，无法翻译");
  }
  if (items.length === 0) return [];

  const batch = items.map((it) => ({
    id: it.sourceId,
    title: it.titleEn,
    desc: it.descEn,
  }));

  const system = `你是硬件项目编辑。把每个英文硬件项目翻译成中文，输出 JSON 数组，每项：
{"id": "原id", "title": "中文标题（英文名可保留混排）", "desc": "2-3句中文简介（做什么、亮点、适合谁）", "difficulty": "新手/进阶/大佬", "type": "分类（如 开发板/键盘/机器人/无人机/工具/可穿戴/安全/其他）"}
只输出 JSON 数组。`;

  const res = await fetch(
    `${process.env.LLM_BASE_URL || "https://api.deepseek.com/v1"}/chat/completions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.LLM_MODEL || "deepseek-chat",
        messages: [
          { role: "system", content: system },
          { role: "user", content: JSON.stringify(batch) },
        ],
        temperature: 0.3,
        response_format: { type: "json_object" },
      }),
    }
  );
  if (!res.ok) {
    throw new Error(`翻译服务异常: ${res.status}`);
  }
  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content ?? "";
  const arr = JSON.parse(content);
  const list = Array.isArray(arr) ? arr : arr?.items;
  if (!Array.isArray(list)) return [];

  const byId = new Map<string, Translated>();
  for (const t of list) {
    byId.set(String(t.id), {
      titleZh: String(t.title || "").slice(0, 200),
      descZh: String(t.desc || "").slice(0, 2000),
      difficulty: ["新手", "进阶", "大佬"].includes(t.difficulty)
        ? t.difficulty
        : "进阶",
      type: String(t.type || "其他").slice(0, 20),
    });
  }
  // 按原顺序返回
  return items.map((it) => {
    const t = byId.get(it.sourceId);
    return (
      t || {
        titleZh: it.titleEn.slice(0, 200),
        descZh: "（翻译失败，显示原文）" + it.descEn.slice(0, 500),
        difficulty: "进阶",
        type: "其他",
      }
    );
  });
}
