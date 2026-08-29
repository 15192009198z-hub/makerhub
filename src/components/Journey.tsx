"use client";

import { useEffect, useRef } from "react";

/**
 * 造物旅程：四幕循环动画（样式见 globals.css，v12 验证版）
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
    <div ref={ref} className="journey-box relative overflow-hidden border-t border-[rgba(255,255,255,0.05)]">
      <NetCanvas />
      <div className="j-inner relative z-[2] px-6 py-24 lg:px-14 lg:py-36">
        <div className="j-head text-center">
          <div className="kicker">FROM IDEA TO REALITY</div>
          <h2 className="mt-4 text-3xl font-extrabold tracking-[3px] lg:text-4xl">
            造物的旅程
          </h2>
        </div>

        <div className="stage mx-auto mt-12 grid max-w-[780px] lg:mt-16">
          {/* 场景1 梦想 */}
          <div className="scene scene-idea active">
            <div className="halo" />
            <div className="lead">有没有儿时造物的梦想？</div>
            <div className="big">比如，拍手就能点亮的灯<span className="cursor" /></div>
            <div className="trail">现在，让 AI 帮你实现</div>
          </div>

          {/* 场景2 设计 */}
          <div className="scene scene-bom">
            <div className="cap">说出想法 · AI 生成零件清单</div>
            {[
              ["01", "Arduino Nano V3.0", "主控"],
              ["02", "KY-038 麦克风模块", "传感"],
              ["03", "WS2812B 5V LED 灯带", "输出"],
              ["04", "3D 打印外壳 + 螺丝", "结构"],
            ].map(([n, nm, st]) => (
              <div key={n} className="bom-line">
                <span className="n">{n}</span>
                <span className="nm">{nm}</span>
                <span className="qt">×1</span>
                <span className="st">{st}</span>
                <span className="ok">✓</span>
              </div>
            ))}
            <div className="bom-done">✔ 零件清单已生成 · 共 4 项</div>
          </div>

          {/* 场景3 买料 */}
          <div className="scene scene-shop">
            <div className="cap">国内购买链接 · 一键直达</div>
            <div className="shop-row">
              <span className="shop-btn b1">淘宝</span>
              <span className="shop-btn b2">1688</span>
              <span className="shop-btn b3">拼多多</span>
            </div>
            <svg className="arcs" viewBox="0 0 560 64" preserveAspectRatio="none">
              <path d="M110 2 C110 34, 200 48, 280 58" stroke="rgba(255,138,76,0.55)" />
              <path d="M280 2 C280 34, 280 48, 280 58" stroke="rgba(76,141,255,0.55)" />
              <path d="M450 2 C450 34, 360 48, 280 58" stroke="rgba(240,120,120,0.55)" />
            </svg>
            <div className="cost">材料成本 <b>¥45</b> · 两天到货</div>
          </div>

          {/* 场景4 交易 */}
          <div className="scene scene-trade">
            <div className="cap">成品出炉 · 挂链交易</div>
            <div className="chain">
              <span className="node">作品</span><span className="link">→</span>
              <span className="node">意向单</span><span className="link">→</span>
              <span className="node">闲鱼成交</span>
            </div>
            <div className="done">造物，变成 <b>可交易的作品</b></div>
          </div>
        </div>

        {/* 步骤条 */}
        <div className="steps relative mt-12 flex justify-center gap-5 lg:mt-14 lg:gap-11">
          <div className="track" />
          <span className="sp on"><span className="sd" />梦想</span>
          <span className="sp"><span className="sd" />设计</span>
          <span className="sp"><span className="sd" />买料</span>
          <span className="sp"><span className="sd" />交易</span>
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
