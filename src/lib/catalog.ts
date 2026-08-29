// 静态目录数据：工具 + 真实项目案例（来自 Blueprint 社区，非编造）

export interface Tool {
  index: string;
  name: string;
  desc: string;
  tag: string;
  url: string;
}

export const TOOLS: Tool[] = [
  {
    index: "01",
    name: "Blueprint",
    desc: "输入想法，输出原理图、零件清单、3D 外壳与组装说明",
    tag: "全流程生成",
    url: "https://www.blueprint.io/",
  },
  {
    index: "02",
    name: "Cirkit Designer",
    desc: "浏览器内电路设计与仿真，AI 选型，可导出 BOM",
    tag: "可导出 BOM",
    url: "https://www.cirkitdesigner.com/",
  },
  {
    index: "03",
    name: "Schematik",
    desc: "自然语言直接生成接线图、BOM 与固件代码",
    tag: "自然语言",
    url: "https://www.schematik.io/",
  },
  {
    index: "04",
    name: "Flux.ai",
    desc: "项目内嵌 AI 设计助手，组件级上下文理解",
    tag: "设计助手",
    url: "https://www.flux.ai/",
  },
];

/** 真实项目案例（来源：Blueprint 社区 blueprint.hackclub.com） */
export interface RealProject {
  id: string;
  title: string;
  desc: string;
  author: string;
  source: string;
  url: string;
  difficulty: "新手" | "进阶" | "大佬";
}

export const REAL_PROJECTS: RealProject[] = [
  {
    id: "cyberboard-v2",
    title: "Cyberboard V2",
    desc: "赛博朋克风格 STM32 开发板：蓝牙 5.1 连接 + 锂电池充电管理，内置 IMU 惯性传感器和气压计，修复了上一版所有设计错误。",
    author: "NotARoomba",
    source: "Blueprint 社区",
    url: "https://blueprint.hackclub.com/projects/2195",
    difficulty: "大佬",
  },
  {
    id: "es01-smartwatch",
    title: "ES_01 E-ink 智能手表",
    desc: "5mm 超薄电子墨水智能手表：所有元件直线排布成独立模块，可弯曲贴合手腕，配备低功耗 E-ink 触摸屏。",
    author: "Blueprint 社区用户",
    source: "Blueprint 社区",
    url: "https://blueprint.hackclub.com/projects/4721",
    difficulty: "大佬",
  },
  {
    id: "sim-wheel",
    title: "直驱力反馈模拟方向盘",
    desc: "用悬浮板轮毂电机 DIY 的直驱力反馈模拟赛车方向盘，记录完整的搭建过程——便宜、真实、有驾驶手感。",
    author: "Blueprint 社区用户",
    source: "Blueprint 社区",
    url: "https://blueprint.hackclub.com/projects/13532",
    difficulty: "进阶",
  },
];
