import { ReduxProvider } from "@/components/providers/ReduxProvider";
import { ChatPanel } from "@/components/stage/chat/ChatPanel";
import { Header } from "@/components/stage/layout/Header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UserID } from "@/lib/constants/api";
import { ChatCategoryType, ChatSessionType } from "@/lib/constants/chat";
import { ChatTab, RoleView } from "@/lib/slices/uiSlice.ts";
import { EventPageProps } from "@/lib/types/components";
import SponsorListClient from "./SponsorListClient";

export default async function Page({ params }: EventPageProps) {
  const { eventId } = await params;

  return (
    <ReduxProvider>
      <SidebarProvider>
        <div className="flex h-screen w-screen overflow-hidden bg-background">
          <aside className="w-[27%] flex-shrink-0 bg-[#FAFAFA] flex flex-col">
            <ChatPanel
              title3={ChatTab.Chat}
              role={RoleView.Attendee}
              eventId={eventId}
              currentUserId={UserID}
              type={ChatSessionType.LIVE}
              tabs={[ChatCategoryType.CHAT, ChatCategoryType.QA]}
            />
          </aside>
          <main className="flex flex-col flex-1 overflow-hidden bg-background">
            <Header title="Financial Controller Leadership Forum: Redefining Trad..." />
            <section className="flex flex-col flex-1 overflow-hidden p-6">
              <h1 className="font-bold text-center mb-6">
                VISIT OUR SPONSORS' BOOTHS
              </h1>

              <SponsorListClient eventId={eventId} />
            </section>
          </main>
        </div>
      </SidebarProvider>
    </ReduxProvider>
  );
}
