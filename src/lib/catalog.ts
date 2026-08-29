// 静态目录数据：工具 + 设计清单（种子内容）

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

export interface Design {
  id: string;
  icon: string;
  title: string;
  desc: string;
  difficulty: "新手" | "进阶" | "大佬";
  cost: number;
  duration: string;
  tool: string;
  bom: string[];
  steps: string[];
}

export const DESIGNS: Design[] = [
  {
    id: "sound-lamp",
    icon: "💡",
    title: "拍手声控灯",
    desc: "拍手点亮 30 秒。Arduino Nano + 声音传感器 + WS2812B 灯带",
    difficulty: "新手",
    cost: 45,
    duration: "2 小时",
    tool: "Blueprint",
    bom: [
      "Arduino Nano V3.0 x1 （主控）",
      "KY-038 麦克风模块 x1 （声音传感器）",
      "WS2812B 5V LED 灯带 x1 （灯光输出）",
      "3D 打印外壳 x1 （PLA）",
      "M3x10 螺丝 x4 （固定）",
    ],
    steps: [
      "打开 Blueprint，输入：拍手声控灯，亮 30 秒",
      "复制生成的 BOM 到 MakerHub 发布",
      "按找料链接在淘宝/1688/拼多多买料（约 ¥45）",
      "按组装说明接线、打印外壳、刷固件",
    ],
  },
  {
    id: "temp-alarm",
    icon: "🌡️",
    title: "温湿度报警器",
    desc: "DHT11 实时监测，超阈值蜂鸣提醒。ESP32 可联网上报",
    difficulty: "进阶",
    cost: 60,
    duration: "3 小时",
    tool: "Cirkit Designer",
    bom: [
      "ESP32 开发板 x1 （主控，WiFi）",
      "DHT11 温湿度传感器 x1 （监测）",
      "有源蜂鸣器 x1 （报警）",
      "0.96 寸 OLED 屏 x1 （显示）",
      "面包板 + 杜邦线 x1 套",
    ],
    steps: [
      "在 Cirkit Designer 里搭 ESP32 + DHT11 + 蜂鸣器电路",
      "导出 BOM，粘贴到 MakerHub 发布",
      "买料（约 ¥60），按接线图连接",
      "刷固件，设置温湿度阈值",
    ],
  },
  {
    id: "obstacle-car",
    icon: "🤖",
    title: "超声波避障小车",
    desc: "三路传感器自动避障，3D 打印车架，可加蓝牙遥控",
    difficulty: "大佬",
    cost: 120,
    duration: "1 天",
    tool: "Schematik",
    bom: [
      "Arduino UNO x1 （主控）",
      "HC-SR04 超声波模块 x3 （避障）",
      "L298N 电机驱动 x1 （驱动）",
      "TT 电机 x4 + 轮子 x4",
      "18650 电池组 x1 （供电）",
      "3D 打印车架 x1 套",
    ],
    steps: [
      "用 Schematik 自然语言描述避障小车需求",
      "拿到接线图 + BOM + 固件代码",
      "买料（约 ¥120），3D 打印车架",
      "组装 + 烧录固件，调试避障逻辑",
    ],
  },
];
