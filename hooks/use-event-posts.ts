'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/../../lib/api-client';

export interface User {
  _id: string;
  username: string;
  avatar?: string;
}

export interface Comment {
  _id: string;
  userId: User;
  content: string;
  createdAt: string;
}

export interface EventPost {
  _id: string;
  userId: User;
  content: string;
  likes: string[];
  comments: Comment[];
  createdAt: string;
}

const HARD_CODED_EVENT_ID = '68ebe2a64674fa429419ba7d';

export function useEventPosts() {
  const [posts, setPosts] = useState<EventPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all posts
  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiClient.get(`/events/${HARD_CODED_EVENT_ID}/posts`);

      // Normalize posts to ensure likes/comments are arrays
      const normalizedPosts = data.map((post: any) => ({
        ...post,
        likes: Array.isArray(post.likes) ? post.likes : [],
        comments: Array.isArray(post.comments) ? post.comments : [],
      }));

      setPosts(normalizedPosts);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Failed to fetch posts');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create a new post
  const createPost = useCallback(async (userId: string, content: string) => {
    try {
      const payload = { content, userId };
      const newPost = await apiClient.post(
        `/events/${HARD_CODED_EVENT_ID}/posts`,
        payload
      );

      // Ensure likes/comments are arrays
      const normalizedPost = {
        ...newPost,
        likes: Array.isArray(newPost.likes) ? newPost.likes : [],
        comments: Array.isArray(newPost.comments) ? newPost.comments : [],
      };

      setPosts((prev) => [normalizedPost, ...prev]);
      return normalizedPost;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }, []);

  // Like a post
  const likePost = useCallback(async (postId: string, userId: string) => {
    try {
      await apiClient.post(`/posts/${postId}/like`, {});
      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId
            ? { ...post, likes: [...(post.likes || []), userId] }
            : post
        )
      );
    } catch (err) {
      console.error(err);
      throw err;
    }
  }, []);

  // Unlike a post
  const unlikePost = useCallback(async (postId: string, userId: string) => {
    try {
      await apiClient.delete(`/posts/${postId}/unlike`);
      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId
            ? {
                ...post,
                likes: (post.likes || []).filter((id) => id !== userId),
              }
            : post
        )
      );
    } catch (err) {
      console.error(err);
      throw err;
    }
  }, []);

  // Add a comment
  const addComment = useCallback(
    async (postId: string, userId: string, content: string) => {
      try {
        const payload = { content };
        const newComment = await apiClient.post(
          `/posts/${postId}/comment`,
          payload
        );
        setPosts((prev) =>
          prev.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  comments: [
                    ...(post.comments || []),
                    { ...newComment, userId },
                  ],
                }
              : post
          )
        );
        return newComment;
      } catch (err) {
        console.error(err);
        throw err;
      }
    },
    []
  );

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return {
    posts,
    isLoading,
    error,
    fetchPosts,
    createPost,
    likePost,
    unlikePost,
    addComment,
  };
}
