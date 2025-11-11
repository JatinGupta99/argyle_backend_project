'use client';
import React, { useEffect, useState } from 'react';
import DailyIframe from '@daily-co/daily-js';
import DailyRoom from '@/components/daily/DailyRoom';

import { ChatPanel } from '@/components/stage/ChatPanel';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ChatType } from '@/lib/constants/chat';
import { ReduxProvider } from '@/components/providers/ReduxProvider';
import { Header } from '@/components/stage/layout/Header';
import { EventId, UserID } from '@/lib/constants/api';


interface AttendeeViewProfilePageProps {
  eventId: string;
}

export default function AttendeeViewProfilePage({ eventId }: AttendeeViewProfilePageProps) {
  const [callObject, setCallObject] = useState<ReturnType<typeof DailyIframe.createCallObject> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const roomUrl = process.env.NEXT_PUBLIC_DAILY_ROOM_URL 
    || 'https://argyleexecutiveforum.daily.co/techconnect-ssssummit-2025';

  useEffect(() => {
    const co = DailyIframe.createCallObject();
    setCallObject(co);

    co.join({ url: roomUrl })
      .then(() => setLoading(false))
      .catch((err) => {
        console.error('Join error:', err);
        setError('Failed to join the meeting');
        setLoading(false);
      });

    return () => {
      co.leave().finally(() => co.destroy());
    };
  }, [roomUrl]);

  if (loading) return <CenteredMessage>Loading video...</CenteredMessage>;
  if (error) return <CenteredMessage className="text-red-600">{error}</CenteredMessage>;
  if (!callObject) return <CenteredMessage>Unable to initialize Daily call</CenteredMessage>;

  return (
    <ReduxProvider>
      <SidebarProvider>
        <div className="flex h-screen w-screen overflow-hidden bg-background">
          <aside className="w-[29.00%] flex-shrink-0 bg-[#FAFAFA] flex flex-col">
            <div className="flex-1 overflow-y-auto">
              <ChatPanel
                title1="Everyone"
                title2="Backstage"
                title3="Everyone"
                role="attendee"
                eventId={EventId}
                currentUserId={UserID}
                type={ChatType.LIVE}
              />
            </div>
          </aside>

          <main className="flex flex-1 flex-col overflow-hidden">
            <Header />
            <div className="flex-1 overflow-y-auto bg-white">
              <DailyRoom callObject={callObject} />
            </div>
          </main>
        </div>
      </SidebarProvider>
    </ReduxProvider>
  );
}

function CenteredMessage({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex items-center justify-center h-screen p-4 text-center ${className}`}>
      {children}
    </div>
  );
}