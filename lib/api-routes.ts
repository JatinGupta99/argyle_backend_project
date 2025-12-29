export const API_ROUTES = {
  comments: {
    base: 'comments',
    byMessage: (messageId: string) => `comments/message/${messageId}`,
  },

  events: {
    posts: (eventId: string) => `/events/${eventId}/posts`,
    postById: (eventId: string, postId: string) => `/events/${eventId}/posts/${postId}`,
    like: (eventId: string, postId: string) => `/events/${eventId}/posts/${postId}/like`,
    unlike: (eventId: string, postId: string) => `/events/${eventId}/posts/${postId}/unlike`,
    comment: (eventId: string, postId: string) => `/events/${eventId}/posts/${postId}/comment`,
  },
  chat: {
    history: (eventId: string, query?: Record<string, string>) => {
      const params = query ? `?${new URLSearchParams(query).toString()}` : '';
      return `/chat/${eventId}/history${params}`;
    },
    create: (eventId: string) => `/chat/${eventId}`,
  },
  sponsor: {
    fetchALL: (eventId: string) => `/events/${eventId}/sponsors`,
    fetchById: (eventId: string, sponsorId: string) =>
      `/events/${eventId}/sponsors/${sponsorId}`,
    uploadUrl: (eventId: string, sponsorId: string) =>
      `/events/${eventId}/sponsors/${sponsorId}/upload-url`,
    sendLead: (eventId: string, sponsorId: string) =>
      `/events/${eventId}/sponsors/${sponsorId}/send-lead-email`,
    getSponsorImageReadUrl: (eventId: string, sponsorId: string) =>
      `/events/${eventId}/sponsors/${sponsorId}/image-url`,
  },
  event: {
    fetchById: (eventId: string) => `events/${eventId}`,
    getEventImageUrl: (eventId: string) => `events/${eventId}/image-url`,
  },
};
