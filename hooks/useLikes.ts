'use client';

import { useState, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';

export function useLikes(
  targetId: string,
  targetType: 'message' | 'comment',
  initialLikes: string[] = []
) {
  const [likes, setLikes] = useState<string[]>(initialLikes);
  const [isLoading, setIsLoading] = useState(false);

  const toggleLike = useCallback(
    async (userId: string) => {
      setIsLoading(true);
      try {
        const isLiked = likes.includes(userId);
        const endpoint = isLiked ? 'unlike' : 'like';
        const url = `/${targetType}s/${targetId}/${endpoint}`;

        await apiClient.post(url, { userId });

        setLikes((prev) =>
          isLiked ? prev.filter((id) => id !== userId) : [...prev, userId]
        );
      } catch (error) {
        console.error('Failed to toggle like:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [targetId, targetType, likes]
  );

  return { likes, toggleLike, isLoading, likeCount: likes.length };
}
