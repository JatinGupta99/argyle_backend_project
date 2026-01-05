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

  const createPost = async (content: string) => {
    const newPost = await apiClient.post(API_ROUTES.events.posts(eventId), { content });
    await refetch();
    return newPost;
  };

  const updatePost = async (postId: string, content: string) => {
    const updated = await apiClient.patch(API_ROUTES.events.postById(eventId, postId), {
      content,
    });
    await refetch();
    return updated;
  };
  const deletePost = async (postId: string) => {
    const deleted = await apiClient.delete(
      API_ROUTES.events.postById(eventId, postId)
    );
    await refetch();
    return deleted;
  };
  const likePost = async (postId: string) => {
    await apiClient.post(API_ROUTES.events.like(eventId, postId), {});
    await refetch();
  };
  const unlikePost = async (postId: string) => {
    await apiClient.delete(API_ROUTES.events.unlike(eventId, postId));
    await refetch();
  };
  const addComment = async (postId: string, content: string) => {
    await apiClient.post(API_ROUTES.events.comment(eventId, postId), {
      content,
    });
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
