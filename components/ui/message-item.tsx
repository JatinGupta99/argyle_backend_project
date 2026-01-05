'use client';

import { useState } from 'react';
import { MessageCircle, MoreVertical } from 'lucide-react';
import LikeButton from './like-button';
import CommentSection from '../stage/comments/commentSection';

interface Message {
  _id: string;
  userId: { _id: string; username: string; avatar?: string };
  content: string;
  likes: string[];
  comments: string[];
  createdAt: string;
}

interface MessageItemProps {
  message: Message;
  currentUserId: string;
  onLike?: () => void;
}

export default function MessageItem({
  message,
  currentUserId,
  onLike,
}: MessageItemProps) {
  const [showComments, setShowComments] = useState(false);
  const [messageData, setMessageData] = useState(message);

  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
      {}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
            {message.userId.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-foreground">
              {message.userId.username}
            </p>
            <p className="text-xs text-muted">
              {new Date(message.createdAt).toLocaleTimeString()}
            </p>
          </div>
        </div>
        <MoreVertical size={16} className="text-muted cursor-pointer" />
      </div>

      {}
      <p className="text-foreground">{message.content}</p>

      {}
      <div className="flex items-center gap-4 pt-2">
        <LikeButton
          targetId={message._id}
          targetType="message"
          initialLikes={messageData.likes}
          currentUserId={currentUserId}
          onLikeChange={(newLikes) => {
            setMessageData({ ...messageData, likes: newLikes });
            onLike?.();
          }}
        />
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1 text-muted hover:text-primary transition-colors"
        >
          <MessageCircle size={16} />
          <span className="text-sm">{message.comments.length}</span>
        </button>
      </div>

      {}
      {showComments && (
        <CommentSection messageId={message._id} currentUserId={currentUserId} />
      )}
    </div>
  );
}
