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

/** 聚合集合（来源：Blueprint 社区，AI 中文简介） */
export interface CollectionItem {
  id: string;
  title: string;
  zh: string;
  difficulty: "新手" | "进阶" | "大佬";
  type: string;
  source: string;
  url: string;
}

export const COLLECTION: CollectionItem[] = [
  {
    id: "2195",
    title: "Cyberboard V2 赛博开发板",
    zh: "赛博朋克主题的 STM32 开发板：蓝牙 5.1 + 锂电池充电，内置 IMU 和气压计，修复了上一版所有错误。适合喜欢炫酷外观的电子爱好者。",
    difficulty: "进阶",
    type: "开发板",
    source: "Blueprint 社区",
    url: "https://blueprint.hackclub.com/projects/2195",
  },
  {
    id: "4721",
    title: "ES_01 电子墨水智能手表",
    zh: "厚度仅 5 毫米的智能手表：元件直线排布成独立模块，可弯曲贴合手腕，配备低功耗 E-ink 触摸屏。追求轻薄可穿戴设备的不二之选。",
    difficulty: "大佬",
    type: "可穿戴",
    source: "Blueprint 社区",
    url: "https://blueprint.hackclub.com/projects/4721",
  },
  {
    id: "2176",
    title: "Plico 分体键盘",
    zh: "完全自定义的分体式机械键盘：KMK 软件控制按键与响应式灯光，未来版本可折叠携带。键盘爱好者和 DIY 玩家的心头好。",
    difficulty: "进阶",
    type: "键盘",
    source: "Blueprint 社区",
    url: "https://blueprint.hackclub.com/projects/2176",
  },
  {
    id: "97",
    title: "3lb 战斗机器人",
    zh: "全 3D 打印（大部分）的甲虫级竞技战斗机器人，重约 3 磅，专为机器人格斗比赛打造。",
    difficulty: "大佬",
    type: "机器人",
    source: "Blueprint 社区",
    url: "https://blueprint.hackclub.com/projects/97",
  },
  {
    id: "983",
    title: "FPV 穿越无人机",
    zh: "第一人称视角无人机：VR 眼镜实时回传摄像头画面，高速特技飞行。追求刺激飞行体验的入门首选。",
    difficulty: "进阶",
    type: "无人机",
    source: "Blueprint 社区",
    url: "https://blueprint.hackclub.com/projects/983",
  },
  {
    id: "117",
    title: "G1 Mini 3D 打印机 V2",
    zh: "作者设计的第二代 3D 打印机：结构超刚性、速度极快，已完成大部分开发。需要高精度高速打印的创客值得关注。",
    difficulty: "大佬",
    type: "工具",
    source: "Blueprint 社区",
    url: "https://blueprint.hackclub.com/projects/117",
  },
  {
    id: "173",
    title: "Minty FPGA 开发板",
    zh: "基于 ECP5 FPGA 的开发板，配备 DDR3 内存。数字电路设计与嵌入式开发学习者的好玩具。",
    difficulty: "大佬",
    type: "开发板",
    source: "Blueprint 社区",
    url: "https://blueprint.hackclub.com/projects/173",
  },
  {
    id: "370",
    title: "BECCA 高功率火箭",
    zh: "为 L1 认证发射建造的业余高功率火箭。航天工程爱好者的硬核项目。",
    difficulty: "大佬",
    type: "工具",
    source: "Blueprint 社区",
    url: "https://blueprint.hackclub.com/projects/370",
  },
  {
    id: "145",
    title: "房间人体感应器",
    zh: "检测有人进入房间的传感器装置，智能家居与安防应用，新手友好、简单易用。",
    difficulty: "新手",
    type: "安全",
    source: "Blueprint 社区",
    url: "https://blueprint.hackclub.com/projects/145",
  },
  {
    id: "25",
    title: "Pico 计算器",
    zh: "基于树莓派 Pico 的自定义计算器：18 按键 + 编码器 + LCD 屏。学习嵌入式编程和 DIY 电子的绝佳起点。",
    difficulty: "新手",
    type: "工具",
    source: "Blueprint 社区",
    url: "https://blueprint.hackclub.com/projects/25",
  },
];
