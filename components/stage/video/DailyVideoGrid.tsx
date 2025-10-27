import {
  useLocalSessionId,
  useParticipantIds,
  DailyVideo,
} from '@daily-co/daily-react';
import VideoGrid from './VideoGrid';

export default function DailyVideoGrid({ roomUrl }) {
  const localId = useLocalSessionId();
  const remoteIds = useParticipantIds({ filter: 'remote' });

  return (
    <div>
      {' '}
      <VideoGrid />
    </div>
  );
}
