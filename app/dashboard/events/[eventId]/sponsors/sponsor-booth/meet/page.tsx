'use client';

import { ChatPanel } from '@/components/stage/chat/ChatPanel';
import { Header } from '@/components/stage/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EventId, UserID } from '@/lib/constants/api';
import { ChatCategoryType, ChatSessionType } from '@/lib/constants/chat';
import { ChatTab, RoleView } from '@/lib/slices/uiSlice.ts';
import Image from 'next/image';
import { useState } from 'react';

export default function SponsorBoothMeet() {
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
    console.log('Form submitted:', formData);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar - Chat */}
      <div className="w-[310px] border-r border-gray-200">
        <ChatPanel
          title3={ChatTab.Chat}
          role={RoleView.Attendee}
          eventId={EventId}
          currentUserId={UserID}
          type={ChatSessionType.LIVE}
            tabs={[ChatCategoryType.CHAT, ChatCategoryType.QA]}
        />
      </div>

      {/* Right Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        <Header title="Financial Controller Leadership Forum: Redefining Trad..." />

        <div className="flex flex-1 items-center justify-center px-6 py-10">
          <div className="max-w-4xl w-full bg-white border border-gray-200 shadow-sm rounded-lg p-8 space-y-8">
            {/* Title */}
            <h1 className="text-3xl font-bold text-center text-gray-900">
              Meet Our Sponsor
            </h1>

            {/* Main Two-Column Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Section - Info */}
              <div className="space-y-6">
                <section className="space-y-4">
                  <div className="flex justify-center">
                    <Image
                      src="/images/bill.jpg"
                      alt="Bill company logo"
                      width={180}
                      height={80}
                      className="rounded-md object-contain"
                    />
                  </div>

                  <h2 className="text-lg font-semibold text-gray-800">
                    Introducing Bill
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    BILL helps its clients automate financial workflows and
                    manage their finances with confidence. We empower small and
                    mid-sized businesses with smarter, faster financial tools.
                  </p>
                </section>

                <section>
                  <h3 className="text-base font-semibold mb-2 text-gray-800">
                    Would you like to meet?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Chat with our team now via{' '}
                    <a href="#" className="text-primary hover:underline">
                      live chat
                    </a>{' '}
                    or schedule a meeting using{' '}
                    <a href="#" className="text-primary hover:underline">
                      Calendly
                    </a>
                    .
                  </p>
                </section>
              </div>

              {/* Right Section - Form */}
              <div className="bg-gray-50 rounded-lg p-6 shadow-inner border border-gray-100">
                <h2 className="text-lg font-semibold text-center mb-4 text-gray-800">
                  Need More Info?
                </h2>

                <form onSubmit={handleSubmit} className="space-y-3">
                  {['name', 'address', 'phone', 'title', 'industry'].map(
                    (field) => (
                      <div key={field}>
                        <Label
                          htmlFor={field}
                          className="capitalize text-xs text-gray-700"
                        >
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
                    )
                  )}
                  <Button type="submit" className="w-full mt-4">
                    Submit
                  </Button>
                </form>
              </div>
            </div>

            {/* Bottom Context */}
            <div className="text-center text-xs text-muted-foreground border-t pt-4">
              <p>
                Want to learn more about Bill’s solutions? Visit our company
                page or reach out to our team for personalized support.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
