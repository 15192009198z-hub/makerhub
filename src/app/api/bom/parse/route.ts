// BOM 解析 API：粘贴文本 → 结构化零件 + 三渠道找料链接
import { NextResponse } from "next/server";
import { parseBomText, parseBomWithLLM } from "@/lib/bom-parser";
import { buildPartLinks } from "@/lib/parts";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { text, useLlm } = await req.json();
    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "缺少 BOM 文本" }, { status: 400 });
    }
    const items =
      useLlm || process.env.LLM_ALWAYS
        ? await parseBomWithLLM(text)
        : parseBomText(text);
    const result = items.map((it) => ({
      ...it,
      links: buildPartLinks(it.name),
    }));
    return NextResponse.json({ items: result });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
