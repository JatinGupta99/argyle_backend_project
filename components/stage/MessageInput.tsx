'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { GridIcon } from './GridIconMessage';

export function MessageInput({ onSend }: { onSend: (text: string) => void }) {
  const [value, setValue] = useState('');
  const canSend = value.trim().length > 0;

  function handleSend() {
    if (!canSend) return;
    onSend(value.trim());
    setValue('');
  }

  return (
    <div className="flex items-center gap-2 rounded-2xl bg-white border border-gray-300 p-3 shadow-lg transition-all duration-300 hover:shadow-xl w-full">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 border-none focus:ring-0 focus:outline-none bg-transparent"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleSend();
          }
        }}
      />
      <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
        <GridIcon />
      </button>
      <Button
        size="sm"
        onClick={handleSend}
        disabled={!canSend}
        className="bg-[#1C96D3] hover:bg-blue-600 text-white rounded-full"
      >
        <Send className="w-5 h-5" />
      </Button>
    </div>
  );
}
