import { ChatPanel } from '@/components/stage/chat/ChatPanel';
import { Header } from '@/components/stage/layout/Header';
import { SponsorCard } from '@/components/stage/sponsor-card';
import { EventId, UserID } from '@/lib/constants/api';
import { ChatType } from '@/lib/constants/chat';
import { ChatTab, RoleView } from '@/lib/slices/uiSlice.ts';
import { getSponsors } from '@/lib/sponsor';

interface EventPageProps {
  params: { eventId: string };
}

export default async function Page({ params }: EventPageProps) {
  const eventId = EventId;
  const sponsors = await getSponsors(eventId);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="w-[310px] border-r border-gray-200">
        <ChatPanel
          title1={ChatTab.Chat}
          title2={ChatTab.QA}
          title3={ChatTab.Chat}
          role={RoleView.Attendee}
          eventId={eventId}
          currentUserId={UserID}
          type={ChatType.LIVE}
        />
      </div>

      <div className="flex flex-col h-screen w-full overflow-hidden bg-background">
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-[2] flex flex-col overflow-hidden">
            <Header title="Financial Controller Leadership Forum: Redefining Trad..." />

            <h1 className="font-bold text-center mt-9">
              VISIT OUR SPONSORS BOOTHS:
            </h1>

            <div className="grid grid-cols-2 gap-5 p-3 overflow-y-auto flex-1">
              {Array.isArray(sponsors) && sponsors.length > 0 ? (
                sponsors.map((s, i) => (
                  <SponsorCard key={i} imageSrc={s.imageUrl} name={s.name} />
                ))
              ) : (
                <p className="text-center text-gray-500 col-span-2 mt-50">
                  No sponsors available for this Event.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
