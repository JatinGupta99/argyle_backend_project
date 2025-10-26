'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { useEventPosts, EventPost } from '@/hooks/use-event-posts';
import { MessageCard } from './MessageCard';

export function EventUpdates({
  currentUserId = '68e630972af1374ec4c36630',
}: {
  currentUserId?: string;
}) {
  const { posts, isLoading, likePost, unlikePost, addComment } =
    useEventPosts();
  const [expandedComments, setExpandedComments] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>(
    {}
  );
  const [loadingLikes, setLoadingLikes] = useState<Record<string, boolean>>({});
  const [submittingComments, setSubmittingComments] = useState<
    Record<string, boolean>
  >({});
  const userId = '68e630972af1374ec4c36630';
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  const handleLike = async (postId: string) => {
    setLoadingLikes((prev) => ({ ...prev, [postId]: true }));
    try {
      const data = await likePost(postId, userId);
      console.log(data, 'snvsdvlnsdlvsdvlnd');
      return data;
    } finally {
      setLoadingLikes((prev) => ({ ...prev, [postId]: false }));
    }
  };

  const handleUnlike = async (postId: string) => {
    setLoadingLikes((prev) => ({ ...prev, [postId]: true }));
    try {
      await unlikePost(postId, userId);
    } finally {
      setLoadingLikes((prev) => ({ ...prev, [postId]: false }));
    }
  };

  const handleCommentSubmit = async (postId: string) => {
    if (!commentInputs[postId]?.trim()) return;
    setSubmittingComments((prev) => ({ ...prev, [postId]: true }));
    try {
      await addComment(postId, userId, commentInputs[postId]);
      setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
    } finally {
      setSubmittingComments((prev) => ({ ...prev, [postId]: false }));
    }
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      <div className="relative w-[700px] h-56 sm:h-64 rounded-xl overflow-hidden mx-auto mt-3">
        <Image
          src="images/virtual_event.webp"
          alt="Event Banner"
          fill
          priority
          className="object-cover"
        />
      </div>

      <div className="px-6 pt-6 pb-4">
        <h1 className="text-3xl sm:text-2xl font-bold text-foreground tracking-wide mt-0">
          Event Updates
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-50 px-6 pb-6 pt-2 space-y-6 shadow-inner rounded-t-2xl">
        {posts.length ? (
          posts
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
