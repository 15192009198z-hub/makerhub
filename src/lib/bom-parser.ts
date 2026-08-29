// BOM 文本解析：把用户粘贴的零件清单文本解析成结构化条目
// 规则解析（零依赖，永远可用）+ 可选 LLM 增强（配了 API key 时启用）

import type { BomItem } from "./types";

// ---- 规则解析 ----

export function parseBomText(text: string): BomItem[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const items: BomItem[] = [];
  for (const raw of lines) {
    let rest = raw;

    // 提取备注：（...）【...】或 —— 或 冒号 后的内容
    let note = "";
    const noteMatch = rest.match(/[（(【\[].*?[)）\]】]|——.+$|—.+$|[:：].+$/);
    if (noteMatch) {
      note = noteMatch[0]
        .replace(/[（(【\[)）\]】——:：]/g, "")
        .trim();
      rest = rest.replace(noteMatch[0], "").trim();
    }

    // 提取数量：×2 / x2 / X2 / *2 / 2个 / 2只 / 2pcs / 数量:2
    let qty = "1";
    const qMatch = rest.match(
      /[×xX*]\s*(\d+)|(\d+)\s*(?:个|只|件|片|颗|pcs|PCS|个装)$|数量\D*(\d+)/
    );
    if (qMatch) {
      qty = qMatch[1] || qMatch[2] || qMatch[3] || "1";
      rest = rest.replace(qMatch[0], "").trim();
    }

    // 去掉行首序号 "1." / "1、" / "- "
    rest = rest.replace(/^\d+[.、)）]\s*/, "").replace(/^[-•*]\s*/, "").trim();

    if (rest) {
      items.push({ name: rest, qty, note });
    }
  }
  return items;
}

// ---- LLM 增强（可选）----

export function llmEnabled(): boolean {
  return Boolean(process.env.LLM_API_KEY);
}

export async function parseBomWithLLM(text: string): Promise<BomItem[]> {
  const apiKey = process.env.LLM_API_KEY;
  const baseUrl = process.env.LLM_BASE_URL || "https://api.deepseek.com/v1";
  const model = process.env.LLM_MODEL || "deepseek-chat";
  if (!apiKey) return parseBomText(text);

  const system =
    "你是硬件零件清单解析器。把用户给的 BOM 文本解析成 JSON 数组，每项 {name, qty, note}。" +
    "name 是零件名称（中文优先，保留型号如 DHT11、10kΩ），qty 是数量（默认1），note 是规格备注（没有就空字符串）。" +
    "只输出 JSON 数组，不要多余文字。";

  try {
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: system },
          { role: "user", content: text.slice(0, 4000) },
        ],
        temperature: 0,
        response_format: { type: "json_object" },
      }),
    });
    if (!res.ok) return parseBomText(text);
    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content ?? "";
    const parsed = JSON.parse(content);
    const arr = Array.isArray(parsed) ? parsed : parsed?.items;
    if (!Array.isArray(arr) || arr.length === 0) return parseBomText(text);
    return arr
      .map((it: { name?: string; qty?: string | number; note?: string }) => ({
        name: String(it.name ?? "").trim(),
        qty: String(it.qty ?? "1"),
        note: String(it.note ?? "").trim(),
      }))
      .filter((it: BomItem) => it.name);
  } catch {
    return parseBomText(text);
  }
}
