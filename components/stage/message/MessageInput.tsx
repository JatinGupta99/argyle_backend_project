'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Smile } from 'lucide-react';
import dynamic from 'next/dynamic';
import emojiData from '@emoji-mart/data';
import { MessageInputProps } from '@/lib/types/components';

const Picker = dynamic(() => import('@emoji-mart/react'), { ssr: false });

export function MessageInput({ onSend, disabled = false }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [pickerPosition, setPickerPosition] = useState<'left' | 'right'>(
    'right'
  );

  const pickerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);

  const handleSend = useCallback(() => {
    const trimmed = message.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setMessage('');
    setShowEmojiPicker(false);
  }, [message, disabled, onSend]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const handleEmojiSelect = useCallback((emoji: any) => {
    setMessage((prev) => prev + emoji.native);
    inputRef.current?.focus();
  }, []);

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

    const adjustPickerPosition = () => {
      if (pickerRef.current) {
        const rect = pickerRef.current.getBoundingClientRect();
        setPickerPosition(rect.left < 10 ? 'left' : 'right');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', adjustPickerPosition);
    adjustPickerPosition();

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', adjustPickerPosition);
    };
  }, [showEmojiPicker]);

  return (
    <div
      className="relative flex items-center bg-white rounded-xl px-3 py-1.5 border border-gray-200 shadow-sm focus-within:ring-1 focus-within:ring-blue-400 transition-shadow"
      role="form"
      aria-label="Message input form"
    >
      <div
        ref={pickerRef}
        className={`absolute bottom-full mb-2 z-50 shadow-lg rounded-lg overflow-hidden transform transition-all duration-200 ease-out
          ${pickerPosition === 'right' ? 'origin-right right-0' : 'origin-left left-0'}
          ${showEmojiPicker ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}
          h-[225px] w-[280px] bg-white`}
      >
        {showEmojiPicker && (
          <div className="overflow-auto h-full w-full">
            <Picker
              data={emojiData}
              onEmojiSelect={handleEmojiSelect}
              theme="light"
              previewPosition="none"
            />
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyPress}
        disabled={disabled}
        aria-disabled={disabled}
        aria-label="Message input"
        className="flex-1 bg-transparent outline-none text-sm text-gray-900 placeholder-gray-500 disabled:opacity-50"
      />

      <div className="flex items-center gap-1 ml-0">
        <button
          ref={toggleRef}
          type="button"
          onClick={() => setShowEmojiPicker((prev) => !prev)}
          aria-label="Toggle emoji picker"
          className={`p-1.5 rounded-full flex items-center justify-center transition-colors ${
            showEmojiPicker
              ? 'bg-blue-100 text-blue-600'
              : 'text-gray-500 hover:text-blue-500 hover:bg-blue-50'
          }`}
        >
          <Smile size={18} />
        </button>

        <button
          type="button"
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          aria-label="Send message"
          className="p-1.5 rounded-full flex items-center justify-center transition-colors hover:bg-blue-50 disabled:opacity-50 disabled:hover:bg-transparent"
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
