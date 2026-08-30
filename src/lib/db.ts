// 数据层：Turso（libsql）连接 + 建表 + 查询
// 本地开发默认用文件 SQLite（file:./makerhub.db），生产配置 TURSO_DATABASE_URL

import { createClient } from "@libsql/client";
import type { BomItem, Comment, DealTag, Project, User } from "./types";

export interface ProductRow {
  id: number;
  user_id: number;
  title: string;
  desc: string;
  price: number;
  type: string; // 实物 | 设计 | 教程
  image_url: string;
  project_id: number | null;
  xianyu_url: string;
  status: string; // 在售 | 下架
  created_at: string;
  author_name: string;
}

export interface OrderRow {
  id: number;
  product_id: number;
  buyer_id: number;
  contact: string;
  message: string;
  status: string; // 待联系 | 已联系 | 已完成
  created_at: string;
  product_title: string;
  seller_id: number;
  buyer_name: string;
}

export const db = createClient({
  url: process.env.TURSO_DATABASE_URL || "file:./makerhub.db",
  authToken: process.env.TURSO_AUTH_TOKEN || undefined,
});

let initialized = false;

export async function initDb(): Promise<void> {
  if (initialized) return;
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      avatar TEXT DEFAULT '',
      bio TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      tool TEXT DEFAULT '',
      image_url TEXT DEFAULT '',
      deal_tag TEXT DEFAULT 'DIY',
      raw_bom TEXT DEFAULT '',
      likes INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS bom_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      qty TEXT DEFAULT '1',
      note TEXT DEFAULT '',
      sort INTEGER DEFAULT 0,
      FOREIGN KEY (project_id) REFERENCES projects(id)
    )
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (project_id) REFERENCES projects(id)
    )
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      desc TEXT NOT NULL,
      price INTEGER NOT NULL DEFAULT 0,
      type TEXT DEFAULT '实物',
      image_url TEXT DEFAULT '',
      project_id INTEGER,
      status TEXT DEFAULT '在售',
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS collection_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      source TEXT NOT NULL,
      source_id TEXT NOT NULL,
      title_en TEXT DEFAULT '',
      desc_en TEXT DEFAULT '',
      title_zh TEXT DEFAULT '',
      desc_zh TEXT DEFAULT '',
      difficulty TEXT DEFAULT '新手',
      type TEXT DEFAULT '其他',
      url TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now')),
      UNIQUE(source, source_id)
    )
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      item_id INTEGER NOT NULL,
      item_type TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      UNIQUE(user_id, item_id, item_type)
    )
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      buyer_id INTEGER NOT NULL,
      contact TEXT NOT NULL,
      message TEXT DEFAULT '',
      status TEXT DEFAULT '待联系',
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (product_id) REFERENCES products(id),
      FOREIGN KEY (buyer_id) REFERENCES users(id)
    )
  `);
  // 兼容旧表：新增列（已存在则忽略）
  try {
    await db.execute("ALTER TABLE products ADD COLUMN xianyu_url TEXT DEFAULT ''");
  } catch {
    // 列已存在
  }
  try {
    await db.execute("ALTER TABLE collection_items ADD COLUMN image_url TEXT DEFAULT ''");
  } catch {
    // 列已存在
  }
  initialized = true;
}

// ---- 用户 ----

export async function findOrCreateUser(name: string): Promise<User> {
  await initDb();
  const nameClean = name.trim().slice(0, 30);
  const existing = await db.execute({
    sql: "SELECT id, name, avatar, bio FROM users WHERE name = ?",
    args: [nameClean],
  });
  if (existing.rows.length > 0) {
    const r = existing.rows[0];
    return { id: Number(r.id), name: r.name as string, avatar: r.avatar as string, bio: r.bio as string };
  }
  const res = await db.execute({
    sql: "INSERT INTO users (name) VALUES (?) RETURNING id, name, avatar, bio",
    args: [nameClean],
  });
  const r = res.rows[0];
  return { id: Number(r.id), name: r.name as string, avatar: r.avatar as string, bio: r.bio as string };
}

export async function getUserById(id: number): Promise<User | null> {
  await initDb();
  const res = await db.execute({
    sql: "SELECT id, name, avatar, bio FROM users WHERE id = ?",
    args: [id],
  });
  if (res.rows.length === 0) return null;
  const r = res.rows[0];
  return { id: Number(r.id), name: r.name as string, avatar: r.avatar as string, bio: r.bio as string };
}

// ---- 作品 ----

export interface ProjectRow {
  id: number;
  user_id: number;
  title: string;
  description: string;
  tool: string;
  image_url: string;
  deal_tag: string;
  raw_bom: string;
  likes: number;
  created_at: string;
  author_name: string;
}

function mapProject(r: Record<string, unknown>): ProjectRow {
  return {
    id: Number(r.id),
    user_id: Number(r.user_id),
    title: r.title as string,
    description: r.description as string,
    tool: (r.tool as string) || "",
    image_url: (r.image_url as string) || "",
    deal_tag: (r.deal_tag as string) || "DIY",
    raw_bom: (r.raw_bom as string) || "",
    likes: Number(r.likes || 0),
    created_at: (r.created_at as string) || "",
    author_name: (r.author_name as string) || "匿名",
  };
}

export async function listProjects(): Promise<ProjectRow[]> {
  await initDb();
  const res = await db.execute(`
    SELECT p.*, u.name AS author_name
    FROM projects p JOIN users u ON p.user_id = u.id
    ORDER BY p.created_at DESC
  `);
  return res.rows.map((r) => mapProject(r as unknown as Record<string, unknown>));
}

export async function getProject(id: number): Promise<Project | null> {
  await initDb();
  const res = await db.execute({
    sql: `SELECT p.*, u.name AS author_name
          FROM projects p JOIN users u ON p.user_id = u.id
          WHERE p.id = ?`,
    args: [id],
  });
  if (res.rows.length === 0) return null;
  const row = mapProject(res.rows[0] as unknown as Record<string, unknown>);

  const bomRes = await db.execute({
    sql: "SELECT name, qty, note FROM bom_items WHERE project_id = ? ORDER BY sort, id",
    args: [id],
  });
  const bomItems: BomItem[] = bomRes.rows.map((r) => ({
    name: r.name as string,
    qty: (r.qty as string) || "1",
    note: (r.note as string) || "",
  }));

  const cRes = await db.execute({
    sql: `SELECT c.content, c.created_at, u.name AS author_name
          FROM comments c JOIN users u ON c.user_id = u.id
          WHERE c.project_id = ? ORDER BY c.created_at ASC`,
    args: [id],
  });
  const comments: Comment[] = cRes.rows.map((r) => ({
    id: 0,
    content: r.content as string,
    createdAt: (r.created_at as string) || "",
    authorName: (r.author_name as string) || "匿名",
  }));

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    tool: row.tool,
    imageUrl: row.image_url,
    dealTag: row.deal_tag as DealTag,
    likes: row.likes,
    createdAt: row.created_at,
    authorName: row.author_name,
    bomItems,
    comments,
  };
}

export async function createProject(input: {
  userId: number;
  title: string;
  description: string;
  tool: string;
  imageUrl: string;
  dealTag: DealTag;
  rawBom: string;
  bomItems: BomItem[];
}): Promise<number> {
  await initDb();
  const res = await db.execute({
    sql: `INSERT INTO projects (user_id, title, description, tool, image_url, deal_tag, raw_bom)
          VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id`,
    args: [
      input.userId,
      input.title.trim().slice(0, 80),
      input.description.trim().slice(0, 4000),
      input.tool.trim().slice(0, 60),
      input.imageUrl.trim().slice(0, 1000),
      input.dealTag,
      input.rawBom.slice(0, 8000),
    ],
  });
  const projectId = Number(res.rows[0].id);
  for (let i = 0; i < input.bomItems.length; i++) {
    const it = input.bomItems[i];
    if (!it.name) continue;
    await db.execute({
      sql: "INSERT INTO bom_items (project_id, name, qty, note, sort) VALUES (?, ?, ?, ?, ?)",
      args: [projectId, it.name.slice(0, 120), it.qty.slice(0, 20), it.note.slice(0, 200), i],
    });
  }
  return projectId;
}

export async function likeProject(id: number): Promise<number> {
  await initDb();
  const res = await db.execute({
    sql: "UPDATE projects SET likes = likes + 1 WHERE id = ? RETURNING likes",
    args: [id],
  });
  if (res.rows.length === 0) throw new Error("作品不存在");
  return Number(res.rows[0].likes);
}

export async function addComment(
  projectId: number,
  userId: number,
  content: string
): Promise<void> {
  await initDb();
  await db.execute({
    sql: "INSERT INTO comments (project_id, user_id, content) VALUES (?, ?, ?)",
    args: [projectId, userId, content.trim().slice(0, 1000)],
  });
}

// ---- 商品 ----

function mapProduct(r: Record<string, unknown>): ProductRow {
  return {
    id: Number(r.id),
    user_id: Number(r.user_id),
    title: r.title as string,
    desc: r.desc as string,
    price: Number(r.price || 0),
    type: (r.type as string) || "实物",
    image_url: (r.image_url as string) || "",
    project_id: r.project_id ? Number(r.project_id) : null,
    xianyu_url: (r.xianyu_url as string) || "",
    status: (r.status as string) || "在售",
    created_at: (r.created_at as string) || "",
    author_name: (r.author_name as string) || "匿名",
  };
}

export async function listProducts(status = "在售"): Promise<ProductRow[]> {
  await initDb();
  const res = await db.execute({
    sql: `SELECT p.*, u.name AS author_name FROM products p
          JOIN users u ON p.user_id = u.id
          WHERE p.status = ? ORDER BY p.created_at DESC`,
    args: [status],
  });
  return res.rows.map((r) =>
    mapProduct(r as unknown as Record<string, unknown>)
  );
}

export async function getProduct(id: number): Promise<ProductRow | null> {
  await initDb();
  const res = await db.execute({
    sql: `SELECT p.*, u.name AS author_name FROM products p
          JOIN users u ON p.user_id = u.id WHERE p.id = ?`,
    args: [id],
  });
  if (res.rows.length === 0) return null;
  return mapProduct(res.rows[0] as unknown as Record<string, unknown>);
}

export async function createProduct(input: {
  userId: number;
  title: string;
  desc: string;
  price: number;
  type: string;
  imageUrl: string;
  projectId: number | null;
  xianyuUrl: string;
}): Promise<number> {
  await initDb();
  const res = await db.execute({
    sql: `INSERT INTO products (user_id, title, desc, price, type, image_url, project_id, xianyu_url)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING id`,
    args: [
      input.userId,
      input.title.trim().slice(0, 80),
      input.desc.trim().slice(0, 2000),
      Math.max(0, Math.round(input.price)),
      input.type,
      input.imageUrl.trim().slice(0, 3000000),
      input.projectId,
      (input.xianyuUrl || "").trim().slice(0, 500),
    ],
  });
  return Number(res.rows[0].id);
}

export async function setProductStatus(
  id: number,
  userId: number,
  status: string
): Promise<void> {
  await initDb();
  await db.execute({
    sql: "UPDATE products SET status = ? WHERE id = ? AND user_id = ?",
    args: [status, id, userId],
  });
}

export async function listProductsByUser(userId: number): Promise<ProductRow[]> {
  await initDb();
  const res = await db.execute({
    sql: `SELECT p.*, u.name AS author_name FROM products p
          JOIN users u ON p.user_id = u.id
          WHERE p.user_id = ? ORDER BY p.created_at DESC`,
    args: [userId],
  });
  return res.rows.map((r) =>
    mapProduct(r as unknown as Record<string, unknown>)
  );
}

// ---- 意向单 ----

function mapOrder(r: Record<string, unknown>): OrderRow {
  return {
    id: Number(r.id),
    product_id: Number(r.product_id),
    buyer_id: Number(r.buyer_id),
    contact: (r.contact as string) || "",
    message: (r.message as string) || "",
    status: (r.status as string) || "待联系",
    created_at: (r.created_at as string) || "",
    product_title: (r.product_title as string) || "",
    seller_id: Number(r.seller_id || 0),
    buyer_name: (r.buyer_name as string) || "匿名",
  };
}

export async function createOrder(input: {
  productId: number;
  buyerId: number;
  contact: string;
  message: string;
}): Promise<void> {
  await initDb();
  await db.execute({
    sql: "INSERT INTO orders (product_id, buyer_id, contact, message) VALUES (?, ?, ?, ?)",
    args: [
      input.productId,
      input.buyerId,
      input.contact.trim().slice(0, 100),
      input.message.trim().slice(0, 500),
    ],
  });
}

export async function listOrdersForSeller(
  sellerId: number
): Promise<OrderRow[]> {
  await initDb();
  const res = await db.execute({
    sql: `SELECT o.*, p.title AS product_title, p.user_id AS seller_id, u.name AS buyer_name
          FROM orders o JOIN products p ON o.product_id = p.id
          JOIN users u ON o.buyer_id = u.id
          WHERE p.user_id = ? ORDER BY o.created_at DESC`,
    args: [sellerId],
  });
  return res.rows.map((r) => mapOrder(r as unknown as Record<string, unknown>));
}

export async function listOrdersForBuyer(buyerId: number): Promise<OrderRow[]> {
  await initDb();
  const res = await db.execute({
    sql: `SELECT o.*, p.title AS product_title, p.user_id AS seller_id, u.name AS buyer_name
          FROM orders o JOIN products p ON o.product_id = p.id
          JOIN users u ON o.buyer_id = u.id
          WHERE o.buyer_id = ? ORDER BY o.created_at DESC`,
    args: [buyerId],
  });
  return res.rows.map((r) => mapOrder(r as unknown as Record<string, unknown>));
}

export async function setOrderStatus(
  id: number,
  sellerId: number,
  status: string
): Promise<void> {
  await initDb();
  await db.execute({
    sql: `UPDATE orders SET status = ? WHERE id = ? AND product_id IN
          (SELECT id FROM products WHERE user_id = ?)`,
    args: [status, id, sellerId],
  });
}

// ---- 用户资料 ----

export async function updateUserProfile(
  userId: number,
  bio: string
): Promise<void> {
  await initDb();
  await db.execute({
    sql: "UPDATE users SET bio = ? WHERE id = ?",
    args: [bio.trim().slice(0, 200), userId],
  });
}

export async function getUserByName(name: string): Promise<User | null> {
  await initDb();
  const res = await db.execute({
    sql: "SELECT id, name, avatar, bio FROM users WHERE name = ?",
    args: [name],
  });
  if (res.rows.length === 0) return null;
  const r = res.rows[0];
  return {
    id: Number(r.id),
    name: r.name as string,
    avatar: (r.avatar as string) || "",
    bio: (r.bio as string) || "",
  };
}

export async function listProjectsByUser(userId: number): Promise<ProjectRow[]> {
  await initDb();
  const res = await db.execute({
    sql: `SELECT p.*, u.name AS author_name FROM projects p
          JOIN users u ON p.user_id = u.id
          WHERE p.user_id = ? ORDER BY p.created_at DESC`,
    args: [userId],
  });
  return res.rows.map((r) =>
    mapProject(r as unknown as Record<string, unknown>)
  );
}

// ---- 管理后台 ----

export interface AdminRecentRow {
  kind: string;
  id: number;
  title: string;
  author: string;
  created_at: string;
  extra: number;
}

export async function getAdminStats(): Promise<{
  users: number;
  projects: number;
  products: number;
  orders: number;
  recent: AdminRecentRow[];
}> {
  await initDb();
  const [users, projects, products, orders] = await Promise.all([
    db.execute("SELECT COUNT(*) AS c FROM users"),
    db.execute("SELECT COUNT(*) AS c FROM projects"),
    db.execute("SELECT COUNT(*) AS c FROM products"),
    db.execute("SELECT COUNT(*) AS c FROM orders"),
  ]);
  const [projRows, prodRows, orderRows] = await Promise.all([
    db.execute(
      `SELECT p.id, p.title, u.name AS author, p.created_at, p.likes AS extra
       FROM projects p JOIN users u ON p.user_id = u.id ORDER BY p.created_at DESC LIMIT 10`
    ),
    db.execute(
      `SELECT p.id, p.title, u.name AS author, p.created_at, p.price AS extra
       FROM products p JOIN users u ON p.user_id = u.id ORDER BY p.created_at DESC LIMIT 10`
    ),
    db.execute(
      `SELECT o.id, pr.title, u.name AS author, o.created_at, 0 AS extra
       FROM orders o JOIN products pr ON o.product_id = pr.id
       JOIN users u ON o.buyer_id = u.id ORDER BY o.created_at DESC LIMIT 10`
    ),
  ]);
  const toRow = (kind: string) => (r: Record<string, unknown>): AdminRecentRow => ({
    kind,
    id: Number(r.id),
    title: String(r.title),
    author: String(r.author),
    created_at: String(r.created_at),
    extra: Number(r.extra || 0),
  });
  const recent = [
    ...projRows.rows.map(toRow("project")),
    ...prodRows.rows.map(toRow("product")),
    ...orderRows.rows.map(toRow("order")),
  ]
    .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
    .slice(0, 30);
  return {
    users: Number(users.rows[0].c),
    projects: Number(projects.rows[0].c),
    products: Number(products.rows[0].c),
    orders: Number(orders.rows[0].c),
    recent,
  };
}

// ---- 聚合集合 ----

export interface CollectionRow {
  id: number;
  source: string;
  source_id: string;
  title_en: string;
  desc_en: string;
  title_zh: string;
  desc_zh: string;
  difficulty: string;
  type: string;
  url: string;
  image_url: string;
  created_at: string;
}

function mapCollection(r: Record<string, unknown>): CollectionRow {
  return {
    id: Number(r.id),
    source: (r.source as string) || "",
    source_id: (r.source_id as string) || "",
    title_en: (r.title_en as string) || "",
    desc_en: (r.desc_en as string) || "",
    title_zh: (r.title_zh as string) || "",
    desc_zh: (r.desc_zh as string) || "",
    difficulty: (r.difficulty as string) || "新手",
    type: (r.type as string) || "其他",
    url: (r.url as string) || "",
    image_url: (r.image_url as string) || "",
    created_at: (r.created_at as string) || "",
  };
}

export async function listCollection(limit = 100): Promise<CollectionRow[]> {
  await initDb();
  const res = await db.execute({
    sql: "SELECT * FROM collection_items ORDER BY created_at DESC LIMIT ?",
    args: [limit],
  });
  return res.rows.map((r) =>
    mapCollection(r as unknown as Record<string, unknown>)
  );
}

export async function collectionExists(
  source: string,
  sourceId: string
): Promise<boolean> {
  await initDb();
  const res = await db.execute({
    sql: "SELECT 1 FROM collection_items WHERE source = ? AND source_id = ?",
    args: [source, sourceId],
  });
  return res.rows.length > 0;
}

export async function insertCollection(input: {
  source: string;
  sourceId: string;
  titleEn: string;
  descEn: string;
  titleZh: string;
  descZh: string;
  difficulty: string;
  type: string;
  url: string;
}): Promise<void> {
  await initDb();
  await db.execute({
    sql: `INSERT INTO collection_items
          (source, source_id, title_en, desc_en, title_zh, desc_zh, difficulty, type, url)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      input.source,
      input.sourceId,
      input.titleEn.slice(0, 200),
      input.descEn.slice(0, 2000),
      input.titleZh.slice(0, 200),
      input.descZh.slice(0, 2000),
      input.difficulty,
      input.type,
      input.url.slice(0, 500),
    ],
  });
}

// ---- 收藏 ----

export async function addFavorite(
  userId: number,
  itemId: number,
  itemType: string
): Promise<void> {
  await initDb();
  await db.execute({
    sql: "INSERT OR IGNORE INTO favorites (user_id, item_id, item_type) VALUES (?, ?, ?)",
    args: [userId, itemId, itemType],
  });
}

export async function removeFavorite(
  userId: number,
  itemId: number,
  itemType: string
): Promise<void> {
  await initDb();
  await db.execute({
    sql: "DELETE FROM favorites WHERE user_id = ? AND item_id = ? AND item_type = ?",
    args: [userId, itemId, itemType],
  });
}

export async function listFavorites(userId: number): Promise<
  { itemId: number; itemType: string; createdAt: string }[]
> {
  await initDb();
  const res = await db.execute({
    sql: "SELECT item_id, item_type, created_at FROM favorites WHERE user_id = ? ORDER BY created_at DESC",
    args: [userId],
  });
  return res.rows.map((r) => ({
    itemId: Number(r.item_id),
    itemType: r.item_type as string,
    createdAt: (r.created_at as string) || "",
  }));
}

export async function favoriteIds(
  userId: number,
  itemType: string
): Promise<number[]> {
  await initDb();
  const res = await db.execute({
    sql: "SELECT item_id FROM favorites WHERE user_id = ? AND item_type = ?",
    args: [userId, itemType],
  });
  return res.rows.map((r) => Number(r.item_id));
}

export async function updateCollectionImage(
  id: number,
  imageUrl: string
): Promise<void> {
  await initDb();
  await db.execute({
    sql: "UPDATE collection_items SET image_url = ? WHERE id = ?",
    args: [imageUrl.slice(0, 2000), id],
  });
}

export async function listCollectionNoImage(
  limit = 30
): Promise<CollectionRow[]> {
  await initDb();
  const res = await db.execute({
    sql: "SELECT * FROM collection_items WHERE image_url = '' ORDER BY id DESC LIMIT ?",
    args: [limit],
  });
  return res.rows.map((r) =>
    mapCollection(r as unknown as Record<string, unknown>)
  );
}
