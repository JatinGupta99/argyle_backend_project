'use client';

import { useEffect } from 'react';
import { useComments } from './use-comments';
import { useSocket } from './use-socket';

export function useRealTimeComments(messageId: string) {
  const { socket, isConnected } = useSocket();
  const { comments, fetchComments } = useComments(messageId);

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleNewComment = () => {
      fetchComments();
    };

    const handleCommentLiked = () => {
      fetchComments();
    };

    socket.on('comment-created', handleNewComment);
    socket.on('comment-liked', handleCommentLiked);

    return () => {
      socket.off('comment-created', handleNewComment);
      socket.off('comment-liked', handleCommentLiked);
    };
  }, [socket, isConnected, fetchComments]);

  return { comments, isConnected };
}
