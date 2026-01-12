'use client';

import { SocialInput } from '@/components/shared/SocialInput';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DEFAULT_USERNAME } from '@/lib/constants/api';
import { EventPost, User } from '@/lib/types/api';
import { Edit3, MessageCircle, MoreVertical, ThumbsUp, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

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

const DEFAULT_AVATAR = '/attendee-avatar.jpg';

export function MessageCard(props: MessageCardProps) {
  const { post, currentUserId, isExpanded, onToggleExpand, commentText, onCommentChange, onLike, onUnlike, onCommentSubmit, isSubmittingComment = false, onEdit, onDelete } = props;

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

  const liked = post.likes?.some(l =>
    typeof l === 'string' ? l === currentUserId : (l as any)?._id === currentUserId
  ) ?? false;
  const likeCount = post.likes?.length || 0;

  const renderAvatar = (user: User | string) => {
    const username = typeof user === 'string' ? 'U' : user?.username || 'U';
    const avatar = typeof user === 'string' ? DEFAULT_AVATAR : user?.avatar || DEFAULT_AVATAR;

    return (
      <Avatar className="w-8 h-8 rounded-full border-2 border-white shadow-sm ring-1 ring-slate-100">
        <AvatarImage src={avatar} />
        <AvatarFallback className="bg-sky-500 text-white text-[10px] font-black">
          {username.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
    );
  };

  return (
    <div className="group bg-white rounded-[24px] p-6 border border-slate-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.08)] hover:border-sky-100 transition-all duration-300 relative overflow-hidden">
      <div className="flex justify-between items-start mb-5">
        <div className="flex gap-4">
          <div className="pt-1">
            {renderAvatar(post.userId)}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="text-[15px] font-black text-slate-800 tracking-tight leading-none group-hover:text-sky-600 transition-colors">
                {post.userId?.username || DEFAULT_USERNAME}
              </h3>
              {post.userId?.role === 'admin' && ( // Example role badge
                <span className="bg-sky-50 text-sky-600 text-[10px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                  Admin
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 font-bold font-mono tracking-wide">
              {new Date(post.createdAt).toLocaleDateString()} • {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>

        {(onEdit || onDelete) && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-slate-50 rounded-xl transition-all text-slate-300 hover:text-slate-600 opacity-0 group-hover:opacity-100"
            >
              <MoreVertical size={18} />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-slate-100 py-1.5 z-20 animate-in fade-in zoom-in-95 duration-200">
                {onEdit && (
                  <button
                    onClick={() => {
                      onEdit();
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <Edit3 size={15} />
                    Edit Post
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => {
                      onDelete();
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-bold text-rose-500 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 size={15} />
                    Delete Post
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="text-[15px] text-slate-600 leading-relaxed font-medium whitespace-pre-wrap mb-6">
        {post.content}
      </div>

      <div className="flex items-center gap-3 pt-5 border-t border-slate-50">
        <button
          onClick={liked ? onUnlike : onLike}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 group/action ${liked
            ? 'bg-rose-50 text-rose-500'
            : 'hover:bg-slate-50 text-slate-400 hover:text-slate-600'}`}
        >
          <ThumbsUp
            size={16}
            className={`transition-transform duration-300 ${liked ? 'fill-rose-500 scale-110' : 'group-hover/action:scale-110'}`}
          />
          <span className="text-[13px] font-bold">{likeCount > 0 ? likeCount : 'Like'}</span>
        </button>

        <button
          onClick={onToggleExpand}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 group/action ${isExpanded
            ? 'bg-sky-50 text-sky-600'
            : 'hover:bg-slate-50 text-slate-400 hover:text-slate-600'}`}
        >
          <MessageCircle size={17} className="group-hover/action:scale-110 transition-transform duration-300" />
          <span className="text-[13px] font-bold">
            {post.comments.length > 0 ? post.comments.length : 'Comment'}
          </span>
        </button>
      </div>

      {/* Inline Comment Input */}
      <div className="mt-5">
        <SocialInput
          value={commentText}
          onChange={onCommentChange}
          onSend={onCommentSubmit}
          placeholder="Write your Comment..."
          disabled={isSubmittingComment}
          variant="comment"
          hideAvatar={false}
          avatarText="NB"
        />
      </div>

      {/* Expanded Comments List */}
      {isExpanded && post.comments.length > 0 && (
        <div className="mt-6 space-y-4 pt-4 border-t border-slate-50 animate-in slide-in-from-top-4 duration-500">
          {post.comments.map((comment) => (
            <div key={comment._id} className="flex gap-3">
              <div className="pt-1 flex-shrink-0">
                {renderAvatar(comment.userId)}
              </div>
              <div className="flex-1 min-w-0 bg-slate-50/50 rounded-2xl px-4 py-3">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-xs font-bold text-slate-900">
                    {comment.userId?.username || DEFAULT_USERNAME}
                  </p>
                  <span className="text-[10px] text-slate-400">
                    {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-[13px] text-slate-600 font-medium leading-relaxed">
                  {comment.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
