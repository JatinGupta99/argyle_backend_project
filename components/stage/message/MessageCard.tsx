'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Comment } from '@/lib/types/api';
import { Heart, MessageCircle, Send, Loader2, MoreVertical, Trash2, Edit2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface EventPost {
  _id: string;
  userId: {
    _id: string;
    username: string;
    avatar?: string;
  };
  content: string;
  likes: (string | { _id: string })[];
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
  onEdit?: () => void;
  onDelete?: () => void;
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
  onEdit,
  onDelete,
}: MessageCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Robust check for if the user has liked the post
  const liked = post.likes?.some(l =>
    typeof l === 'string' ? l === currentUserId : l?._id === currentUserId
  ) ?? false;

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
    <div className="bg-white rounded-xl p-5 md:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 relative">
        <div className="ring-2 ring-blue-50/50 rounded-full transition-all">
          {renderAvatar(post.userId)}
        </div>
        <div className="flex-1">
          <span className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
            {post.userId?.username || DEFAULT_USERNAME}
          </span>
          <span className="text-[11px] text-gray-400 font-medium block uppercase tracking-wider">
            {new Date(post.createdAt).toLocaleDateString()} • {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        {(onEdit || onDelete) && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-all focus:ring-2 focus:ring-blue-100"
            >
              <MoreVertical size={18} className="text-gray-400 hover:text-gray-600" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="py-1">
                  {onEdit && (
                    <button
                      onClick={() => {
                        onEdit();
                        setShowMenu(false);
                      }}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 w-full text-left transition-colors"
                    >
                      <Edit2 size={15} />
                      <span className="font-medium">Edit Post</span>
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => {
                        onDelete();
                        setShowMenu(false);
                      }}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 w-full text-left transition-colors"
                    >
                      <Trash2 size={15} />
                      <span className="font-medium">Delete Post</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="mb-6">
        <p className="text-gray-700 text-[15px] leading-relaxed whitespace-pre-wrap">{post.content}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-5 pt-4 border-t border-gray-50">
        <button
          onClick={liked ? onUnlike : onLike}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 group ${liked
            ? 'bg-blue-50 text-blue-600 ring-1 ring-blue-100'
            : 'text-gray-500 hover:bg-gray-50'
            }`}
        >
          <div className="relative">
            <Heart
              size={18}
              className={`transition-all duration-300 ${liked ? 'fill-blue-500 text-blue-500 scale-110' : 'group-hover:scale-110'}`}
            />
          </div>
          <span className="text-sm font-semibold">Like</span>
          {likeCount > 0 && <span className="text-[12px] font-bold opacity-80">{likeCount}</span>}
        </button>
        <button
          onClick={onToggleExpand}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 group ${isExpanded
            ? 'bg-gray-100 text-gray-900'
            : 'text-gray-500 hover:bg-gray-50'
            }`}
        >
          <MessageCircle size={18} className="group-hover:scale-110 transition-transform" />
          <span className="text-sm font-semibold">Comments</span>
          {post.comments.length > 0 && (
            <span className="text-[12px] font-bold opacity-80">{post.comments.length}</span>
          )}
        </button>
      </div>

      {/* Comments Section */}
      {isExpanded && (
        <div className="mt-5 space-y-5 animate-in slide-in-from-top-2 duration-300">
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {post.comments.length ? (
              post.comments.map((comment) => (
                <div key={comment._id} className="flex gap-3 group/comment">
                  <div className="pt-1">
                    {renderAvatar(comment.userId)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="bg-gray-50/80 rounded-2xl px-4 py-3 border border-gray-100 group-hover/comment:border-blue-100 transition-all">
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-xs font-bold text-gray-900">
                          {comment.userId?.username || DEFAULT_USERNAME}
                        </p>
                        <span className="text-[10px] text-gray-400 font-medium">
                          {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[13px] text-gray-600 leading-normal break-words">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                <MessageCircle size={24} className="mx-auto text-gray-300 mb-2" />
                <p className="text-sm text-gray-400 font-medium">No comments yet. Start the conversation!</p>
              </div>
            )}
          </div>

          {/* Comment Input */}
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-2xl px-4 py-2 border border-transparent focus-within:border-blue-200 focus-within:bg-white focus-within:shadow-sm transition-all group">
                <input
                  type="text"
                  placeholder="Share your thoughts..."
                  value={commentText}
                  onChange={(e) => onCommentChange(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && onCommentSubmit()}
                  className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400 py-1"
                />
                <button
                  onClick={onCommentSubmit}
                  disabled={!commentText.trim() || isSubmittingComment}
                  className="p-1.5 text-blue-500 hover:text-blue-600 disabled:text-gray-300 transition-all rounded-full hover:bg-blue-50"
                >
                  {isSubmittingComment ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Send size={18} className={commentText.trim() ? 'translate-x-0.5' : ''} />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
