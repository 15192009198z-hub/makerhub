"use client";

import { useMemo, useState } from "react";

interface Conn {
  a: string;
  b: string;
  note: string;
}

/**
 * 接线示意图：零件环形布局 + 连接线
 * 参考 Blueprint / Schematik 的接线可视化交互
 */
export default function WiringDiagram({
  connections,
}: {
  connections: Conn[];
}) {
  const [hover, setHover] = useState<string | null>(null);

  const { nodes, edges } = useMemo(() => {
    // 节点 = 连接涉及的零件（去重）
    const names: string[] = [];
    for (const c of connections) {
      if (!names.includes(c.a)) names.push(c.a);
      if (!names.includes(c.b)) names.push(c.b);
    }
    const W = 560;
    const H = 420;
    const cx = W / 2;
    const cy = H / 2;
    const R = Math.min(W, H) / 2 - 70;
    const nodes = names.map((n, i) => {
      const angle = (i / names.length) * Math.PI * 2 - Math.PI / 2;
      return {
        name: n,
        x: cx + Math.cos(angle) * R,
        y: cy + Math.sin(angle) * R,
      };
    });
    const edges = connections.map((c, i) => {
      const na = nodes.find((n) => n.name === c.a);
      const nb = nodes.find((n) => n.name === c.b);
      return { ...c, i, na, nb };
    });
    return { nodes, edges };
  }, [connections]);

  if (nodes.length === 0) return null;

  return (
    <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0a0d12] p-4">
      <svg viewBox="0 0 560 420" className="w-full">
        {/* 连接线 */}
        {edges.map((e) => {
          if (!e.na || !e.nb) return null;
          const active = hover === e.na.name || hover === e.nb.name;
          const midX = (e.na.x + e.nb.x) / 2;
          const midY = (e.na.y + e.nb.y) / 2 - 18;
          return (
            <g
              key={e.i}
              onMouseEnter={() => setHover(e.a)}
              onMouseLeave={() => setHover(null)}
              className="cursor-pointer"
            >
              <path
                d={`M ${e.na.x} ${e.na.y} Q ${midX} ${midY} ${e.nb.x} ${e.nb.y}`}
                fill="none"
                stroke={active ? "#7FB4FF" : "rgba(76,141,255,0.35)"}
                strokeWidth={active ? 2 : 1.2}
                strokeDasharray="5 4"
                style={{ transition: "all .2s" }}
              />
              {/* 连接说明标签 */}
              <text
                x={midX}
                y={midY - 6}
                textAnchor="middle"
                fontSize="10"
                fill={active ? "#7FB4FF" : "rgba(110,140,180,0.6)"}
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
          return (
            <g
              key={n.name}
              onMouseEnter={() => setHover(n.name)}
              onMouseLeave={() => setHover(null)}
              className="cursor-pointer"
            >
              <circle
                cx={n.x}
                cy={n.y}
                r={active ? 26 : 22}
                fill={active ? "rgba(76,141,255,0.25)" : "rgba(76,141,255,0.1)"}
                stroke={active ? "#7FB4FF" : "rgba(76,141,255,0.5)"}
                strokeWidth="1.5"
                style={{ transition: "all .2s" }}
              />
              <circle cx={n.x} cy={n.y} r="4" fill="#7FB4FF" />
              <text
                x={n.x}
                y={n.y + 44}
                textAnchor="middle"
                fontSize="11.5"
                fill={active ? "#E8E8EA" : "#8e8e98"}
                style={{ transition: "all .2s" }}
              >
                {n.name.length > 14 ? n.name.slice(0, 13) + "…" : n.name}
              </text>
            </g>
          );
        })}
      </svg>
      <p className="mt-2 text-center text-[11.5px] tracking-[1px] text-[#5e5e68]">
        示意接线图 · 悬停节点/连线查看连接
      </p>
    </div>
  );
}
