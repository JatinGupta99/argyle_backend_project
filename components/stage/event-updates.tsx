'use client';

import { useEventPosts } from '@/hooks/useEventPosts';
import { UserID } from '@/lib/constants/api';
import { EventPost } from '@/lib/types/api';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { MessageCard } from './message/MessageCard';

export function EventUpdates({
  eventId,
  currentUserId = UserID,
}: {
  eventId: string;
  currentUserId?: string;
}) {

  const { posts, isLoading, likePost, unlikePost, addComment } =
    useEventPosts(eventId);

  const [expandedComments, setExpandedComments] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [loadingLikes, setLoadingLikes] = useState<Record<string, boolean>>({});
  const [submittingComments, setSubmittingComments] = useState<
    Record<string, boolean>
  >({});

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  const safePosts = posts ?? [];

  const handleLike = async (postId: string) => {
    setLoadingLikes((prev) => ({ ...prev, [postId]: true }));
    try {
      await likePost(postId, currentUserId);
    } finally {
      setLoadingLikes((prev) => ({ ...prev, [postId]: false }));
    }
  };

  const handleUnlike = async (postId: string) => {
    setLoadingLikes((prev) => ({ ...prev, [postId]: true }));
    try {
      await unlikePost(postId, currentUserId);
    } finally {
      setLoadingLikes((prev) => ({ ...prev, [postId]: false }));
    }
  };

  const handleCommentSubmit = async (postId: string) => {
    if (!commentInputs[postId]?.trim()) return;
    setSubmittingComments((prev) => ({ ...prev, [postId]: true }));
    try {
      await addComment(postId, currentUserId, commentInputs[postId]);
      setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
    } finally {
      setSubmittingComments((prev) => ({ ...prev, [postId]: false }));
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex-1 overflow-y-auto bg-gray-50 px-8 pb-6 pt-2 space-y-6 shadow-inner rounded-t-2xl">
        {safePosts.length > 0 ? (
          safePosts
            .slice()
            .reverse()
            .map((post: EventPost) => (
              <MessageCard
                key={post._id}
                post={post}
                currentUserId={currentUserId}
                isExpanded={expandedComments === post._id}
                onToggleExpand={() =>
                  setExpandedComments(
                    expandedComments === post._id ? null : post._id
                  )
                }
                commentText={commentInputs[post._id] || ''}
                onCommentChange={(text) =>
                  setCommentInputs((prev) => ({ ...prev, [post._id]: text }))
                }
                onLike={() => handleLike(post._id)}
                onUnlike={() => handleUnlike(post._id)}
                onCommentSubmit={() => handleCommentSubmit(post._id)}
                isSubmittingComment={submittingComments[post._id]}
                isLiking={loadingLikes[post._id]}
              />
            ))
        ) : (
          <p className="text-center text-gray-500 mt-10">
            No event updates yet.
          </p>
        )}
      </div>
    </div>
  );
}
