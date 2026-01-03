'use client';

import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { ChatTab, selectChatTab, setChatTab } from '@/lib/slices/uiSlice';
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
    <div className="flex gap-4 px-4 py-4 items-center bg-blue-50/50 border-b border-blue-100 overflow-x-auto no-scrollbar scroll-smooth">
      {validTabs.map((tab) => {
        const isActive = chatTab === tab || activeTab === tab;

        return (
          <Button
            key={tab}
            onClick={() => {
              dispatch(setChatTab(tab as unknown as ChatTab));
              onChangeTab(tab);
            }}
            className={`h-11 flex-1 min-w-[120px] text-[15px] rounded-xl font-bold px-6 shrink-0 transition-all ${isActive
              ? 'bg-[#1da1f2] text-white shadow-lg shadow-sky-500/20 hover:bg-[#1a91da]'
              : 'bg-[#e1e8ed] text-[#657786] hover:bg-[#d1d9df]'
              }`}
          >
            <span className="whitespace-nowrap">{getTabLabel(tab)}</span>
          </Button>
        );
      })}
    </div>
  );
}
