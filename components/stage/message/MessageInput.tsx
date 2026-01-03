'use client';

import React, { useState } from 'react';
import { SocialInput } from '@/components/shared/SocialInput';

interface MessageInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function MessageInput({ onSend, disabled }: MessageInputProps) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message);
      setMessage('');
    }
  };

  return (
    <div className="px-4 pb-6 pt-2 bg-transparent">
      <SocialInput
        value={message}
        onChange={setMessage}
        onSend={handleSend}
        placeholder="Message..."
        disabled={disabled}
        variant="chat"
      />
    </div>
  );
}
