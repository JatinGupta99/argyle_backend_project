'use client';
import { apiClient } from '@/lib/api-client';
import { useState, useEffect, useCallback } from 'react';

interface Comment {
  _id: string;
  userId: { _id: string; username: string; avatar?: string };
  content: string;
  likes: string[];
  createdAt: string;
}

export function useComments(messageId: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    if (!messageId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiClient.get(`/comments/message/${messageId}`);
      setComments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch comments');
    } finally {
      setIsLoading(false);
    }
  }, [messageId]);

  const createComment = useCallback(
    async (userId: string, content: string) => {
      if (!content.trim()) return;
      try {
        const newComment = await apiClient.post('/comments', {
          messageId,
          userId,
          content,
        });
        setComments((prev) => [newComment, ...prev]);
        return newComment;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to create comment'
        );
        throw err;
      }
    },
    [messageId]
  );

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return { comments, isLoading, error, fetchComments, createComment };
}
