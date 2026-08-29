# MakerHub 设计文档（实物版 GitHub）

- 日期：2026-08-29
- 状态：已与用户确认设计（2026-08-29）
- 项目目录：`~/Desktop/makerhub/`

## 1. 愿景与定位

**一句话**：一个围绕"AI 生成的实物硬件"的开源社区——大家用 AI（Blueprint / Cirkit Designer / Schematik 等实物 vibecoding 工具）做出来的东西，在这里展示作品、分享零件清单（BOM）、一键找到国内购买渠道，并产生交易意向。

**类比**：GitHub 上大家发代码仓库；MakerHub 上大家发实物作品卡片。

**目标用户**：中国创客 / 电子爱好者 / 大学生课设党 / AI 硬件尝鲜者。

**项目发起人双目标**：
1. 练手学技术，重点是**部署上线**全流程（VPS、Docker、Nginx、HTTPS、域名、SEO）。
2. 验证"实物版 GitHub"社区愿景，代码全部开源发布到 GitHub。

## 2. 核心功能（作品卡片）

每个作品 = 一张卡片，字段如下：

| 字段 | 说明 |
|---|---|
| 标题 | 作品名 |
| 描述 | 用什么 AI 工具、怎么实现的 |
| 成品图 | 实物照片/图片（MVP 用外链 URL，后续加本地上传） |
| BOM 零件清单 | 每行：零件名 + 数量 + 备注；可手填 |
| 找料链接 | 由 BOM 每行零件名自动生成淘宝/1688/拼多多搜索跳转链接 |
| 点赞 / 评论 | 社区互动 |
| 交易意向标签 | `求购` / `出二手` / `帮做`；成交一律引导去闲鱼，站内不做支付 |

**页面结构**：
- 首页：作品流（按时间/点赞排序）+ 搜索
- 作品详情页：完整卡片 + 找料链接 + 评论
- 发布页：登录后填写作品卡片
- 关于页：愿景说明 + 开源链接

## 3. 找料引擎（核心差异化功能）

**设计原则：零爬虫、零合规风险、永不过期。**

- BOM 每行零件名 → 三个渠道的搜索 URL 拼接（纯函数，无外部依赖）：

```
淘宝:  https://s.taobao.com/search?q=<URL编码零件名>
1688: https://s.1688.com/selloffer/offer_search.htm?keywords=<URL编码零件名>
拼多多: https://mobile.yangkeduo.com/search_result.html?search_key=<URL编码零件名>
```

- 用户点击即跳转对应平台搜索结果页，自行挑选下单。
- 扩展（后置、M3 之后）：浏览器扩展从 Blueprint/Cirkit 页面一键提取 BOM 导入发布表单。

## 4. 技术架构

### 4.1 应用层

- **Next.js（App Router）**：全栈，一个框架覆盖页面 + API 路由，AI 生成代码成熟度高。
- **SQLite（better-sqlite3）**：单文件数据库，零配置起步，足够社区初期规模。
- **GitHub OAuth 登录**：社区即 GitHub 文化，省去自建账号体系。
- **找料引擎**：独立纯函数模块（`lib/parts.ts`），便于单元测试。

### 4.2 数据模型（初期）

```
User     { id, githubId, name, avatar, bio, createdAt }
Project  { id, userId, title, description, tool, imageUrl, status(求购/出二手/帮做/DIY), likes, createdAt }
BOMItem  { id, projectId, name, qty, note }
Comment  { id, projectId, userId, content, createdAt }
```

### 4.3 部署架构（练手重头戏）

```
Internet → 域名(DNS) → VPS(国外，免备案) → Nginx(反代 + HTTPS)
                                              └→ Docker 容器: Next.js 应用 + SQLite 数据卷
Let's Encrypt 证书自动续期；定时备份 SQLite 文件
```

- **VPS**：Vultr / 搬瓦工 2C1G 起步（国外免备案）。
- **Docker Compose**：应用容器 + 数据卷 + 环境变量。
- **Nginx**：反向代理 + TLS。
- **域名**：用户自购（如 Namecheap / Cloudflare）。
- **SEO**：sitemap.xml + OG 卡片 + 作品页 JSON-LD 结构化数据。

### 4.4 目录结构

```
makerhub/
├── docs/specs/          # 设计文档
├── src/
│   ├── app/             # Next.js 页面与 API 路由
│   ├── components/      # UI 组件
│   └── lib/
│       ├── parts.ts     # 找料引擎（纯函数）
│       └── db.ts        # SQLite 访问
├── docker-compose.yml   # 部署编排
├── nginx.conf           # 反代配置
└── README.md            # 开源介绍 + 愿景
```

## 5. 冷启动策略

1. **种子内容**：发起人用 Blueprint/Cirkit 做 3-5 个低成本真作品（声控灯、温湿度报警器、避障小车），填满 BOM + 找料链接 + 实物图，作为社区首批卡片。
2. **内容即引流**：每个种子作品同步产出小红书/抖音素材——"AI 生成硬件设计 → 国内买料 → 实物出炉"完整链路。
3. **开源传播**：仓库发布到 V2EX / 开源中国 / Hacker News。
4. **早期激励**：前 10 个投稿用户作品给推荐位 + 专属徽章。

## 6. 明确不做（YAGNI）

| 不做 | 原因 |
|---|---|
| 站内交易/支付/售后 | 合规深渊；只做意向标签 + 跳闲鱼 |
| 爬虫聚合比价、实时库存 | 反爬 + 合规风险；只做搜索跳转 |
| 私信/消息系统 | 评论区 + 闲鱼足够 |
| 移动 App | 纯响应式 Web |
| 审核/权限系统 | 初期公开 + 简单举报 |
| 多语言 | 初期只做中文站 |
| 浏览器扩展 | 后置功能（M3 之后再做），不属于 MVP 范围 |

## 7. 里程碑

| 阶段 | 内容 | 交付物 |
|---|---|---|
| M1（1-2 周） | Next.js 骨架 + 作品发布/浏览/详情 + SQLite + 找料引擎 | 本地跑通的全功能站 |
| M2（1 周） | Docker Compose + VPS 部署 + 域名 + HTTPS | 公网可访问，✅ 部署练手核心 |
| M3（1 周） | GitHub OAuth + SEO（sitemap/OG）+ 开源发布 | GitHub 开源仓库 + 可被搜索 |
| M4（持续） | 种子作品 3-5 个 + 小红书/抖音内容同步 | 首批真实内容上线 |

## 8. 成功标准（初期）

- 网站公网可访问，HTTPS 正常，Docker 一键部署可复现。
- 首批 3-5 个种子作品发布，找料链接可用。
- GitHub 开源仓库获得少量 Star 和外部投稿。
- 小红书/抖音内容产生引流。
