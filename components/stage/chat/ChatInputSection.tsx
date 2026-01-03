'use client';

import { MessageInput } from '../message/MessageInput';

interface ChatInputSectionProps {
  onSend: (text: string) => void;
  disabled: boolean;
}

export function ChatInputSection({ onSend, disabled }: ChatInputSectionProps) {
  return (
    <div className="w-full flex-none">
      <MessageInput onSend={onSend} disabled={disabled} />
    </div>
  );
}
