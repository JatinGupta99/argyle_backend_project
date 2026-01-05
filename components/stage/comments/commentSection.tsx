'use client';

import { useComments } from '@/hooks/useComments';
import { Send } from 'lucide-react';
import { useState } from 'react';
import LikeButton from '../../ui/like-button';

interface CommentSectionProps {
  messageId: string;
  currentUserId: string;
}

export default function CommentSection({
  messageId,
  currentUserId,
}: CommentSectionProps) {
  const { comments, isLoading, createComment } = useComments(messageId);
  const items = comments ?? [];
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      await createComment(newComment);
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-3 space-y-3 border border-border">
      {}
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {isLoading ? (
          <p className="text-sm text-muted">Loading comments...</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-muted">No comments yet</p>
        ) : (
          items.map((comment) => (
            <div key={comment._id} className="bg-gray-50 rounded p-2 text-sm">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-foreground">
                  {comment.userId.username}
                </p>
                <LikeButton
                  targetId={comment._id}
                  targetType="comment"
                  initialLikes={comment.likes}
                  currentUserId={currentUserId}
                />
              </div>
              <p className="text-foreground mt-1">{comment.content}</p>
            </div>
          ))
        )}
      </div>

      {}
      <div className="flex items-center gap-2 bg-gray-50 rounded p-2">
        <input
          type="text"
          placeholder="Write your comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
          disabled={isSubmitting}
          className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder-muted disabled:opacity-50"
        />
        <button
          onClick={handleAddComment}
          disabled={isSubmitting}
          className="text-primary hover:text-primary/80 transition-colors disabled:opacity-50"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
