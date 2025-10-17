'use client';

import { useState } from 'react';
import type { Attendee } from '@/lib/constants/attendees';
import { ProfileCard } from './profile-card';

interface ProfilesContainerProps {
  attendees: Attendee[];
}

export function ProfilesContainer({ attendees }: ProfilesContainerProps) {
  const [showAll, setShowAll] = useState(false);

  const visibleAttendees = showAll ? attendees : attendees.slice(0, 5);
  const remainingCount = attendees.length - 5;

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
      style={{
        width: '755px',
        height: '793px',
      }}
    >
      <div className="flex-1 overflow-y-auto p-5">
        <div className="grid grid-cols-2 gap-5">
          {visibleAttendees.map((attendee) => (
            <ProfileCard key={attendee.id} attendee={attendee} />
          ))}

          {!showAll && remainingCount > 0 && (
            <button
              onClick={() => setShowAll(true)}
              className="relative h-40 bg-black rounded-lg flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                  NB
                </div>
                <span className="text-white text-base font-semibold">
                  +{remainingCount}
                </span>
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
