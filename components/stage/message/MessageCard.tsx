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
    <div className="group bg-white rounded-3xl p-5 md:p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-500 relative overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-4">
          {renderAvatar(post.userId)}
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-[15px] font-black text-slate-900 tracking-tight">
                {post.userId?.username || DEFAULT_USERNAME}
              </h3>
            </div>
            <p className="text-[11px] text-slate-400 font-bold font-mono">
              {new Date(post.createdAt).toLocaleDateString()} at {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>

        {(onEdit || onDelete) && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400"
            >
              <MoreVertical size={20} />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-20 animate-in fade-in zoom-in-95 duration-200">
                {onEdit && (
                  <button
                    onClick={() => {
                      onEdit();
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <Edit3 size={16} />
                    Edit Post
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => {
                      onDelete();
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 size={16} />
                    Delete Post
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="text-[15px] text-slate-700 leading-relaxed font-medium whitespace-pre-wrap mb-6 pl-1 border-l-2 border-sky-500/10">
        {post.content}
      </div>

      <div className="flex items-center gap-6 pt-5 border-t border-slate-50/50">
        <button
          onClick={liked ? onUnlike : onLike}
          className={`flex items-center gap-2 transition-all group/action ${liked ? 'text-rose-500' : 'text-slate-400 hover:text-rose-500'}`}
        >
          <ThumbsUp
            size={18}
            className={`transition-all ${liked ? 'fill-rose-500 text-rose-500 scale-110' : 'group-hover/action:scale-110'}`}
          />
          <span className="text-sm font-bold">Like</span>
          {likeCount > 0 && <span className="text-xs font-black">{likeCount}</span>}
        </button>
        <button
          onClick={onToggleExpand}
          className="flex items-center gap-2 text-slate-400 hover:text-sky-500 transition-colors group/action"
        >
          <MessageCircle size={18} className="group-hover/action:scale-110 transition-transform" />
          <span className="text-sm font-bold">Comments</span>
          {post.comments.length > 0 && (
            <span className="text-xs font-black">{post.comments.length}</span>
          )}
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
