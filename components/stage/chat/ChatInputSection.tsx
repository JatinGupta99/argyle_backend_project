'use client';

import { MessageInput } from '../message/MessageInput';

interface ChatInputSectionProps {
  onSend: (text: string) => void;
  disabled: boolean;
}

export function ChatInputSection({ onSend, disabled }: ChatInputSectionProps) {
  return (
    <div className="sticky bottom-0 left-0 right-0 bg-blue-50 px-4 pt-4 pb-2 border-gray-200">
      <MessageInput onSend={onSend} disabled={disabled} />
    </div>
  );
}
