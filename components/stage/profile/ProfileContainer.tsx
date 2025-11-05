'use client';

import type { Attendee } from '@/lib/constants/attendees';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { toggleMute } from '@/lib/slices/attendees-slice';
import type { RootState } from '@/lib/store';
import { Mic, MicOff } from 'lucide-react';

interface ProfileCardProps {
  attendee: Attendee;
}

export function ProfileCard({ attendee }: ProfileCardProps) {
  const dispatch = useDispatch();
  const mutedStatus = useSelector(
    (state: RootState) =>
      state.attendees.mutedStatus[attendee.id] ?? attendee.isMuted
  );
  const activeSpeaker = useSelector(
    (state: RootState) => state.attendees.activeSpeaker
  );
  const isActive = activeSpeaker === attendee.id && !mutedStatus;

  const handleToggleMute = () => {
    dispatch(toggleMute(attendee.id));
  };

  return (
    <div className="relative overflow-hidden rounded-lg bg-gray-300 aspect-square group cursor-pointer">
      <Image
        src={attendee.image || '/placeholder.svg'}
        alt={attendee.name}
        fill
        className="object-cover"
      />

      {isActive && (
        <div className="absolute inset-0 border-4 border-green-500 rounded-lg" />
      )}

      <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-3 py-2">
        <p className="text-xs font-medium text-white uppercase">
          {attendee.role}
        </p>
      </div>

      <button
        onClick={handleToggleMute}
        className="absolute top-2 right-2 hover:scale-110 transition-transform"
        aria-label={mutedStatus ? 'Unmute' : 'Mute'}
      >
        <div
          className={`rounded-full p-1.5 ${mutedStatus ? 'bg-red-500' : 'bg-green-500'}`}
        >
          {mutedStatus ? (
            <MicOff className="w-3 h-3 text-white" />
          ) : (
            <Mic className="w-3 h-3 text-white" />
          )}
        </div>
      </button>

      {isActive && (
        <div className="absolute top-2 left-2 bg-green-500 rounded-full px-2 py-1">
          <p className="text-xs font-semibold text-white">SPEAKING</p>
        </div>
      )}
    </div>
  );
}
