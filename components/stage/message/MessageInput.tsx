'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Smile } from 'lucide-react';
import dynamic from 'next/dynamic';
import emojiData from '@emoji-mart/data';

const Picker = dynamic(() => import('@emoji-mart/react'), { ssr: false });

interface MessageInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function MessageInput({ onSend, disabled = false }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [pickerPosition, setPickerPosition] = useState<'left' | 'right'>(
    'right'
  );

  const pickerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);

  // Send message
  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage('');
      setShowEmojiPicker(false);
    }
  };

  // Handle Enter key
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiSelect = (emoji: any) => {
    setMessage((prev) => prev + emoji.native);
    inputRef.current?.focus();
  };

  // Close picker on outside click + responsive repositioning
  useEffect(() => {
    if (!showEmojiPicker) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node) &&
        toggleRef.current &&
        !toggleRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    const handleResizeOrOpen = () => {
      if (pickerRef.current) {
        const rect = pickerRef.current.getBoundingClientRect();
        const spaceLeft = rect.left;
        if (spaceLeft < 10) {
          setPickerPosition('left');
        } else {
          setPickerPosition('right');
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', handleResizeOrOpen);

    setTimeout(handleResizeOrOpen, 0);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', handleResizeOrOpen);
    };
  }, [showEmojiPicker]);

  return (
    <div className="relative flex items-center bg-white rounded-xl px-3 py-1.5 border border-gray-200 shadow-sm">
      {/* Emoji Picker popup */}
      <div
        ref={pickerRef}
        className={`absolute bottom-full mb-2 z-50 shadow-lg rounded-lg overflow-hidden transition-all duration-200 ease-out transform
    ${pickerPosition === 'right' ? 'origin-right right-0' : 'origin-left left-0'}
    ${showEmojiPicker ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0 pointer-events-none'}
    h-[225px] w-[280px]
  `}
      >
        <div className="overflow-auto h-full w-full">
          <Picker
            data={emojiData}
            onEmojiSelect={handleEmojiSelect}
            theme="light"
            previewPosition="none"
          />
        </div>
      </div>

      <input
        ref={inputRef}
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyPress}
        disabled={disabled}
        className="flex-1 bg-transparent outline-none text-sm text-gray-900 placeholder-gray-500 disabled:opacity-50"
      />
      <div className="flex items-center gap-1 ml-2">
        <button
          ref={toggleRef}
          type="button"
          onClick={() => setShowEmojiPicker((prev) => !prev)}
          aria-label="Add emoji"
          className={`p-1.5 rounded-full transition-colors flex items-center justify-center ${
            showEmojiPicker
              ? 'bg-blue-100 text-blue-500'
              : 'hover:bg-blue-50 text-gray-500 hover:text-blue-500'
          }`}
        >
          <Smile size={18} />
        </button>
        <button
          type="button"
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          aria-label="Send message"
          className="p-1.5 hover:bg-blue-50 rounded-full transition-colors flex items-center justify-center disabled:opacity-50 disabled:hover:bg-transparent"
        >
          <Send
            size={18}
            className={`${
              message.trim() && !disabled ? 'text-blue-500' : 'text-gray-400'
            }`}
          />
        </button>
      </div>
    </div>
  );
}
