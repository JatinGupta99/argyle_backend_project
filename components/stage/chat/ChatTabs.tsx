'use client';

import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { ChatTab, selectChatTab, setChatTab } from '@/lib/slices/uiSlice';
import { ChatCategoryType } from '@/lib/constants/chat';
import { MessageSquare, Users, HelpCircle, Shield, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ChatTabsProps {
  tabs: ChatCategoryType[];
  activeTab: ChatCategoryType;
  onChangeTab: (tab: ChatCategoryType) => void;
  collapsed?: boolean;
}

export function ChatTabs({ tabs, activeTab, onChangeTab, collapsed }: ChatTabsProps) {
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

  const getTabIcon = (tab: ChatCategoryType): LucideIcon => {
    switch (tab) {
      case ChatCategoryType.EVERYONE:
        return Users;
      case ChatCategoryType.QA:
        return HelpCircle;
      case ChatCategoryType.CHAT:
        return MessageSquare;
      case ChatCategoryType.BACKSTAGE:
        return Shield;
      default:
        return MessageSquare;
    }
  };

  return (
    <div className={cn(
      "flex items-center bg-card scroll-smooth transition-all duration-300",
      collapsed
        ? "flex-col gap-4 py-4 px-2 w-full"
        : "flex-row gap-4 px-4 py-2 overflow-x-auto no-scrollbar"
    )}>
      <TooltipProvider>
        {validTabs.map((tab) => {
          const isActive = activeTab === tab;
          const Icon = getTabIcon(tab);

          const buttonContent = (
            <Button
              key={tab}
              onClick={() => {
                dispatch(setChatTab(tab as unknown as ChatTab));
                onChangeTab(tab);
              }}
              className={cn(
                "font-bold transition-all shrink-0",
                collapsed
                  ? "h-10 w-10 min-w-0 rounded-full p-0 flex items-center justify-center"
                  : "h-11 flex-1 min-w-[120px] rounded-xl px-6 text-[15px]",
                isActive
                  ? 'bg-[#1c97d4] text-white shadow-lg shadow-sky-400/20 hover:bg-[#1a88bd]'
                  : 'bg-[#e1e8ed] text-[#657786] hover:bg-[#d1d9df]'
              )}
            >
              <Icon size={collapsed ? 20 : 18} className={cn(!collapsed && "mr-2 hidden")} />
              {!collapsed && <span className="whitespace-nowrap">{getTabLabel(tab)}</span>}
            </Button>
          );

          if (collapsed) {
            return (
              <Tooltip key={tab} delayDuration={0}>
                <TooltipTrigger asChild>
                  {buttonContent}
                </TooltipTrigger>
                <TooltipContent side="right" className="font-bold">
                  {getTabLabel(tab)}
                </TooltipContent>
              </Tooltip>
            );
          }

          return buttonContent;
        })}
      </TooltipProvider>
    </div>
  );
}
