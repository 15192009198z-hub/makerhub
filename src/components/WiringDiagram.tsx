"use client";

import { useMemo, useState } from "react";

interface Conn {
  a: string;
  b: string;
  note: string;
}

/** 主控关键词（放中心） */
const MCU_RE =
  /Arduino|ESP32|ESP8266|STM32|Raspberry|树莓|UNO|Nano|Pico|开发板|单片机|主控/i;

/** 供电相关（用琥珀色） */
const POWER_RE = /VCC|GND|电源|电池|供电|5V|3\.3V|VIN|正极|负极/i;

/**
 * 接线示意图 v2：星形拓扑
 * 主控（或连接最多的节点）居中，其余节点环绕，连线辐射不交叉
 */
export default function WiringDiagram({
  connections,
}: {
  connections: Conn[];
}) {
  const [hover, setHover] = useState<string | null>(null);

  const { center, nodes, edges } = useMemo(() => {
    // 节点 = 连接涉及的零件（去重）
    const names: string[] = [];
    for (const c of connections) {
      if (!names.includes(c.a)) names.push(c.a);
      if (!names.includes(c.b)) names.push(c.b);
    }
    // 选中心：主控优先，否则连接数最多
    const degree = new Map<string, number>();
    for (const c of connections) {
      degree.set(c.a, (degree.get(c.a) || 0) + 1);
      degree.set(c.b, (degree.get(c.b) || 0) + 1);
    }
    const mcu =
      names.find((n) => MCU_RE.test(n)) ||
      [...degree.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ||
      names[0];

    const W = 600;
    const H = 440;
    const cx = W / 2;
    const cy = H / 2;
    const R = Math.min(W, H) / 2 - 80;
    const others = names.filter((n) => n !== mcu);
    const nodes = others.map((n, i) => {
      const angle = (i / Math.max(others.length, 1)) * Math.PI * 2 - Math.PI / 2;
      return { name: n, x: cx + Math.cos(angle) * R, y: cy + Math.sin(angle) * R };
    });
    nodes.push({ name: mcu, x: cx, y: cy });

    const edges = connections.map((c, i) => {
      const na = nodes.find((n) => n.name === c.a);
      const nb = nodes.find((n) => n.name === c.b);
      const isPower = POWER_RE.test(c.note);
      return { ...c, i, na, nb, isPower };
    });
    return { center: mcu, nodes, edges };
  }, [connections]);

  if (nodes.length === 0) return null;

  const short = (n: string) =>
    n.length > 12 ? n.slice(0, 11) + "…" : n;

  return (
    <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0a0d12] p-4">
      <svg viewBox="0 0 600 440" className="w-full">
        {/* 连接线 */}
        {edges.map((e) => {
          if (!e.na || !e.nb) return null;
          const active = hover === e.na.name || hover === e.nb.name;
          const color = e.isPower
            ? active
              ? "#FCD34D"
              : "rgba(245,170,90,0.5)"
            : active
              ? "#7FB4FF"
              : "rgba(76,141,255,0.35)";
          const midX = (e.na.x + e.nb.x) / 2;
          const midY = (e.na.y + e.nb.y) / 2 - 16;
          // 中心辐射线用直线；环间连线用弧线（抬高避开中心）
          const toCenter = e.na.name === center || e.nb.name === center;
          const d = toCenter
            ? `M ${e.na.x} ${e.na.y} L ${e.nb.x} ${e.nb.y}`
            : `M ${e.na.x} ${e.na.y} Q ${midX} ${midY} ${e.nb.x} ${e.nb.y}`;
          return (
            <g
              key={e.i}
              onMouseEnter={() => setHover(e.a)}
              onMouseLeave={() => setHover(null)}
              className="cursor-pointer"
            >
              <path
                d={d}
                fill="none"
                stroke={color}
                strokeWidth={active ? 2 : 1.2}
                strokeDasharray={e.isPower ? "none" : "5 4"}
                style={{ transition: "all .2s" }}
              />
              <text
                x={midX}
                y={midY - 6}
                textAnchor="middle"
                fontSize="10"
                fill={active ? "#E8E8EA" : "rgba(110,140,180,0.65)"}
                style={{ transition: "all .2s" }}
              >
                {e.note}
              </text>
            </g>
          );
        })}
        {/* 节点 */}
        {nodes.map((n) => {
          const active = hover === n.name;
          const isCenter = n.name === center;
          const r = isCenter ? 30 : 22;
          return (
            <g
              key={n.name}
              onMouseEnter={() => setHover(n.name)}
              onMouseLeave={() => setHover(null)}
              className="cursor-pointer"
            >
              {isCenter && (
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={44}
                  fill="none"
                  stroke="rgba(76,141,255,0.15)"
                  strokeWidth="1"
                  strokeDasharray="3 6"
                  style={{ animation: "spinSlow 12s linear infinite", transformOrigin: `${n.x}px ${n.y}px` }}
                />
              )}
              <circle
                cx={n.x}
                cy={n.y}
                r={active ? r + 4 : r}
                fill={
                  isCenter
                    ? "rgba(76,141,255,0.3)"
                    : active
                      ? "rgba(76,141,255,0.25)"
                      : "rgba(76,141,255,0.1)"
                }
                stroke={
                  isCenter
                    ? "#7FB4FF"
                    : active
                      ? "#7FB4FF"
                      : "rgba(76,141,255,0.5)"
                }
                strokeWidth={isCenter ? 2 : 1.5}
                style={{ transition: "all .2s" }}
              />
              <circle cx={n.x} cy={n.y} r="4" fill="#7FB4FF" />
              <text
                x={n.x}
                y={n.y + (isCenter ? 62 : 44)}
                textAnchor="middle"
                fontSize={isCenter ? 13 : 11.5}
                fontWeight={isCenter ? 700 : 400}
                fill={active || isCenter ? "#E8E8EA" : "#8e8e98"}
                style={{ transition: "all .2s" }}
              >
                {short(n.name)}
              </text>
              {isCenter && (
                <text
                  x={n.x}
                  y={n.y + 5}
                  textAnchor="middle"
                  fontSize="9"
                  letterSpacing="2"
                  fill="rgba(127,168,255,0.7)"
                >
                  主控
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <div className="mt-2 flex items-center justify-center gap-5 text-[11px] text-[#5e5e68]">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-px w-6 bg-[rgba(76,141,255,0.5)]" />
          信号线
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-px w-6 bg-[rgba(245,170,90,0.6)]" />
          供电线
        </span>
        <span>悬停查看连接</span>
      </div>
    </div>
  );
}
