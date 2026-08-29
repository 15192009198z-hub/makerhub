"use client";

import { useEffect, useRef } from "react";

/**
 * 造物旅程：四幕循环动画
 * 梦想 → 设计（BOM 逐行）→ 买料（三渠道）→ 交易（挂链）
 */
export default function Journey() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const scenes = root.querySelectorAll(".scene");
    const steps = root.querySelectorAll(".steps .sp");
    const track = root.querySelector(".steps .track") as HTMLElement | null;
    const T = [4200, 4200, 3600, 4000];
    let idx = 0;

    // 场景1 逐字
    const big = root.querySelector(".scene-idea .big");
    if (big) {
      const text = big.childNodes[0]?.textContent || "";
      big.childNodes[0].textContent = "";
      text.split("").forEach((c, i) => {
        const span = document.createElement("span");
        span.className = "ch";
        span.textContent = c;
        span.style.transitionDelay = 0.35 + i * 0.06 + "s";
        big.appendChild(span);
      });
    }

    const runBom = () => {
      root.querySelectorAll(".bom-line").forEach((l, i) =>
        setTimeout(() => l.classList.add("show"), 150 + i * 420)
      );
      setTimeout(
        () => root.querySelector(".bom-done")?.classList.add("show"),
        150 + 4 * 420 + 300
      );
    };
    const runShop = () => {
      root.querySelectorAll(".shop-btn").forEach((b, i) =>
        setTimeout(() => b.classList.add("show"), 150 + i * 300)
      );
      setTimeout(
        () => root.querySelector(".scene-shop")?.classList.add("show-arcs"),
        150 + 3 * 300 + 500
      );
    };
    const runTrade = () => {
      root.querySelectorAll(".chain .node").forEach((n, i) =>
        setTimeout(() => {
          n.classList.add("show");
          if (i === 2) n.classList.add("lit");
        }, 300 + i * 600)
      );
      setTimeout(
        () => root.querySelector(".chain")?.classList.add("show-links"),
        350
      );
      setTimeout(
        () => root.querySelector(".scene-trade")?.classList.add("show-done"),
        2400
      );
    };

    const activate = (n: number) => {
      scenes.forEach((sc, i) => sc.classList.toggle("active", i === n));
      steps.forEach((sp, i) => sp.classList.toggle("on", i === n));
      if (track) track.style.width = (n === 0 ? 0 : (n / 3) * 84) + "%";
      root.querySelectorAll(".bom-line").forEach((l) => l.classList.remove("show"));
      root.querySelector(".bom-done")?.classList.remove("show");
      root.querySelectorAll(".shop-btn").forEach((b) => b.classList.remove("show"));
      root.querySelector(".scene-shop")?.classList.remove("show-arcs");
      root.querySelectorAll(".chain .node").forEach((nn) =>
        nn.classList.remove("show", "lit")
      );
      root.querySelector(".chain")?.classList.remove("show-links");
      root.querySelector(".scene-trade")?.classList.remove("show-done");
      if (n === 1) runBom();
      if (n === 2) runShop();
      if (n === 3) runTrade();
    };

    const timers: ReturnType<typeof setTimeout>[] = [];
    const loop = () => {
      activate(idx);
      timers.push(
        setTimeout(() => {
          idx = (idx + 1) % 4;
          loop();
        }, T[idx])
      );
    };
    loop();
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div ref={ref} className="relative overflow-hidden border-t border-[rgba(255,255,255,0.05)]">
      {/* 粒子连线网络 */}
      <NetCanvas />
      <div className="relative z-[2] px-6 py-24 lg:px-14 lg:py-36">
        <div className="text-center">
          <div className="kicker">FROM IDEA TO REALITY</div>
          <h2 className="mt-4 text-3xl font-extrabold tracking-[3px] lg:text-4xl">
            造物的旅程
          </h2>
        </div>

        <div className="mx-auto mt-12 grid max-w-[780px] lg:mt-16">
          {/* 场景1 梦想 */}
          <div className="scene scene-idea active col-start-1 row-start-1 flex min-h-[300px] flex-col items-center justify-center text-center opacity-0 blur-[8px] transition-all duration-500 [&.active]:opacity-100 [&.active]:blur-0 [&.active]:translate-y-0 translate-y-4 invisible [&.active]:visible">
            <div className="absolute h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(76,141,255,0.10),transparent_65%)] animate-[haloPulse_3.2s_ease-in-out_infinite]" />
            <div className="lead text-[15px] tracking-[2px] text-[#8e8e98] opacity-0 transition-all duration-500 [.active_&]:opacity-100">
              有没有儿时造物的梦想？
            </div>
            <div className="big mt-6 font-serif-cn text-4xl font-black tracking-[4px] text-[#f4f4f6] lg:text-5xl">
              比如，拍手就能点亮的灯
              <span className="ml-1.5 inline-block h-[0.85em] w-[3px] animate-[blink_.8s_infinite] bg-[#4c8dff] align-[-0.1em]" />
            </div>
            <div className="trail mt-5 text-[13.5px] tracking-[3px] text-[#5e5e68] opacity-0 transition-opacity duration-500 [.active_&]:opacity-100 delay-700">
              现在，让 AI 帮你实现
            </div>
          </div>
          {/* 场景2 设计 */}
          <div className="scene scene-bom col-start-1 row-start-1 flex min-h-[300px] flex-col items-center justify-center gap-2.5 text-center opacity-0 blur-[8px] transition-all duration-500 [&.active]:opacity-100 [&.active]:blur-0 invisible [&.active]:visible">
            <div className="cap mb-2 text-[14px] tracking-[2px] text-[#8e8e98]">
              说出想法 · AI 生成零件清单
            </div>
            {[
              ["01", "Arduino Nano V3.0", "主控"],
              ["02", "KY-038 麦克风模块", "传感"],
              ["03", "WS2812B 5V LED 灯带", "输出"],
              ["04", "3D 打印外壳 + 螺丝", "结构"],
            ].map(([n, nm, st]) => (
              <div
                key={n}
                className="bom-line relative flex w-[min(480px,86vw)] items-center gap-4 overflow-hidden rounded-lg border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.02)] px-5 py-3 text-[14px] opacity-0 transition-all duration-500 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[2px] before:bg-[#4c8dff] before:origin-top before:scale-y-0 before:transition-transform before:duration-400 [&.show]:opacity-100 [&.show]:before:scale-y-100"
              >
                <span className="mono w-[26px] text-[11px] text-[#5e5e68]">
                  {n}
                </span>
                <span className="flex-1 tracking-[0.5px]">{nm}</span>
                <span className="mono text-[13px] text-[#4c8dff]">×1</span>
                <span className="rounded border border-[rgba(94,205,133,0.3)] px-1.5 py-0.5 text-[11px] text-[#3e8d5f]">
                  {st}
                </span>
                <span className="absolute right-3.5 text-[13px] text-[#3e8d5f] opacity-0 transition-all duration-300 [.show_&]:opacity-100 [.show_&]:scale-100 scale-50">
                  ✓
                </span>
              </div>
            ))}
            <div className="bom-done mt-3.5 rounded-full border border-[rgba(94,205,133,0.25)] px-4 py-1.5 text-[12.5px] tracking-[2px] text-[#3e8d5f] opacity-0 transition-all duration-500 [&.show]:opacity-100">
              ✔ 零件清单已生成 · 共 4 项
            </div>
          </div>
          {/* 场景3 买料 */}
          <div className="scene scene-shop col-start-1 row-start-1 flex min-h-[300px] flex-col items-center justify-center text-center opacity-0 blur-[8px] transition-all duration-500 [&.active]:opacity-100 [&.active]:blur-0 invisible [&.active]:visible">
            <div className="cap mb-6 text-[14px] tracking-[2px] text-[#8e8e98]">
              国内购买链接 · 一键直达
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <span className="shop-btn rounded-lg border border-[rgba(255,138,76,0.4)] px-7 py-3 text-[14px] tracking-[2px] text-[#ffa26e] opacity-0 transition-all duration-400">
                淘宝
              </span>
              <span className="shop-btn rounded-lg border border-[rgba(76,141,255,0.4)] px-7 py-3 text-[14px] tracking-[2px] text-[#7fa8ff] opacity-0 transition-all duration-400">
                1688
              </span>
              <span className="shop-btn rounded-lg border border-[rgba(240,120,120,0.4)] px-7 py-3 text-[14px] tracking-[2px] text-[#f58a8a] opacity-0 transition-all duration-400">
                拼多多
              </span>
            </div>
            <svg
              className="arcs mt-1 block h-16 w-[min(560px,88vw)]"
              viewBox="0 0 560 64"
              preserveAspectRatio="none"
            >
              <path
                d="M110 2 C110 34, 200 48, 280 58"
                stroke="rgba(255,138,76,0.55)"
                fill="none"
                strokeWidth="1.4"
                strokeDasharray="200"
                strokeDashoffset="200"
                className="transition-all duration-700 [.show-arcs_&]:stroke-dashoffset-0"
              />
              <path
                d="M280 2 C280 34, 280 48, 280 58"
                stroke="rgba(76,141,255,0.55)"
                fill="none"
                strokeWidth="1.4"
                strokeDasharray="200"
                strokeDashoffset="200"
                className="transition-all duration-700 [.show-arcs_&]:stroke-dashoffset-0"
              />
              <path
                d="M450 2 C450 34, 360 48, 280 58"
                stroke="rgba(240,120,120,0.55)"
                fill="none"
                strokeWidth="1.4"
                strokeDasharray="200"
                strokeDashoffset="200"
                className="transition-all duration-700 [.show-arcs_&]:stroke-dashoffset-0"
              />
            </svg>
            <div className="cost mt-1.5 text-[14px] tracking-[2px] text-[#5e5e68] opacity-0 transition-all duration-500 [.show-arcs_&]:opacity-100">
              材料成本 <b className="mono text-base font-semibold text-[#c8c8ce]">¥45</b> ·
              两天到货
            </div>
          </div>
          {/* 场景4 交易 */}
          <div className="scene scene-trade col-start-1 row-start-1 flex min-h-[300px] flex-col items-center justify-center gap-6 text-center opacity-0 blur-[8px] transition-all duration-500 [&.active]:opacity-100 [&.active]:blur-0 invisible [&.active]:visible">
            <div className="cap text-[14px] tracking-[2px] text-[#8e8e98]">
              成品出炉 · 挂链交易
            </div>
            <div className="chain flex items-center gap-3.5">
              {["作品", "意向单", "闲鱼成交"].map((n, i) => (
                <span key={n}>
                  <span
                    className={`node relative rounded-md border px-4.5 py-2.5 text-[13px] tracking-[1px] text-[#c8c8ce] opacity-0 transition-all duration-400 [&.show]:opacity-100 [&.lit]:border-[rgba(76,141,255,0.6)] [&.lit]:text-[#7fa8ff] [&.lit]:shadow-[0_0_22px_rgba(76,141,255,0.3)] ${i === 0 ? "px-4 py-2.5" : ""}`}
                  >
                    {n}
                  </span>
                  {i < 2 && (
                    <span className="link mx-1 text-[14px] text-[#3a3a44] opacity-0 transition-opacity duration-300 [.show-links_&]:opacity-100">
                      →
                    </span>
                  )}
                </span>
              ))}
            </div>
            <div className="done text-[15px] tracking-[2px] text-[#c8c8ce] opacity-0 transition-opacity duration-500 [.show-done_&]:opacity-100">
              造物，变成 <b className="mono font-semibold text-[#4c8dff]">可交易的作品</b>
            </div>
          </div>
        </div>

        {/* 步骤条 */}
        <div className="relative mt-12 flex justify-center gap-5 lg:mt-14 lg:gap-11">
          <div className="absolute top-[3px] left-[8%] right-[8%] h-px bg-[rgba(255,255,255,0.06)]" />
          <div
            className="track absolute top-[3px] left-[8%] h-px w-0 bg-gradient-to-r from-[#4c8dff] to-[rgba(76,141,255,0.3)] transition-all duration-800"
          />
          {["梦想", "设计", "买料", "交易"].map((s, i) => (
            <span
              key={s}
              className={`sp relative z-[1] flex items-center gap-2.5 text-[12.5px] tracking-[2px] text-[#4a4a54] transition-colors duration-300 [&.on]:text-[#c8c8ce]`}
            >
              <span className="h-[7px] w-[7px] rounded-full bg-[#33333c] transition-all duration-300 [.on_&]:bg-[#4c8dff] [.on_&]:shadow-[0_0_10px_rgba(76,141,255,0.9]" />
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/** 粒子连线网络背景 */
function NetCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let w = 0,
      h = 0;
    const pts: { x: number; y: number; r: number; vx: number; vy: number }[] =
      [];
    const resize = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    const N = 42;
    for (let i = 0; i < N; i++)
      pts.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.5 + 0.4,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
      });
    let raf = 0;
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }
      for (let i = 0; i < N; i++)
        for (let j = i + 1; j < N; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 110) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(76,141,255,${(1 - d / 110) * 0.22})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      for (const p of pts) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(160,180,220,0.4)";
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 opacity-80" />;
}
