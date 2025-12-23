'use client';

import { useEventPosts } from '@/hooks/useEventPosts';
import { UserID } from '@/lib/constants/api';
import { EventPost } from '@/lib/types/api';
import { Loader2, Plus } from 'lucide-react';
import { useState } from 'react';
import { MessageCard } from './message/MessageCard';

export function EventUpdates({
  eventId,
  currentUserId = UserID,
  role,
}: {
  eventId: string;
  currentUserId?: string;
  role: string;
}) {
  const { posts, isLoading, likePost, unlikePost, addComment, createPost, deletePost, updatePost } =
    useEventPosts(eventId);

  const isModerator = role?.toLowerCase() === 'moderator';
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

  const safePosts = Array.isArray(posts) ? posts : [];

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
    <div className="flex flex-col h-full bg-[#FCFDFF]">
      {isModerator && (
        <div className="p-2 bg-white border-b border-gray-100 shadow-sm z-10">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-2 h-6 bg-blue-600 rounded-full" />
              Post
            </h2>
            <div className="relative group">
              <textarea
                className="w-full p-2 pr-2 border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none resize-none min-h-[100px] text-[15px] placeholder-gray-400"
                placeholder="What's happening in the event?"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
              />
              <button
                onClick={handleCreatePost}
                disabled={!newPostContent.trim()}
                className="absolute right-3 bottom-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 text-white p-2.5 rounded-xl transition-all shadow-lg shadow-blue-200 disabled:shadow-none transform active:scale-95 group-hover:translate-y-[-2px]"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-10 pt-6">
        <div className="max-w-3xl mx-auto space-y-8">
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
                    onEdit={isModerator ? () => {
                      const updated = prompt('Update post:', post.content);
                      if (updated) handleUpdatePost(post._id, updated);
                    } : undefined}
                    onDelete={isModerator ? () => {
                      if (confirm('Are you sure you want to delete this post?')) {
                        handleDeletePost(post._id);
                      }
                    } : undefined}
                  />
                </div>
              ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4 border border-blue-100/50">
                <Loader2 className="text-blue-200" size={40} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Stay tuned!</h3>
              <p className="text-gray-400 max-w-xs mx-auto">No event updates have been posted yet. They will appear here once available.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
