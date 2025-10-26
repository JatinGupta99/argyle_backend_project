'use client';

import type React from 'react';

import { Send } from 'lucide-react';
import { useState } from 'react';

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
    <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 border border-gray-200">
      <input
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={disabled}
        className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder-gray-500 disabled:opacity-50"
      />
      <button
        onClick={handleSend}
        disabled={!message.trim() || disabled}
        className="text-blue-500 hover:text-blue-600 disabled:text-gray-300 transition-colors"
      >
        <Send size={18} />
      </button>
    </div>
  );
}
