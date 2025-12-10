'use client';

import { useEventPosts } from '@/hooks/useEventPosts';
import { UserID } from '@/lib/constants/api';
import { EventPost } from '@/lib/types/api';
import { Loader2, Trash2, Edit2, Plus } from 'lucide-react';
import { useState } from 'react';
import { MessageCard } from './message/MessageCard';
import { ROLEBASED } from '@/hooks/useDailyBase';

export function EventUpdates({
  eventId,
  currentUserId = UserID,
  }: {
  eventId: string;
  currentUserId?: string;
  role: ROLEBASED;
}) {
  const { posts, isLoading, likePost, unlikePost, addComment, createPost, deletePost, updatePost } =
    useEventPosts(eventId);
  const role=ROLEBASED.MODERATOR;
  const [expandedComments, setExpandedComments] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [loadingLikes, setLoadingLikes] = useState<Record<string, boolean>>({});
  const [submittingComments, setSubmittingComments] = useState<Record<string, boolean>>({});
  const [newPostContent, setNewPostContent] = useState('');

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

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;
    await createPost(newPostContent);
    setNewPostContent('');
  };

  const handleDeletePost = async (postId: string) => {
    await deletePost(postId);
  };

  const handleUpdatePost = async (postId: string, updatedContent: string) => {
    await updatePost(postId, updatedContent);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {role === 'moderator' && (
        <div className="p-4 bg-gray-100 border-b flex gap-2 items-center">
          <input
            className="flex-1 p-2 border rounded-md"
            placeholder="Create new post..."
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
          />
          <button
            onClick={handleCreatePost}
            className="bg-primary text-white px-4 py-2 rounded-md flex items-center gap-1"
          >
            <Plus size={16} /> Post
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto bg-gray-50 px-8 pb-6 pt-2 space-y-6 shadow-inner rounded-t-2xl">
        {safePosts.length > 0 ? (
          safePosts
            .slice()
            .reverse()
            .map((post: EventPost) => (
              <div key={post._id} className="relative">
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
                  onCommentSubmit={() => handleCommentSubmit(post._id)}
                  isSubmittingComment={submittingComments[post._id]}
                  isLiking={loadingLikes[post._id]}
                />

                {role === 'moderator' && (
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      onClick={() => handleUpdatePost(post._id, prompt('Update post:', post.content) || post.content)}
                      className="p-1 rounded bg-yellow-200 hover:bg-yellow-300"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeletePost(post._id)}
                      className="p-1 rounded bg-red-200 hover:bg-red-300"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            ))
        ) : (
          <p className="text-center text-gray-500 mt-10">No event updates yet.</p>
        )}
      </div>
    </div>
  );
}
