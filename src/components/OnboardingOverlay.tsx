"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STEPS = [
  {
    icon: "🌐",
    title: "逛遍全球造物",
    desc: "这里集合了全球 AI 硬件社区的作品——开发板、机器人、键盘、无人机，全部翻译成中文，不用懂英文也能看。",
    cta: "去逛作品",
    href: "/explore",
  },
  {
    icon: "⭐",
    title: "收藏心动的作品",
    desc: "看到喜欢的点个星标，收藏在个人主页，随时回来看。",
    cta: "继续",
    href: null,
  },
  {
    icon: "🛒",
    title: "不用动手也能拥有",
    desc: "市场里有造物主做好的成品、设计图和教程——想要现成的，直接买。",
    cta: "逛市场",
    href: "/market",
  },
];

export default function OnboardingOverlay() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!localStorage.getItem("mh_onboarded")) {
      setShow(true);
    }
  }, []);

  function close(go?: string | null) {
    localStorage.setItem("mh_onboarded", "1");
    setShow(false);
    if (go) location.href = go;
  }

  if (!show) return null;

  const s = STEPS[step];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[rgba(5,6,9,0.82)] backdrop-blur-sm">
      <div className="relative w-[min(440px,90vw)] overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[#0e1116] p-8">
        {/* 顶部光晕 */}
        <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-72 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(76,141,255,0.18),transparent_65%)]" />
        {/* 进度点 */}
        <div className="relative flex items-center justify-center gap-2">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === step
                  ? "w-6 bg-[#4c8dff]"
                  : "w-2 bg-[rgba(255,255,255,0.12)]"
              }`}
            />
          ))}
        </div>

        <div className="relative mt-7 text-center">
          <div className="text-4xl">{s.icon}</div>
          <h2 className="mt-4 font-serif-cn text-2xl font-black tracking-[2px]">
            {s.title}
          </h2>
          <p className="mx-auto mt-3 max-w-[320px] text-[13.5px] leading-[1.9] text-[#8e8e98]">
            {s.desc}
          </p>
        </div>

        <div className="relative mt-8 flex flex-col gap-2.5">
          <button
            onClick={() =>
              step < STEPS.length - 1
                ? setStep(step + 1)
                : close(s.href)
            }
            className="btn btn-primary w-full justify-center !py-3"
          >
            {step < STEPS.length - 1 ? "下一步" : "开始逛"}
          </button>
          <button
            onClick={() => close(null)}
            className="w-full py-1.5 text-[12.5px] tracking-[2px] text-[#5e5e68] transition-colors hover:text-[#8e8e98]"
          >
            跳过引导
          </button>
        </div>

        {step === STEPS.length - 1 && (
          <Link
            href="/market"
            onClick={() => close("/market")}
            className="relative mt-2 block text-center text-[12px] text-[#5e5e68] hover:text-[#7fa8ff]"
          >
            直接去市场 →
          </Link>
        )}
      </div>
    </div>
  );
}
