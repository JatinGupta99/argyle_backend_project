import { apiClient } from '@/lib/api-client';
import { useApiRequest } from '@/lib/useApiRequest';
import { API_ROUTES } from '@/lib/api-routes';
import { Comment } from '@/lib/types/api';

export function useComments(messageId: string) {
    const {
        data: comments,
        isLoading,
        error,
        refetch,
    } = useApiRequest<Comment[]>(
        () => apiClient.get(API_ROUTES.comments.byMessage(messageId)),
        [messageId]
    );

    const createComment = async (content: string) => {
        if (!content.trim()) return;
        await apiClient.post(API_ROUTES.comments.base, {
            messageId,
            content,
        });
        return refetch();
    };

    return { comments, isLoading, error, fetchComments: refetch, createComment };
}
