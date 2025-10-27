export interface User {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
}

export interface EventPost {
  _id: string;
  userId: User;
  content: string;
  likes: string[];
  comments: Comment[];
  createdAt: string;
}

export interface Message {
  _id: string;
  userId: User;
  content: string;
  likes: string[];
  comments: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  messageId: string;
  userId: User;
  content: string;
  likes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Like {
  _id: string;
  userId: string;
  targetId: string;
  targetType: 'message' | 'comment';
  createdAt: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
}
