'use client';

import { useEffect, useState, useMemo } from 'react';
import DailyIframe, { DailyCall } from '@daily-co/daily-js';
import { Header } from '@/components/stage/layout/Header';
import DailyRoom from '@/components/daily/DailyRoom';
import { ChatPanel } from '@/components/stage/chat/ChatPanel';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ReduxProvider } from '@/components/providers/ReduxProvider';
import CenteredMessage from '@/components/ui/CenteredMessage';
import { chatTitles, UserID } from '@/lib/constants/api';
import { ChatType } from '@/lib/constants/chat';
import { AttendeeViewProfilePageProps } from '@/lib/types/components';
import { RoleView } from '@/lib/slices/uiSlice.ts';

export default function AttendeeViewProfilePage({
  eventId,
}: AttendeeViewProfilePageProps) {
  const userId = UserID;

  const [callObject, setCallObject] = useState<DailyCall | null>(null);
  const [status, setStatus] = useState<'idle' | 'joining' | 'ready' | 'error'>(
    'idle'
  );
  const [error, setError] = useState<string | null>(null);

  const roomUrl = useMemo(
    () =>
      process.env.NEXT_PUBLIC_DAILY_ROOM_URL ??
      'https://argyleexecutiveforum.daily.co/techconnect-ssssummit-2025',
    []
  );
  useEffect(() => {
    if (!roomUrl) {
      setError('Missing Daily room URL');
      setStatus('error');
      return;
    }

    const co = DailyIframe.createCallObject();
    setCallObject(co);
    setStatus('joining');

    co.join({
      url: roomUrl,
      userName: userId || 'Guest',
    })
      .then(() => {
        setStatus('ready');
      })
      .catch((err) => {
        console.error('Daily join failed:', err);
        setError('Failed to join the meeting');
        setStatus('error');
      });

    return () => {
      co.leave()
        .catch(() => {})
        .finally(() => co.destroy());
    };
  }, [roomUrl, userId]);

  if (!userId) return <CenteredMessage>Loading user...</CenteredMessage>;

  if (status === 'joining')
    return <CenteredMessage>Joining Daily call...</CenteredMessage>;

  if (status === 'error' || error)
    return (
      <CenteredMessage className="text-red-600">
        {error || 'An unexpected error occurred.'}
      </CenteredMessage>
    );

  if (!callObject)
    return <CenteredMessage>Unable to initialize Daily call</CenteredMessage>;

  return (
    <ReduxProvider>
      <SidebarProvider>
        <div className="flex h-screen w-screen overflow-hidden bg-background">
          <aside className="w-[27%] flex-shrink-0 bg-[#FAFAFA] flex flex-col border-r border-gray-200">
            <ChatPanel
              title1={chatTitles.Everyone}
              title2={chatTitles.Backstage}
              title3={chatTitles.Everyone}
              role={RoleView.Attendee}
              eventId={eventId}
              currentUserId={userId}
              type={ChatType.LIVE}
            />
          </aside>

          <main className="flex flex-1 flex-col overflow-hidden bg-white">
            <Header title="Financial Controller Leadership Forum: Redefining Trad..." />
            <div className="flex-1 overflow-y-auto flex items-center justify-center">
              <DailyRoom callObject={callObject} />
            </div>
          </main>
        </div>
      </SidebarProvider>
    </ReduxProvider>
  );
}
