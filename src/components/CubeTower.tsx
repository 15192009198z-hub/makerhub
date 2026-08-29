"use client";

import { useEffect, useRef } from "react";

/**
 * 造物立方塔：27 个 6 面线框方块
 * 组装 → 旋转一圈 → 对称四散 → 持续旋转 → 重组（循环）
 */
export default function CubeTower() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tower = ref.current;
    if (!tower) return;

    const S = 62;
    const pos: [number, number, number][] = [];
    for (let x = -1; x <= 1; x++)
      for (let y = -1; y <= 1; y++)
        for (let z = -1; z <= 1; z++) pos.push([x * S, y * S, z * S]);

    const cells = pos.map((p, i) => {
      const el = document.createElement("div");
      el.className = "cell";
      if (i === 13) el.classList.add("core");
      if ([0, 2, 6, 8].includes(i)) el.classList.add("mod");
      if (i === 13) el.innerHTML = '<div class="dot"></div>';
      el.innerHTML +=
        '<div class="f f1"></div><div class="f f2"></div><div class="f f3"></div>' +
        '<div class="f f4"></div><div class="f f5"></div><div class="f f6"></div>';
      tower.appendChild(el);
      return { el, a: p };
    });

    // 对称径向散开（不出界）
    const bursts: [number, number, number][] = cells.map((c) => {
      const [x, y, z] = c.a;
      const len = Math.hypot(x, y, z) || 1;
      const d = 60 + 110 * (len / (S * Math.sqrt(3)));
      return [(x / len) * d, (y / len) * d, ((z / len) * d) * 0.55];
    });

    const glow = tower
      .closest(".builder-box")
      ?.querySelector(".glow") as HTMLElement | null;

    const CYCLE = 12000;
    const T = { asm: 1600, formed: 3800, xpl: 5200, spin: 11200 };
    let t0 = performance.now();
    let spinBase = 42;

    const setTransform = (c: { el: HTMLElement }, v: number[], delay: number) => {
      c.el.style.transitionDelay = (delay || 0) + "ms";
      c.el.style.transform = `translate3d(${v[0]}px, ${v[1]}px, ${v[2]}px)`;
    };

    // 初始：爆炸位
    cells.forEach((c, i) => {
      c.el.style.transition = "none";
      const v = [
        c.a[0] + bursts[i][0],
        c.a[1] + bursts[i][1],
        c.a[2] + bursts[i][2],
      ];
      c.el.style.transform = `translate3d(${v[0]}px, ${v[1]}px, ${v[2]}px)`;
      c.el.style.transition = "";
    });

    let raf = 0;
    const tick = (now: number) => {
      const t = (now - t0) % CYCLE;
      if (t < T.asm) {
        cells.forEach((c, i) => setTransform(c, c.a, i * 22));
        tower.style.transition = "transform 2s ease";
        tower.style.transform = "rotateX(-30deg) rotateY(42deg)";
        glow?.classList.remove("strong");
      } else if (t < T.formed) {
        tower.style.transition = "transform 2.2s cubic-bezier(.4,0,.2,1)";
        tower.style.transform = "rotateX(-30deg) rotateY(402deg)";
        glow?.classList.add("strong");
      } else if (t < T.xpl) {
        cells.forEach((c, i) => {
          setTransform(
            c,
            [
              c.a[0] + bursts[i][0],
              c.a[1] + bursts[i][1],
              c.a[2] + bursts[i][2],
            ],
            i * 10
          );
          c.el.style.opacity = "1";
        });
        glow?.classList.remove("strong");
      } else {
        tower.style.transition = "none";
        spinBase += 0.5;
        tower.style.transform = `rotateX(-30deg) rotateY(${spinBase}deg)`;
        glow?.classList.add("strong");
        cells.forEach((c) => {
          if (c.el.style.opacity === "0.22") c.el.style.opacity = "1";
        });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="builder-box relative z-10 hidden md:block">
      <div className="glow absolute inset-[14%] rounded-full bg-[radial-gradient(circle,rgba(76,141,255,0.14),transparent_65%)] opacity-30 transition-opacity duration-800" />
      <div className="absolute inset-0 flex items-center justify-center [perspective:1300px]">
        <div
          ref={ref}
          className="relative h-0 w-0 [transform-style:preserve-3d]"
          style={{ transform: "rotateX(-30deg) rotateY(42deg)" }}
        />
      </div>
      <style jsx>{`
        .cell {
          position: absolute;
          width: 52px;
          height: 52px;
          margin: -26px 0 0 -26px;
          transform-style: preserve-3d;
          transition:
            transform 1.1s cubic-bezier(0.22, 1, 0.36, 1),
            opacity 0.5s ease;
        }
        .cell .f {
          position: absolute;
          inset: 0;
          border: 1.4px solid rgba(76, 141, 255, 0.42);
          background: rgba(16, 26, 40, 0.45);
        }
        .cell .f.f1 {
          transform: translateZ(26px);
        }
        .cell .f.f2 {
          transform: rotateX(90deg) translateZ(26px);
        }
        .cell .f.f3 {
          transform: rotateY(90deg) translateZ(26px);
        }
        .cell .f.f4 {
          transform: rotateY(-90deg) translateZ(26px);
        }
        .cell .f.f5 {
          transform: rotateX(-90deg) translateZ(26px);
        }
        .cell .f.f6 {
          transform: rotateY(180deg) translateZ(26px);
        }
        .cell .f.f4,
        .cell .f.f5,
        .cell .f.f6 {
          background: rgba(16, 26, 40, 0.22);
          border-color: rgba(76, 141, 255, 0.24);
        }
        .cell.core .f {
          border-color: rgba(130, 185, 255, 0.95);
          background: rgba(76, 141, 255, 0.2);
        }
        .cell.core .dot {
          position: absolute;
          inset: 0;
          margin: auto;
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #7fb4ff;
          box-shadow: 0 0 14px 4px rgba(76, 141, 255, 0.8);
        }
        .cell.mod .f {
          border-color: rgba(245, 170, 90, 0.6);
          background: rgba(245, 158, 11, 0.08);
        }
      `}</style>
    </div>
  );
}
