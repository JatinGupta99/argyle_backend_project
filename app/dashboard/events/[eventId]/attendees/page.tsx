'use client';
import DailyRoom from '@/components/daily/DailyRoom';
import { ReduxProvider } from '@/components/providers/ReduxProvider';
import { ChatPanel } from '@/components/stage/chat/ChatPanel';
import { Header } from '@/components/stage/layout/Header';
import CenteredMessage from '@/components/ui/CenteredMessage';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useDailyRoomConnector } from '@/hooks/useDailyRoom';
import { UserID } from '@/lib/constants/api';
import { ChatCategoryType, ChatSessionType } from '@/lib/constants/chat';
import { ChatTab, chatTabsFinal, RoleView } from '@/lib/slices/uiSlice.ts';
import { EventPageProps } from '@/lib/types/components';
import { DailyCall } from '@daily-co/daily-js';
import React, { use, useMemo } from 'react';

export default function AttendeeViewProfilePage({
  params,
}: EventPageProps) {
  const { eventId } = use(params);
  const userId = UserID;

  const { 
    callObject, 
    loading, 
    error: dailyConnectError, 
    isRoomReady, 
    eventTitle,
    eventError,
  } = useDailyRoomConnector(eventId);
  console.log(callObject,'callObject')

  const displayMessage = useMemo(() => {
    if (!userId) return 'Loading user...';
    if (loading) return 'Loading event details or joining call...';
    
    if (eventError) return eventError.message || 'Failed to load event details.'; 
    
    if (dailyConnectError) return dailyConnectError;
    
    if (!isRoomReady && !loading) return 'Unable to initialize Daily call.';
    
    return null; 
  }, [userId, loading, eventError, dailyConnectError, isRoomReady]);

  // 3. Determine error state for styling
  const isErrorMessage = eventError || dailyConnectError;

  return (
    <ReduxProvider>
      <SidebarProvider>
        <div className="flex h-screen w-screen overflow-hidden bg-background">
       <aside className="w-[27%] flex-shrink-0 bg-[#FAFAFA] flex flex-col border-r border-gray-200">
        <ChatPanel
          title3={ChatTab.Everyone}
          role={RoleView.Attendee}
          eventId={eventId}
          currentUserId={userId}
          type={ChatSessionType.LIVE}
          tabs={[ChatCategoryType.EVERYONE, ChatCategoryType.None]}
        />
      </aside>


          <main className="flex flex-1 flex-col overflow-hidden bg-white">
            <Header title={eventTitle || 'Loading Event...'} />
            <div className="flex-1 overflow-y-auto flex items-center justify-center">
              {displayMessage ? (
                <CenteredMessage className={isErrorMessage ? 'text-red-600' : ''}>
                  {displayMessage}
                </CenteredMessage>
              ) : (
                isRoomReady && <DailyRoom callObject={callObject as DailyCall} />
              )}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </ReduxProvider>
  );
}