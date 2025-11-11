import AttendeeViewProfilePage from './[eventId]/attendees/page';

export default function Page({ params }: { params: { eventId: string } }) {
  return <AttendeeViewProfilePage eventId={params.eventId} />;
}
