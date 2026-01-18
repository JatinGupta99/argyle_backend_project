'use client';

import * as React from 'react';

import { useAuth } from '@/app/auth/auth-context';
import { ROLES_ADMIN } from '@/app/auth/roles';
import { YouTubeEmbed } from '@/components/shared/YouTubeEmbed';
import { ChatPanel } from '@/components/stage/chat/ChatPanel';
import { } from '@/lib/constants/api';
import { ChatCategoryType, ChatSessionType } from '@/lib/constants/chat';
import { ChatTab } from '@/lib/slices/uiSlice';
import { useParams } from 'next/navigation';

const RAW_VIDEO_URL = "https://www.youtube.com/watch?v=8NJTFdpecaI";
const YOUTUBE_URL = RAW_VIDEO_URL.replace(/\s/g, '');

export default function PreRecordedPage() {
    const params = useParams();
    const eventId = params?.eventId as string;
    const { role, userId } = useAuth();

    const canControl = role === ROLES_ADMIN.Moderator;

    React.useEffect(() => {
        console.log('Current Role:', role);
        console.log('Can Control:', canControl);
    }, [role, canControl]);

    return (
        <div className="flex w-full h-full bg-black overflow-hidden relative">
            {/* Chat Section - Wrapper needs to be flexible or fixed height to allow ChatPanel to manage width */}
            <div className="h-full z-10 border-r border-border bg-background shadow-xl">
                <ChatPanel
                    title3={ChatTab.Chat}
                    role={ROLES_ADMIN.Attendee}
                    eventId={eventId}
                    currentUserId={userId || ''}
                    type={ChatSessionType.LIVE}
                    tabs={[ChatCategoryType.CHAT, ChatCategoryType.QA]}
                />
            </div>

            {/* Video Section */}
            <div className="flex-1 flex items-center justify-center bg-black relative group overflow-hidden">
                <YouTubeEmbed
                    url={YOUTUBE_URL}
                    className="w-full h-full"
                    controls={canControl}
                    autoplay={!canControl}
                    muted={!canControl}
                    loop={!canControl}
                />

                {!canControl && (
                    <div className="absolute inset-0 z-20 pointer-events-none" />
                )}
            </div>
        </div>
    );
}
