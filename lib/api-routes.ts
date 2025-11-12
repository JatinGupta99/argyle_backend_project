import { EventId } from './constants/api';

export const API_ROUTES = {
  comments: {
    base: 'comments',
    byMessage: (messageId: string) => `comments/message/${messageId}`,
  },
  events: {
    posts: (eventId: string) => `/events/${eventId}/posts`,
  },
  posts: {
    like: (postId: string) => `/posts/${postId}/like`,
    unlike: (postId: string) => `/posts/${postId}/unlike`,
    comment: (postId: string) => `/posts/${postId}/comment`,
  },
  chat: {
    history: (eventId: string, query?: Record<string, string>) => {
      const params = query ? `?${new URLSearchParams(query).toString()}` : '';
      return `/chat/${eventId}/history${params}`;
    },
    create: (eventId: string) => `/chat/${EventId}`,
  },
  sponsor: {
    fetchALL: (eventId: string) => `/events/${eventId}/sponsors`,
    fetchById: (eventId: string, sponsorId: string) =>
      `/events/${eventId}/sponsors/${sponsorId}`,
    uploadUrl: (eventId: string, sponsorId: string) =>
      `/events/${eventId}/sponsors/${sponsorId}/upload-url`,
  },
};
