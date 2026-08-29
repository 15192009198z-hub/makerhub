// MakerHub 共享类型

export type DealTag = "DIY" | "求购" | "出二手" | "帮做";

export const DEAL_TAGS: DealTag[] = ["DIY", "求购", "出二手", "帮做"];

export interface BomItem {
  name: string;
  qty: string;
  note: string;
}

export interface PartLink {
  channel: string;
  name: string;
  url: string;
}

export interface User {
  id: number;
  name: string;
  avatar: string;
  bio: string;
}

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  authorName: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  tool: string;
  imageUrl: string;
  dealTag: DealTag;
  likes: number;
  createdAt: string;
  authorName: string;
  bomItems: BomItem[];
  comments: Comment[];
}
