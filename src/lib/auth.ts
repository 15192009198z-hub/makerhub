// 简易登录：cookie 保存用户 id
// 后续可扩展 GitHub OAuth（配 GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET）

import { cookies } from "next/headers";
import { findOrCreateUser, getUserById } from "./db";
import type { User } from "./types";

const COOKIE_NAME = "makerhub_uid";

export async function getCurrentUser(): Promise<User | null> {
  const store = await cookies();
  const uid = store.get(COOKIE_NAME)?.value;
  if (!uid) return null;
  const id = Number(uid);
  if (!Number.isFinite(id)) return null;
  return getUserById(id);
}

export async function loginAs(name: string): Promise<User> {
  const user = await findOrCreateUser(name);
  const store = await cookies();
  store.set(COOKIE_NAME, String(user.id), {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
  return user;
}

export async function logout(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
