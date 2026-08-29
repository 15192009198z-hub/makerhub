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
    <div className="builder-box hidden md:block">
      <div className="glow" />
      <div className="tower-stage">
        <div
          ref={ref}
          className="tower"
          style={{ transform: "rotateX(-30deg) rotateY(42deg)" }}
        />
      </div>
    </div>
  );
}
