'use client';
import React, { useEffect, useState } from 'react';
import DailyRoom from '@/components/daily/page';
import { Header } from '@/components/layout/Header/Page';
import { ReduxProvider } from '@/components/providers/redux-provider';
import { AppSidebar } from '@/components/stage/AppSideBar';
import { ChatPanel } from '@/components/stage/ChatPanel';
import { SidebarProvider } from '@/components/ui/Sidebar';
import DailyIframe from '@daily-co/daily-js';
import { ChatType } from '@/lib/constants/chat';

interface AttendeeViewProfilePageProps {
  eventId: string;
}

export default function AttendeeViewProfilePage({
  eventId,
}: AttendeeViewProfilePageProps) {
  const [callObject, setCallObject] = useState<ReturnType<
    typeof DailyIframe.createCallObject
  > | null>(null);
  const [roomUrl, setRoomUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const co = DailyIframe.createCallObject();
    setCallObject(co);
    return () => {
      co.destroy();
    };
  }, []);

  useEffect(() => {
    const hardcodedUrl = 'https://jatinguptawork.daily.co/IYgdOmH87NbECz55EZ3t';
    setRoomUrl(hardcodedUrl);
    setLoading(false);
  }, [eventId]);

  useEffect(() => {
    if (callObject && roomUrl) {
      callObject.join({ url: roomUrl }).catch((err) => {
        console.error('Join error:', err);
        setError('Failed to join the meeting');
      });
    }
  }, [callObject, roomUrl]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-600 p-4">
        <p>{error}</p>
      </div>
    );
  }

  if (!roomUrl || !callObject) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Unable to load video room</p>
      </div>
    );
  }

  return (
    <ReduxProvider>
      {/* ✅ Wrap everything inside SidebarProvider so AppSidebar can use useSidebar */}
      <SidebarProvider>
        <div className="flex h-screen w-screen overflow-hidden bg-background">
          {/* Left Sidebar (fixed) */}
          <div className="w-[260px] flex-shrink-0 border-r bg-[#F9F9F9] flex flex-col">
            <AppSidebar />
          </div>

          {/* Right Chat Panel (fixed) */}
          <div className="w-[21.75%] flex-shrink-0 border-l bg-[#FAFAFA] flex flex-col">
            <div className="flex-1 overflow-y-auto">
              <ChatPanel
                role="attendee"
                title1="Everyone"
                title2="Chat With Argyle"
                title3="Everyone"
                currentUserId=""
                type={ChatType.LIVE}
              />
            </div>
          </div>
          {/* Main content area */}
          <div className="flex flex-col flex-1 overflow-hidden">
            <Header />
            <div className="flex-1 overflow-y-auto bg-white">
              {loading ? (
                <div className="w-full h-full flex items-center justify-center p-4">
                  <p>Loading video...</p>
                </div>
              ) : error ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-4">
                  <h3 className="text-red-600 text-lg font-semibold">
                    Error loading video
                  </h3>
                  <p className="text-gray-600 text-sm mt-2">{error}</p>
                </div>
              ) : (
                <DailyRoom callObject={callObject} roomUrl={roomUrl} />
              )}
            </div>
          </div>
        </div>
      </SidebarProvider>
    </ReduxProvider>
  );
}
