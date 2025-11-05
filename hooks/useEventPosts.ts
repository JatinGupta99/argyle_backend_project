import { apiClient } from '@/lib/api-client';
import { useApiRequest } from '@/lib/useApiRequest';
import { API_ROUTES } from '@/lib/api-routes';
import { EventPost } from '@/lib/types/api';

export function useEventPosts(eventId: string) {
  const {
    data: posts,
    isLoading,
    error,
    refetch,
  } = useApiRequest<EventPost[]>(
    () => apiClient.get(API_ROUTES.events.posts(eventId)),
    [eventId]
  );

  const createPost = async (userId: string, content: string) => {
    const newPost = await apiClient.post(API_ROUTES.events.posts(eventId), {
      userId,
      content,
    });
    await refetch();
    return newPost;
  };

  const likePost = async (postId: string, userId: string) => {
    await apiClient.post(API_ROUTES.posts.like(postId), { userId });
    await refetch();
  };

  const unlikePost = async (postId: string, userId: string) => {
    await apiClient.delete(API_ROUTES.posts.unlike(postId));
    await refetch();
  };

  const addComment = async (
    postId: string,
    userId: string,
    content: string
  ) => {
    await apiClient.post(API_ROUTES.posts.comment(postId), { content, userId });
    await refetch();
  };

  return {
    posts,
    isLoading,
    error,
    refetch,
    createPost,
    likePost,
    unlikePost,
    addComment,
  };
}
