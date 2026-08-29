// 找料链接：淘宝 / 1688 / 拼多多 三渠道按钮
import type { PartLink } from "@/lib/types";

const CHANNEL_STYLE: Record<string, string> = {
  taobao: "bg-orange-500/10 text-orange-400 ring-orange-500/30 hover:bg-orange-500/20",
  "1688": "bg-blue-500/10 text-blue-400 ring-blue-500/30 hover:bg-blue-500/20",
  pdd: "bg-red-500/10 text-red-400 ring-red-500/30 hover:bg-red-500/20",
};

export default function PartLinks({ links }: { links: PartLink[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {links.map((l) => (
        <a
          key={l.channel}
          href={l.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`rounded px-2 py-0.5 text-xs ring-1 transition-colors ${CHANNEL_STYLE[l.channel] || CHANNEL_STYLE.taobao}`}
        >
          {l.name} ↗
        </a>
      ))}
    </div>
  );
}
