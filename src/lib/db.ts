// 数据层：Turso（libsql）连接 + 建表 + 查询
// 本地开发默认用文件 SQLite（file:./makerhub.db），生产配置 TURSO_DATABASE_URL

import { createClient } from "@libsql/client";
import type { BomItem, Comment, DealTag, Project, User } from "./types";

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
