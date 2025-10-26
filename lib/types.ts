export interface User {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
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
