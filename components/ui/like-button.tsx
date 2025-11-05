'use client';

import { Heart } from 'lucide-react';
import { useLikes } from '@/hooks/useLikes';

interface LikeButtonProps {
  targetId: string;
  targetType: 'message' | 'comment';
  initialLikes: string[];
  currentUserId: string;
  onLikeChange?: (newLikes: string[]) => void;
}

export default function LikeButton({
  targetId,
  targetType,
  initialLikes,
  currentUserId,
  onLikeChange,
}: LikeButtonProps) {
  const { likes, toggleLike, isLoading } = useLikes(
    targetId,
    targetType,
    initialLikes
  );
  const isLiked = likes.includes(currentUserId);

  const handleClick = async () => {
    await toggleLike(currentUserId);
    onLikeChange?.(likes);
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className="flex items-center gap-1 text-muted hover:text-primary transition-colors disabled:opacity-50"
    >
      <Heart size={16} className={isLiked ? 'fill-primary text-primary' : ''} />
      '<span>Like</span>
      <span className="text-sm">{likes.length}</span>
    </button>
  );
}
