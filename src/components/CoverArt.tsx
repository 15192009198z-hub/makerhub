// 卡片封面：类型专属 SVG 线稿图标 + 渐变底（内容感，非抽象符号）

const TYPE_META: Record<
  string,
  { grad: string; icon: string }
> = {
  开发板: {
    grad: "linear-gradient(135deg, #0c1a2e 0%, #12304f 55%, #0a2438 100%)",
    icon: `<svg viewBox="0 0 64 64" width="56" height="56" fill="none" stroke="rgba(140,180,255,0.75)" stroke-width="1.6">
      <rect x="8" y="18" width="48" height="28" rx="3"/>
      <rect x="26" y="26" width="14" height="12" rx="1.5" stroke="rgba(120,170,255,0.45)"/>
      <line x1="20" y1="10" x2="20" y2="18"/><line x1="44" y1="10" x2="44" y2="18"/>
      <line x1="20" y1="46" x2="20" y2="54"/><line x1="44" y1="46" x2="44" y2="54"/>
      <circle cx="14" cy="24" r="1.4" fill="rgba(140,180,255,0.9)"/><circle cx="14" cy="32" r="1.4" fill="rgba(140,180,255,0.9)"/>
      <circle cx="50" cy="24" r="1.4" fill="rgba(140,180,255,0.9)"/><circle cx="50" cy="32" r="1.4" fill="rgba(140,180,255,0.9)"/>
    </svg>`,
  },
  键盘: {
    grad: "linear-gradient(135deg, #1a1030 0%, #2d1b4e 55%, #1c1236 100%)",
    icon: `<svg viewBox="0 0 64 64" width="56" height="56" fill="none" stroke="rgba(190,160,255,0.75)" stroke-width="1.6">
      <rect x="6" y="20" width="52" height="26" rx="4"/>
      ${Array.from({ length: 6 })
        .map((_, i) => `<rect x="${10 + i * 8}" y="25" width="6" height="5" rx="1"/>`)
        .join("")}
      ${Array.from({ length: 6 })
        .map((_, i) => `<rect x="${10 + i * 8}" y="33" width="6" height="5" rx="1"/>`)
        .join("")}
      <rect x="10" y="41" width="20" height="2.5" rx="1"/>
    </svg>`,
  },
  机器人: {
    grad: "linear-gradient(135deg, #2e1408 0%, #4e2410 55%, #331808 100%)",
    icon: `<svg viewBox="0 0 64 64" width="56" height="56" fill="none" stroke="rgba(255,180,120,0.75)" stroke-width="1.6">
      <rect x="18" y="12" width="28" height="22" rx="5"/>
      <circle cx="26" cy="23" r="3.2"/><circle cx="38" cy="23" r="3.2"/>
      <line x1="32" y1="5" x2="32" y2="12"/>
      <circle cx="32" cy="4" r="1.6" fill="rgba(255,180,120,0.9)"/>
      <line x1="22" y1="34" x2="14" y2="46"/><line x1="42" y1="34" x2="50" y2="46"/>
      <rect x="10" y="46" width="8" height="10" rx="2"/><rect x="46" y="46" width="8" height="10" rx="2"/>
      <rect x="24" y="46" width="16" height="8" rx="2"/>
    </svg>`,
  },
  无人机: {
    grad: "linear-gradient(135deg, #08251f 0%, #124a3c 55%, #0a2b24 100%)",
    icon: `<svg viewBox="0 0 64 64" width="56" height="56" fill="none" stroke="rgba(130,220,190,0.75)" stroke-width="1.6">
      <rect x="26" y="26" width="12" height="12" rx="2"/>
      <line x1="32" y1="26" x2="14" y2="14"/><line x1="32" y1="26" x2="50" y2="14"/>
      <line x1="32" y1="38" x2="14" y2="50"/><line x1="32" y1="38" x2="50" y2="50"/>
      <circle cx="14" cy="14" r="4"/><circle cx="50" cy="14" r="4"/>
      <circle cx="14" cy="50" r="4"/><circle cx="50" cy="50" r="4"/>
      <circle cx="32" cy="32" r="1.8" fill="rgba(130,220,190,0.9)"/>
    </svg>`,
  },
  可穿戴: {
    grad: "linear-gradient(135deg, #26081f 0%, #471237 55%, #2a0a22 100%)",
    icon: `<svg viewBox="0 0 64 64" width="56" height="56" fill="none" stroke="rgba(255,150,220,0.75)" stroke-width="1.6">
      <rect x="14" y="22" width="36" height="22" rx="6"/>
      <circle cx="32" cy="33" r="6.5"/>
      <line x1="20" y1="22" x2="16" y2="14"/><line x1="44" y1="22" x2="48" y2="14"/>
      <line x1="16" y1="14" x2="10" y2="14"/><line x1="48" y1="14" x2="54" y2="14"/>
    </svg>`,
  },
  工具: {
    grad: "linear-gradient(135deg, #2a1d05 0%, #4a330a 55%, #2f2106 100%)",
    icon: `<svg viewBox="0 0 64 64" width="56" height="56" fill="none" stroke="rgba(255,200,120,0.75)" stroke-width="1.6">
      <path d="M20 8 L44 8 L52 16 L52 56 L12 56 L12 16 Z"/>
      <line x1="18" y1="14" x2="46" y2="14"/>
      <line x1="22" y1="24" x2="42" y2="24"/><line x1="22" y1="32" x2="42" y2="32"/>
      <line x1="22" y1="40" x2="34" y2="40"/>
      <circle cx="28" cy="48" r="2.4"/><circle cx="36" cy="48" r="2.4"/>
    </svg>`,
  },
  安全: {
    grad: "linear-gradient(135deg, #07281c 0%, #0e4a33 55%, #082e20 100%)",
    icon: `<svg viewBox="0 0 64 64" width="56" height="56" fill="none" stroke="rgba(140,230,170,0.75)" stroke-width="1.6">
      <path d="M32 6 L54 14 V32 C54 46 44 54 32 58 C20 54 10 46 10 32 V14 Z"/>
      <circle cx="32" cy="30" r="7"/>
      <path d="M32 24 V30 L37 33"/>
    </svg>`,
  },
  其他: {
    grad: "linear-gradient(135deg, #131a24 0%, #24344a 55%, #16202e 100%)",
    icon: `<svg viewBox="0 0 64 64" width="56" height="56" fill="none" stroke="rgba(160,180,210,0.7)" stroke-width="1.6">
      <circle cx="32" cy="32" r="20"/><circle cx="32" cy="32" r="10"/>
      <line x1="32" y1="12" x2="32" y2="52"/><line x1="12" y1="32" x2="52" y2="32"/>
    </svg>`,
  },
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
  const st = TYPE_META[type] || TYPE_META.其他;
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
      {/* 线稿图标 */}
      <div
        className="relative"
        dangerouslySetInnerHTML={{ __html: st.icon }}
      />
      {/* 标题水印 */}
      {title && (
        <span className="absolute bottom-2.5 left-3.5 max-w-[85%] truncate text-[10.5px] tracking-[1.5px] text-[rgba(200,215,235,0.4)]">
          {title}
        </span>
      )}
    </div>
  );
}
