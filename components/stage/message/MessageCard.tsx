'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Comment } from '@/lib/types/api';
import { Heart, MessageCircle, Send, Loader2 } from 'lucide-react';

interface EventPost {
  _id: string;
  userId: {
    _id: string;
    username: string;
    avatar?: string;
  };
  content: string;
  likes: string[];
  comments: Comment[];
  createdAt: string;
}

interface MessageCardProps {
  post: EventPost;
  currentUserId: string;
  isExpanded: boolean;
  onToggleExpand: () => void;
  commentText: string;
  onCommentChange: (text: string) => void;
  onLike: () => void;
  onUnlike: () => void;
  onCommentSubmit: () => void;
  isSubmittingComment?: boolean;
  isLiking?: boolean;
}

const DEFAULT_USERNAME = 'Jatin';
const DEFAULT_AVATAR = '/attendee-avatar.jpg';

export function MessageCard({
  post,
  currentUserId,
  isExpanded,
  onToggleExpand,
  commentText,
  onCommentChange,
  onLike,
  onUnlike,
  onCommentSubmit,
  isSubmittingComment = false,
  isLiking = false,
}: MessageCardProps) {
  const liked = post.likes?.includes(currentUserId) ?? false;
  const likeCount = post.likes?.length ?? 0;

  const renderAvatar = (user?: any, fallback?: string) => {
    const username = user?.username || DEFAULT_USERNAME;
    const avatarSrc = user?.avatar || DEFAULT_AVATAR;
    return (
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarImage src={avatarSrc} alt={username} />
        <AvatarFallback className="text-xs">
          {fallback || username.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
    );
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        {renderAvatar(post.userId)}
        <div className="flex-1">
          <span className="font-semibold text-foreground">
            {post.userId?.username || DEFAULT_USERNAME}
          </span>
          <span className="text-xs text-gray-500 block">
            {new Date(post.createdAt).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Content */}
      <p className="text-gray-700 mb-4 leading-relaxed">{post.content}</p>

      {/* Actions */}
      <div className="flex items-center gap-6 pt-4 border-t border-gray-200">
        <button
          onClick={liked ? onUnlike : onLike}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors"
        >
          <Heart
            size={18}
            className={liked ? 'fill-blue-500 text-blue-500' : ''}
          />
          <span>Like</span>
          <span className="text-sm">{likeCount || 0}</span>
        </button>
        <button
          onClick={onToggleExpand}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors"
        >
          <MessageCircle size={18} />
          <span>Comments</span>
          <span className="text-sm">{post.comments.length || 0}</span>
        </button>
      </div>

      {/* Comments Section */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
          {post.comments.length ? (
            post.comments.map((comment) => (
              <div key={comment._id} className="flex gap-3">
                {renderAvatar(comment.userId)}
                <div className="flex-1 min-w-0">
                  <div className="bg-gray-100 rounded-lg px-3 py-2">
                    <p className="text-xs font-semibold text-gray-900">
                      {comment.userId?.username || DEFAULT_USERNAME}
                    </p>
                    <p className="text-sm text-gray-700 break-words">
                      {comment.content}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 mt-1 block">
                    {new Date(comment.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              No comments yet
            </p>
          )}

          {/* Comment Input */}
          <div className="flex items-center gap-3 pt-2">
            {renderAvatar({
              username: DEFAULT_USERNAME,
              avatar: DEFAULT_AVATAR,
            })}
            <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
              <input
                type="text"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => onCommentChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onCommentSubmit()}
                className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder-gray-500"
              />
              <button
                onClick={onCommentSubmit}
                disabled={!commentText.trim() || isSubmittingComment}
                className="text-blue-500 hover:text-blue-600 disabled:text-gray-300 transition-colors"
              >
                {isSubmittingComment ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Send size={18} />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
