export default function Logo({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" fill="none">
      <rect
        x="1"
        y="1"
        width="32"
        height="32"
        rx="7"
        stroke="rgba(255,255,255,0.14)"
      />
      {/* PCB 走线风格 M */}
      <path
        d="M9 25 V11 H13.5 L17 17 L20.5 11 H25 V25"
        stroke="#F0F0F2"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* LED 光点（灵感） */}
      <circle cx="9" cy="9" r="2.6" fill="#4C8DFF" />
      <circle cx="9" cy="9" r="5" fill="rgba(76,141,255,0.25)" />
    </svg>
  );
}
