// AI 造物工作室：中文想法 → 造物方案（BOM + 接线 + 步骤）
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface StudioResult {
  title: string;
  bom: { name: string; qty: string; note: string }[];
  wiring: string;
  steps: string[];
  notes: string[];
}

const SYSTEM_PROMPT = `你是资深硬件创客助手。用户会用中文描述一个想做的实物，你要把它变成一个可以直接照着做的完整造物方案。

只输出一个 JSON 对象，不要任何多余文字，格式：
{
  "title": "作品名称（中文，简洁）",
  "bom": [{"name": "零件名称（含型号规格，如 Arduino Nano V3.0、KY-038 麦克风模块）", "qty": "数量", "note": "用途或规格说明"}],
  "wiring": "接线说明（2-4 句话，讲清楚关键连接）",
  "steps": ["组装步骤1", "步骤2", "步骤3", "步骤4"],
  "notes": ["注意事项1", "注意事项2"]
}

要求：
- 零件优先选国内容易买到的常见模块（Arduino/ESP32、传感器模块、面包板、杜邦线等）
- bom 至少 3 个零件，最多 8 个
- 步骤 3-5 条，具体可执行
- 全部用简体中文`;

export async function POST(req: Request) {
  try {
    const { idea } = await req.json();
    if (!idea || typeof idea !== "string" || idea.trim().length < 2) {
      return NextResponse.json({ error: "请描述你想做的实物" }, { status: 400 });
    }
    const apiKey = process.env.LLM_API_KEY;
    const baseUrl = process.env.LLM_BASE_URL || "https://api.deepseek.com/v1";
    const model = process.env.LLM_MODEL || "deepseek-chat";
    if (!apiKey) {
      return NextResponse.json(
        { error: "AI 引擎未配置（站长需要配置 LLM_API_KEY）" },
        { status: 503 }
      );
    }

    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `我想做：${idea.trim().slice(0, 500)}` },
        ],
        temperature: 0.3,
        response_format: { type: "json_object" },
      }),
    });
    if (!res.ok) {
      const t = await res.text();
      return NextResponse.json(
        { error: `AI 服务异常（${res.status}）：${t.slice(0, 200)}` },
        { status: 502 }
      );
    }
    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content ?? "";
    const parsed = JSON.parse(content) as StudioResult;

    // 清洗
    const result: StudioResult = {
      title: String(parsed.title || "未命名造物").slice(0, 60),
      bom: Array.isArray(parsed.bom)
        ? parsed.bom
            .map((b) => ({
              name: String(b.name || "").trim().slice(0, 120),
              qty: String(b.qty || "1"),
              note: String(b.note || "").trim().slice(0, 120),
            }))
            .filter((b) => b.name)
            .slice(0, 12)
        : [],
      wiring: String(parsed.wiring || "").slice(0, 600),
      steps: Array.isArray(parsed.steps)
        ? parsed.steps.map((s) => String(s).trim()).filter(Boolean).slice(0, 6)
        : [],
      notes: Array.isArray(parsed.notes)
        ? parsed.notes.map((s) => String(s).trim()).filter(Boolean).slice(0, 4)
        : [],
    };
    if (result.bom.length === 0) {
      return NextResponse.json({ error: "AI 没有生成有效的零件清单，请换个说法再试" }, { status: 422 });
    }
    return NextResponse.json({ result });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
