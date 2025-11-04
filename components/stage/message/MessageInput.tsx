'use client';

import type React from 'react';
import { Send } from 'lucide-react';
import { useState } from 'react';
import { GridIcon } from '../grid-icon-message';

interface MessageInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function MessageInput({ onSend, disabled = false }: MessageInputProps) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-center bg-white rounded-xl px-3 py-1.5 border border-gray-200 shadow-sm">
      {/* Input field */}
      <input
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={disabled}
        className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder-gray-500 disabled:opacity-50"
      />

      {/* Action buttons */}
      <div className="flex items-center gap-1 ml-2">
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
