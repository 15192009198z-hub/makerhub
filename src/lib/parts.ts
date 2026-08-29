// 找料引擎：BOM 零件名 → 国内三大渠道搜索链接
// 设计原则：纯 URL 拼接，零爬虫、零合规风险、永不过期。

export interface Channel {
  id: string;
  name: string;
  url: (keyword: string) => string;
}

export const CHANNELS: Channel[] = [
  {
    id: "taobao",
    name: "淘宝",
    url: (kw) => `https://s.taobao.com/search?q=${encodeURIComponent(kw)}`,
  },
  {
    id: "1688",
    name: "1688",
    url: (kw) =>
      `https://s.1688.com/selloffer/offer_search.htm?keywords=${encodeURIComponent(kw)}`,
  },
  {
    id: "pdd",
    name: "拼多多",
    url: (kw) =>
      `https://mobile.yangkeduo.com/search_result.html?search_key=${encodeURIComponent(kw)}`,
  },
];

export function buildPartLinks(keyword: string) {
  return CHANNELS.map((c) => ({
    channel: c.id,
    name: c.name,
    url: c.url(keyword),
  }));
}
