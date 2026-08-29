// 管理员校验：环境变量 ADMIN_NAMES 逗号分隔的用户名白名单
import type { User } from "./types";

export function isAdmin(user: User | null): boolean {
  if (!user) return false;
  const admins = (process.env.ADMIN_NAMES || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return admins.includes(user.name);
}
