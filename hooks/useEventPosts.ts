import { apiClient } from '@/lib/api-client';
import { API_ROUTES } from '@/lib/api-routes';
import { EventPost } from '@/lib/types/api';
import { useApiRequest } from '@/lib/useApiRequest';

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

  const createPost = async (content: string, userId?: string) => {
    const payload = userId ? { content, userId } : { content };
    const newPost = await apiClient.post(API_ROUTES.events.posts(eventId), payload);
    await refetch();
    return newPost;
  };

  const updatePost = async (postId: string, content: string) => {
    const updated = await apiClient.put(API_ROUTES.posts.postsById(postId), { content });
    await refetch();
    return updated;
  };

  // Delete a post
  const deletePost = async (postId: string) => {
    const deleted = await apiClient.delete(API_ROUTES.posts.postsById(postId));
    await refetch();
    return deleted;
  };

  // Like a post
  const likePost = async (postId: string, userId: string) => {
    await apiClient.post(API_ROUTES.posts.like(postId), { userId });
    await refetch();
  };

  // Unlike a post
  const unlikePost = async (postId: string, userId: string) => {
    await apiClient.delete(API_ROUTES.posts.unlike(postId));
    await refetch();
  };

  // Add a comment to a post
  const addComment = async (postId: string, userId: string, content: string) => {
    await apiClient.post(API_ROUTES.posts.comment(postId), { content, userId });
    await refetch();
  };

  return {
    posts,
    isLoading,
    error,
    refetch,
    createPost,
    updatePost,
    deletePost,
    likePost,
    unlikePost,
    addComment,
  };
}
