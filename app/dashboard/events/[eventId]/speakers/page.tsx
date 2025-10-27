'use client';
import { Header } from '@/components/stage/layout/Header';
import { SpeakerStage } from '@/components/stage/views/SpeakerStage';

interface SpeakerPageProps {
  params: { eventId: string };
}

export default function SpeakerPage({ params }: SpeakerPageProps) {
  const { eventId } = params;

  return (
    <div>
      <Header title="" />
      <SpeakerStage eventId={eventId} />
    </div>
  );
}
