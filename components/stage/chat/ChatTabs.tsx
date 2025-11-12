'use client';

import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { ChatTab, selectChatTab, setChatTab } from '@/lib/slices/uiSlice.ts';

interface ChatTabsProps {
  titles: string[];
}

export function ChatTabs({ titles }: ChatTabsProps) {
  const dispatch = useDispatch();
  const chatTab = useSelector((state: RootState) => selectChatTab(state));

  return (
    <div className="flex gap-2 px-3 py-2 items-center bg-[#E8F4FB]">
      {titles.filter(Boolean).map((title, index) => {
        const chatTabValue = title as ChatTab;
        const isActive = chatTab === chatTabValue || (!chatTab && index === 0);

        return (
          <Button
            key={title}
            onClick={() => dispatch(setChatTab(chatTabValue))}
            className={`h-8 text-xs rounded-md font-medium flex-1 transition-colors ${
              isActive
                ? 'bg-[#1C96D3] text-white'
                : 'bg-[#D1DEE5] text-gray-900 hover:bg-[#c3d5df]'
            }`}
          >
            {title}
          </Button>
        );
      })}
    </div>
  );
}
