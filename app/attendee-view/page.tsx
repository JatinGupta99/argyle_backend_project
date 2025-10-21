'use client';
import React, { useEffect, useState } from 'react';
import DailyRoom from '@/components/daily/page';
import { Header } from '@/components/layout/Header/Page';
import { ReduxProvider } from '@/components/providers/redux-provider';
import { AppSidebar } from '@/components/stage/AppSideBar';
import { ChatPanel } from '@/components/stage/ChatPanel';
import { Sidebar, SidebarProvider } from '@/components/ui/Sidebar';
import DailyIframe from '@daily-co/daily-js';

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

  // Fetch room URL for the given eventId
  useEffect(() => {
    // async function fetchRoomUrl() {
    //   if (!eventId) {
    //     setError('Event ID is required');
    //     setLoading(false);
    //     return;
    //   }

    //   setLoading(true);
    //   setError(null);

    //   try {
    //     const res = await fetch(`/api/events/${eventId}`, {
    //       method: 'GET',
    //       headers: { Accept: 'application/json' },
    //       cache: 'no-store',
    //     });

    //     if (!res.ok) throw new Error('Failed to fetch event details');

    //     const data = await res.json();
    //     const url = data?.dailyRoomDetails?.dailyRoomUrl;
    //     const status = data?.dailyRoomDetails?.dailyRoomStatus;

    //     if (!url || status !== 'active') {
    //       throw new Error(
    //         'Daily room is not available or not active for this event'
    //       );
    //     }

    //     setRoomUrl(url);
    //   } catch (e: any) {
    //     setError(e.message || 'Unknown error fetching room URL');
    //   } finally {
    //     setLoading(false);
    //   }
    // }

    const hardcodedUrl = 'https://jatinguptawork.daily.co/IYgdOmH87NbECz55EZ3t';
    setRoomUrl(hardcodedUrl);
    setLoading(false);
    // fetchRoomUrl();
  }, [(eventId = 'cjksb')]);

 
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
      <SidebarProvider>
        <div className="flex flex-col h-screen w-screen overflow-hidden bg-background">
          <div className="flex flex-1 overflow-hidden">
            <Sidebar
              variant="sidebar"
              collapsible="none"
              className=" bg-[#F9F9F9]"
            >
              <AppSidebar />
            </Sidebar>
            <div className="w-[21.75%] h-full p-0 m-0 bg-red-500">
              <ChatPanel role="attendee" />
            </div>

            <div className="flex-[2]">
              <Header />
              <div className="flex-1 bg-white h-full overflow-hidden">
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
                ) : roomUrl && callObject ? (
                  <DailyRoom callObject={callObject} roomUrl={roomUrl} />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4">
                    <h3 className="text-black text-lg font-semibold">
                      Unable to load video
                    </h3>
                    <p className="text-gray-600 text-sm mt-2">
                      Please check your connection or refresh the page.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    </ReduxProvider>
  );
}
