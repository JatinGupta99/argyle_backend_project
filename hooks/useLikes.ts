'use client';

import { useState, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';

export function useLikes(
  targetId: string,
  targetType: 'message' | 'comment',
  initialLikes: (string | { _id: string })[] = []
) {
  const [likes, setLikes] = useState<(string | { _id: string })[]>(initialLikes);
  const [isLoading, setIsLoading] = useState(false);

  const toggleLike = useCallback(
    async (userId: string) => {
      setIsLoading(true);
      try {
        const isLiked = likes.some((l) =>
          typeof l === 'string' ? l === userId : (l as any)?._id === userId
        );
        const url = `/${targetType}s/${targetId}/${isLiked ? 'unlike' : 'like'}`;

        if (isLiked) {
          await apiClient.delete(url);
        } else {
          await apiClient.post(url, {});
        }

        const newLikes = isLiked
          ? likes.filter((l) => (typeof l === 'string' ? l !== userId : (l as any)?._id !== userId))
          : [...likes, userId];

        setLikes(newLikes);
        return newLikes;
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
