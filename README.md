# 🔧 MakerHub · 实物版 GitHub

用 AI 做实物硬件，在这里晒作品、分享零件清单（BOM）、一键找到国内购买渠道。

GitHub 上大家发代码仓库，MakerHub 上大家发实物作品——用 **Blueprint / Cirkit Designer / Schematik** 这些 AI 工具设计出来的硬件，晒出来，买得到。

> 🌐 线上地址：**https://makerhub-eight.vercel.app**
>
> 本项目本身就是一个 vibecoding 产物：全站代码由 AI 生成，从想法到上线不到一天。

## ✨ 核心功能

- **作品卡片**：描述 + 成品图 + 用的 AI 工具 + 交易意向（DIY / 求购 / 出二手 / 帮做）
- **BOM 智能解析**：粘贴零件清单文本，自动解析成结构化表格（支持 `DHT11 ×2`、`10kΩ 电阻 x4（1/4W）` 等常见写法；可选 LLM 增强）
- **一键找料**：每个零件自动生成 **淘宝 / 1688 / 拼多多** 三个渠道的搜索链接
- **社区互动**：点赞、评论
- **交易意向**：求购 / 出二手 / 帮做，成交一律走闲鱼，站内不做支付

## 🚀 快速开始

```bash
pnpm install
pnpm dev        # 打开 http://localhost:3000
```

本地开发零配置：数据库默认用文件 SQLite（自动创建 `makerhub.db`）。

## ☁️ 部署到 Vercel

1. 推送代码到 GitHub 仓库
2. [vercel.com](https://vercel.com) 用 GitHub 登录 → **Import** 该仓库
3. 在 Vercel 项目 Settings → Environment Variables 配置（见 [.env.example](.env.example)）：
   - `TURSO_DATABASE_URL`、`TURSO_AUTH_TOKEN`（[Turso](https://turso.tech) 免费创建，GitHub 一键登录）
   - 可选 `LLM_API_KEY` / `LLM_BASE_URL` / `LLM_MODEL`（增强 BOM 解析，默认 DeepSeek）
4. Deploy，完成 🎉

## 🛠️ 技术栈

| 层 | 选型 | 说明 |
|---|---|---|
| 框架 | Next.js 16 (App Router) + TypeScript + Tailwind CSS 4 | 全栈，AI 生成友好 |
| 数据库 | Turso (libsql) | 本地文件 SQLite ↔ 生产托管 SQLite，同一套代码 |
| 找料引擎 | 纯函数 URL 拼接 | 零爬虫、零合规风险、永不过期 |
| 登录 | Cookie 昵称登录（MVP） | GitHub OAuth 待接入 |

## 📁 结构

```
src/
├── app/               # 页面 + API 路由
│   ├── api/bom/parse  # BOM 解析（规则 + 可选 LLM）
│   ├── api/projects   # 作品列表 / 发布
│   ├── api/login      # 登录 / 登出
│   └── p/[id]         # 作品详情
├── components/        # 导航 / 卡片 / 找料链接 / 点赞 / 评论
└── lib/
    ├── db.ts          # 数据层（libsql）
    ├── parts.ts       # 找料引擎
    ├── bom-parser.ts  # BOM 解析器
    └── auth.ts        # 登录
```

## 🔜 Roadmap

- [ ] GitHub OAuth 登录
- [ ] 浏览器扩展：从 Blueprint / Cirkit 页面一键提取 BOM
- [ ] 图片上传（现在支持外链 URL）
- [ ] 作品分类 / 标签 / 搜索增强
- [ ] VPS + Docker 自托管部署

## 🤝 参与

- 晒你的 AI 硬件作品
- 提 Issue / PR 改进代码
- 帮翻译、帮设计、帮测试

## 📄 License

MIT
