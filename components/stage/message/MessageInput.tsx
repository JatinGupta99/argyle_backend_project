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
    <div className="p-1 bg-transparent">
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
