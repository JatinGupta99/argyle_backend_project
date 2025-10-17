'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/lib/store';
import { setLive, setRoomUrl } from '@/lib/slices/ui-slice';
import { DailyRoom } from '@/components/daily/daily-room';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell } from 'lucide-react';

interface VideoPanelProps {
  eventId: string;
}

export function VideoPanel({ eventId }: VideoPanelProps) {
  const dispatch = useDispatch();
  const isLive = useSelector((s: RootState) => s.ui.isLive);
  const roomUrl = useSelector((s: RootState) => s.ui.roomUrl);

  // Example notification count (replace with real state)
  const notifications = 3;

  async function handleGoLive() {
    try {
      if (!isLive) {
        const res = await fetch(`/api/events/${eventId}`, {
          method: 'GET',
          headers: { Accept: 'application/json' },
          cache: 'no-store',
        });

        if (!res.ok) throw new Error('Failed to fetch event details');

        const data = await res.json();
        const url = data?.dailyRoomDetails?.dailyRoomUrl;
        const status = data?.dailyRoomDetails?.dailyRoomStatus;

        if (!url || status !== 'active') {
          throw new Error('Daily room is not available for this event');
        }

        dispatch(setRoomUrl(url));
        dispatch(setLive(true));
      } else {
        dispatch(setLive(false));
        dispatch(setRoomUrl(null));
      }
    } catch (e: any) {
      console.error('[v0] Go Live error:', e.message);
    }
  }

  return (
    <div className="flex flex-col h-screen w-screen">
      {/* Header for VideoPanel only */}
      <div className="h-14 flex items-center justify-between px-6 bg-white font-semibold text-black border-b shadow-sm">
        <span className="text-lg font-semibold">SHARED VIEW</span>
      </div>

      {/* Video content */}
      <div className="flex-1 relative bg-video-foreground/5 overflow-auto">
        {/* Daily Room Container */}
        <div 
          className="absolute bg-white rounded-2xl shadow-lg overflow-hidden"
          style={{
            width: '784px',
            height: '674px',
            top: '116px',
            left: '627px',
            transform: 'rotate(0deg)',
            opacity: 1,
          }}
        >
          {isLive && roomUrl ? (
            <div className="w-full h-full relative bg-gray-900">
              {/* Daily Room Content */}
              <div className="w-full h-full">
                <DailyRoom roomUrl={roomUrl} />
              </div>

              {/* Speaker Section - Top Right */}
              <div className="absolute top-4 right-4 z-20">
                <div className="relative w-36 h-24 bg-black/80 rounded-md overflow-hidden">
                  <Image
                    src="/professional-curly-hair-woman.png"
                    alt="Speaker"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-1 left-1 right-1 flex items-center justify-between">
                    <span className="text-white text-xs font-medium">Speaker</span>
                    <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-full relative bg-gray-900 flex items-center justify-center">
              {/* SHARED VIEW Text */}
              <span className="text-gray-300 text-4xl font-semibold">
                SHARED VIEW
              </span>

              {/* Speaker Section - Top Right */}
              <div className="absolute top-4 right-4 z-20">
                <div className="relative w-36 h-24 bg-black/80 rounded-md overflow-hidden border">
                  <Image
                    src="/professional-curly-hair-woman.png"
                    alt="Speaker"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-1 left-1 right-1 flex items-center justify-between">
                    <span className="text-white text-xs font-medium">Speaker</span>
                    <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Go Live Button */}
      <div className="flex justify-center p-4 bg-background">
        <Button
          className="px-8 bg-[#1C96D3] hover:bg-[#1879b0] text-white flex flex-col h-auto py-3"
          onClick={handleGoLive}
        >
          <span className="text-sm font-medium">{isLive ? 'END LIVE' : 'GO LIVE'}</span>
        </Button>
      </div>
    </div>
  );
}
