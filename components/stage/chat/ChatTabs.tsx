'use client';

import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { ChatTab, selectChatTab, setChatTab } from '@/lib/slices/uiSlice.ts';
import { ChatCategoryType } from '@/lib/constants/chat';

interface ChatTabsProps {
  tabs: ChatCategoryType[];
  activeTab: ChatCategoryType;
  onChangeTab: (tab: ChatCategoryType) => void;
}

export function ChatTabs({ tabs, activeTab, onChangeTab }: ChatTabsProps) {
  const dispatch = useDispatch();
  const chatTab = useSelector((state: RootState) => selectChatTab(state));

  const validTabs =
    tabs.length === 2 && tabs[1] === (ChatCategoryType as any).None
      ? [tabs[0]]
      : tabs.filter(Boolean);

  const getTabLabel = (tab: ChatCategoryType): string => {
    switch (tab) {
      case ChatCategoryType.EVERYONE:
        return 'Everyone';
      case ChatCategoryType.QA:
        return 'Q&A';
      case ChatCategoryType.CHAT:
        return 'Chat';
      case ChatCategoryType.BACKSTAGE:
        return 'Backstage';
      default:
        return '';
    }
  };

  return (
    <div className="flex gap-2 px-3 py-2 items-center bg-[#E8F4FB]">
      {validTabs.map((tab) => {
        const isActive = chatTab === tab || activeTab === tab;

        return (
          <Button
            key={tab}
            onClick={() => {
              dispatch(setChatTab(tab as unknown as ChatTab));
              onChangeTab(tab);
            }}
            className={`h-8 text-xs rounded-md font-medium flex-1 transition-colors ${
              isActive
                ? 'bg-[#1C96D3] text-white'
                : 'bg-[#D1DEE5] text-gray-900 hover:bg-[#c3d5df]'
            }`}
          >
            {getTabLabel(tab)}
          </Button>
        );
      })}
    </div>
  );
}
