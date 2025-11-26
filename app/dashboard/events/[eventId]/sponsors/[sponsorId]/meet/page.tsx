'use client';

import { ChatPanel } from '@/components/stage/chat/ChatPanel';
import { Header } from '@/components/stage/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDetailedSponsor } from '@/hooks/useDetailedSponsor';
import { UserID } from '@/lib/constants/api';
import { ChatCategoryType, ChatSessionType } from '@/lib/constants/chat';
import { ChatTab, RoleView } from '@/lib/slices/uiSlice.ts';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useState } from 'react';

export default function SponsorBoothMeet() {
  const { eventId, sponsorId } = useParams() as {
    eventId?: string;
    sponsorId?: string;
  };

  const ready = Boolean(eventId && sponsorId);

  // ❗DECLARE THESE ALWAYS – NEVER CONDITIONAL
  const { sponsor, loading, error } = useDetailedSponsor(
    ready ? eventId! : '',
    ready ? sponsorId! : ''
  );

  // ❗Declare local state BEFORE ANY conditional return
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    title: '',
    industry: '',
    isResearching: 'yes',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  // ❗NO RETURNS ABOVE — RETURN ONLY HERE
  if (!ready) {
    return (
      <div className="flex h-screen items-center justify-center">
        Invalid sponsor URL.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  if (!sponsor) {
    return (
      <div className="flex h-screen items-center justify-center">
        No sponsor data found.
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">

     <aside className="w-[27%] flex-shrink-0 bg-[#FAFAFA] border-r">
            <ChatPanel
              title3={ChatTab.Chat}
              role={RoleView.Attendee}
              eventId={eventId!}
              currentUserId={UserID}
              type={ChatSessionType.LIVE}
              tabs={[ChatCategoryType.CHAT, ChatCategoryType.QA]}
            />
          </aside>

      <main className="flex-1 flex flex-col overflow-y-auto">
        <Header title={sponsor.name} />

        <div className="flex flex-1 items-center justify-center px-6 py-10">
          <div className="max-w-4xl w-full bg-white border border-gray-200 shadow-sm rounded-lg p-8 space-y-8">

            <h1 className="text-3xl font-bold text-center text-gray-900">
              Meet Our Sponsor
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              <div className="space-y-6">
                <section className="space-y-4">
                  <div className="flex justify-center">
                    <Image
                      src={sponsor.logo}
                      alt={`${sponsor.name} logo`}
                      width={180}
                      height={80}
                      className="rounded-md object-contain"
                    />
                  </div>

                  <h2 className="text-lg font-semibold text-gray-800">
                    Introducing {sponsor.name}
                  </h2>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {sponsor.about}
                  </p>
                </section>

                <section>
                  <h3 className="text-base font-semibold mb-2 text-gray-800">
                    Would you like to meet?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Chat with our team via{' '}
                    <a href={sponsor.meetingLink || '#'} className="text-primary hover:underline">
                      live chat
                    </a>{' '}
                    or schedule using{' '}
                    <a href={sponsor.calendlyLink || '#'} className="text-primary hover:underline">
                      Calendly
                    </a>.
                  </p>
                </section>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 shadow-inner border border-gray-100">
                <h2 className="text-lg font-semibold text-center mb-4 text-gray-800">
                  Need More Info?
                </h2>

                <form onSubmit={handleSubmit} className="space-y-3">
                  {['name', 'address', 'phone', 'title', 'industry'].map((field) => (
                    <div key={field}>
                      <Label htmlFor={field} className="capitalize text-xs text-gray-700">
                        {field}
                      </Label>
                      <Input
                        id={field}
                        name={field}
                        value={(formData as any)[field]}
                        onChange={handleInputChange}
                        placeholder={`Enter your ${field}`}
                        className="mt-1"
                      />
                    </div>
                  ))}

                  <Button type="submit" className="w-full mt-4">
                    Submit
                  </Button>
                </form>
              </div>

            </div>

            <div className="text-center text-xs text-muted-foreground border-t pt-4">
              <p>{sponsor.description}</p>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
