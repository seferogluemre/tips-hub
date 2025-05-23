export type Tag = {
  id: string;
  name: string;
};

// User related types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  tips?: UserTip[];
  comments?: UserComment[];
  createdAt?: string;
}

export interface UserTip {
  id: string;
  title: string;
  createdAt: string;
}

export interface UserComment {
  id: string;
  content: string;
  createdAt: string;
}

// Tip related types
export interface Tip {
  id: string;
  title: string;
  content: string;
  tags: (Tag | string)[];
  author: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt?: string;
  likes: number;
  comments: number;
}

export interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
  };
  createdAt: string;
}

// API request/response types
export interface GetTipsParams {
  tag?: string;
  tags?: string;
  sort?: "newest" | "popular";
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateTipParams {
  title: string;
  content: string;
  tags: string[];
  authorId?: string;
}

export interface ApiResponse<T> {
  token(arg0: string, token: any): unknown;
  data: T;
  message: string;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    currentPage: number;
    lastPage: number;
    perPage: number;
  };
}

export type TagType =
  | {
      id?: string;
      name?: string;
    }
  | string;
