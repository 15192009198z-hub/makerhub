// 卡片封面：类型渐变 + 几何图形（高级感，Aceternity/Launch UI 风格）

const TYPE_STYLE: Record<
  string,
  { grad: string; icon: string }
> = {
  开发板: { grad: "linear-gradient(135deg, #0c1a2e 0%, #12304f 55%, #0a2438 100%)", icon: "▦" },
  键盘: { grad: "linear-gradient(135deg, #1a1030 0%, #2d1b4e 55%, #1c1236 100%)", icon: "▤" },
  机器人: { grad: "linear-gradient(135deg, #2e1408 0%, #4e2410 55%, #331808 100%)", icon: "◇" },
  无人机: { grad: "linear-gradient(135deg, #08251f 0%, #124a3c 55%, #0a2b24 100%)", icon: "△" },
  可穿戴: { grad: "linear-gradient(135deg, #26081f 0%, #471237 55%, #2a0a22 100%)", icon: "◉" },
  工具: { grad: "linear-gradient(135deg, #2a1d05 0%, #4a330a 55%, #2f2106 100%)", icon: "▲" },
  安全: { grad: "linear-gradient(135deg, #07281c 0%, #0e4a33 55%, #082e20 100%)", icon: "●" },
  其他: { grad: "linear-gradient(135deg, #131a24 0%, #24344a 55%, #16202e 100%)", icon: "◆" },
};

export default function CoverArt({
  type,
  title,
  height = "h-[120px]",
}: {
  type: string;
  title?: string;
  height?: string;
}) {
  const st = TYPE_STYLE[type] || TYPE_STYLE.其他;
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${height}`}
      style={{ background: st.grad }}
    >
      {/* 网格纹理 */}
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "radial-gradient(rgba(148,163,184,0.25) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />
      {/* 光晕 */}
      <div className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-[rgba(76,141,255,0.16)] blur-2xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-8 h-24 w-24 rounded-full bg-[rgba(127,168,255,0.1)] blur-2xl" />
      {/* 图标 */}
      <span className="relative text-[30px] text-[rgba(220,228,240,0.5)]">
        {st.icon}
      </span>
      {/* 标题水印 */}
      {title && (
        <span className="absolute bottom-2.5 left-3.5 max-w-[85%] truncate text-[10.5px] tracking-[1.5px] text-[rgba(200,215,235,0.4)]">
          {title}
        </span>
      )}
    </div>
  );
}
