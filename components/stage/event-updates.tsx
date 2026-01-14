'use client';

import { useAuth } from '@/app/auth/auth-context';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { useEventPosts } from '@/hooks/useEventPosts';
import { UserID } from '@/lib/constants/api';
import { EventPost } from '@/lib/types/api';
import { Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import { SocialInput } from '@/components/shared/SocialInput';
import { MessageCard } from './message/MessageCard';

export function EventUpdates({
  eventId,
  currentUserId = UserID,
  maxWidthClass = 'max-w-[60rem]',
  inputMaxWidthClass = 'max-w-[50rem]',
}: {
  eventId: string;
  currentUserId?: string;
  maxWidthClass?: string;
  inputMaxWidthClass?: string;
}) {
  const { can } = useAuth();
  const { posts, isLoading, likePost, unlikePost, addComment, createPost, deletePost, updatePost } =
    useEventPosts(eventId);

  const [expandedComments, setExpandedComments] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [loadingLikes, setLoadingLikes] = useState<Record<string, boolean>>({});
  const [submittingComments, setSubmittingComments] = useState<Record<string, boolean>>({});
  const [newPostContent, setNewPostContent] = useState('');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  const safePosts = posts || [];

  const handleLike = async (postId: string) => {
    setLoadingLikes((prev) => ({ ...prev, [postId]: true }));
    try {
      await likePost(postId);
    } finally {
      setLoadingLikes((prev) => ({ ...prev, [postId]: false }));
    }
  };

  const handleUnlike = async (postId: string) => {
    setLoadingLikes((prev) => ({ ...prev, [postId]: true }));
    try {
      await unlikePost(postId);
    } finally {
      setLoadingLikes((prev) => ({ ...prev, [postId]: false }));
    }
  };

  const handleCommentSubmit = async (postId: string, content: string) => {
    if (!content?.trim()) return;
    setSubmittingComments((prev) => ({ ...prev, [postId]: true }));
    try {
      await addComment(postId, content);
      setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
    } finally {
      setSubmittingComments((prev) => ({ ...prev, [postId]: false }));
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;
    await createPost(newPostContent);
    setNewPostContent('');
  };

  const handleDeletePost = async (postId: string) => {
    await deletePost(postId);
  };

  const handleUpdatePost = async (postId: string, updatedContent: string) => {
    if (!updatedContent?.trim()) return;
    await updatePost(postId, updatedContent);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <RoleGuard permission="post:create">
        <div className="w-full px-8 md:px-12 py-6 z-10 sticky top-0 bg-background/95 backdrop-blur-md border-b border-border">
          <div className={`${inputMaxWidthClass} mx-auto`}>
            <SocialInput
              value={newPostContent}
              onChange={setNewPostContent}
              onSend={handleCreatePost}
              placeholder="Share an update with attendees..."
              variant="broadcast"
              hideAvatar={false}
              avatarText={currentUserId}
            />
          </div>
        </div>
      </RoleGuard>

      <div className="flex-1 overflow-y-auto px-8 md:px-12 pb-20 custom-scrollbar">
        <div className={`${maxWidthClass} mx-auto space-y-6 pt-6`}>
          {safePosts.length > 0 ? (
            safePosts
              .slice()
              .reverse()
              .map((post: EventPost) => (
                <div key={post._id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <MessageCard
                    post={post}
                    currentUserId={currentUserId}
                    isExpanded={expandedComments === post._id}
                    onToggleExpand={() =>
                      setExpandedComments(expandedComments === post._id ? null : post._id)
                    }
                    commentText={commentInputs[post._id] || ''}
                    onCommentChange={(text) =>
                      setCommentInputs((prev) => ({ ...prev, [post._id]: text }))
                    }
                    onLike={() => handleLike(post._id)}
                    onUnlike={() => handleUnlike(post._id)}
                    onCommentSubmit={() => handleCommentSubmit(post._id, commentInputs[post._id])}
                    isSubmittingComment={submittingComments[post._id]}
                    isLiking={loadingLikes[post._id]}
                    onEdit={can('post:edit') ? () => {
                      const updated = prompt('Update post:', post.content);
                      if (updated) handleUpdatePost(post._id, updated);
                    } : undefined}
                    onDelete={can('post:delete') ? () => {
                      if (confirm('Are you sure you want to delete this post?')) {
                        handleDeletePost(post._id);
                      }
                    } : undefined}
                  />
                </div>
              ))
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-200 mt-4">
              <div className="w-16 h-16 bg-background rounded-2xl flex items-center justify-center mb-4 shadow-sm ring-1 ring-border">
                <Loader2 className="text-sky-500 animate-[spin_3s_linear_infinite]" size={28} />
              </div>
              <h3 className="text-lg font-black text-slate-800 mb-2">Updates Coming Soon</h3>
              <p className="text-slate-500 max-w-sm mx-auto text-sm leading-relaxed">
                The event team hasn't posted any updates yet. <br /> Keep an eye on this feed for announcements!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
