'use client';
import { computeGrid } from '@/lib/utils';
import { DailyCall } from '@daily-co/daily-js';
import { ParticipantState } from './ParticipantState';
import { VideoTile } from './VideoTile';
import { useScreenShare, DailyVideo, useParticipantProperty, useParticipantIds } from '@daily-co/daily-react';
import { ROLES_ADMIN } from '@/app/auth/roles';
import { normalizeRole } from '@/app/auth/access';

export function VideoGrid({ callObject }: { callObject: any }) {
  const participantIds = useParticipantIds({ filter: 'remote' });
  const { screens } = useScreenShare();
  const hasScreenShare = screens.length > 0;
  // Focus on the most recent share
  const screenId = hasScreenShare ? screens[screens.length - 1].session_id : null;
  const screenUserName = useParticipantProperty(screenId || '', 'user_name');

  console.log('[VideoGrid] Total participants:', participantIds.length);

  const filteredIds = participantIds.filter((id: string) => {
    const p = callObject.participants()?.[id];
    if (!p) {
      console.log(`[VideoGrid] Participant ${id}: NOT FOUND`);
      return false;
    }

    const userData = (p as any).userData || {};
    // Normalize role for comparison, handling potential case differences
    const rawRole = userData.role || userData.participantType || userData.participant_type || '';
    const pRole = normalizeRole(rawRole);

    // Debug logging
    console.log(`[VideoGrid] Participant ${p.user_name}:`, {
      id,
      rawRole,
      normalizedRole: pRole,
      userData,
      hasVideo: p.video,
      isOwner: p.owner
    });

    // 1. Determine roles reliably
    const isSpeaker = pRole === ROLES_ADMIN.Speaker || rawRole === 'Speaker';
    const isModerator = pRole === ROLES_ADMIN.Moderator || rawRole === 'Moderator' || (pRole === ROLES_ADMIN.Attendee && p.owner);
    const isAttendee = pRole === ROLES_ADMIN.Attendee && !p.owner && rawRole !== 'Speaker' && rawRole !== 'Moderator';

    console.log(`[VideoGrid] ${p.user_name} role check:`, { isSpeaker, isModerator, isAttendee });

    // 2. Hide Attendees
    if (isAttendee || p.user_name?.toLowerCase().startsWith('attendee_')) {
      console.log(`[VideoGrid] ${p.user_name}: FILTERED OUT (attendee)`);
      return false;
    }

    // 3. Show Speakers and Moderators (even if camera is off - they'll show avatar/name)
    if (isSpeaker || isModerator) {
      console.log(`[VideoGrid] ${p.user_name}: SHOWING (speaker/moderator)`);
      return true;
    }

    console.log(`[VideoGrid] ${p.user_name}: FILTERED OUT (unknown role)`);
    return false;
  });

  console.log('[VideoGrid] Filtered participants:', filteredIds.length);

  if (!filteredIds.length && !hasScreenShare) {
    return (
      <div className=" bg-black h-full w-full flex items-center justify-center text-white text-lg">
        Waiting for participants to join…
      </div>
    );
  }

  // If there's a screen share, show it prominently
  if (hasScreenShare) {
    return (
      <div className="flex flex-col h-full w-full p-2 gap-2">
        <div className="flex-1 bg-black rounded-lg overflow-hidden relative border border-slate-800 shadow-lg">
          <DailyVideo
            type="screenVideo"
            sessionId={screenId!}
            className="w-full h-full object-contain"
          />
          <div className="absolute top-2 left-2 bg-black/60 text-white px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
            {screenUserName ? `${screenUserName} is presenting` : 'Someone is presenting'}
          </div>
        </div>

        {/* Small tiles for participants at the bottom */}
        {filteredIds.length > 0 && (
          <div className="h-32 flex gap-2 overflow-x-auto py-1">
            {filteredIds.map((id: string) => (
              <div key={id} className="w-48 flex-none">
                <ParticipantState id={id}>
                  {(state: any) => (
                    <VideoTile
                      id={state.id}
                      name={state.name}
                      isLocal={state.isLocal}
                      micOn={state.audioPlayable}
                      isActiveSpeaker={state.isActiveSpeaker}
                      hasVideo={state.videoPlayable}
                      role={state.role}
                    />
                  )}
                </ParticipantState>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  const { cols, rows } = computeGrid(filteredIds.length);

  const allCamerasOff = filteredIds.every((id: string) => {
    const p = callObject.participants()?.[id];
    return !p?.video;
  });

  if (allCamerasOff) {
    return (
      <div className="h-full w-full relative bg-background flex items-center justify-center">
        <div className="absolute inset-0 flex items-center justify-center text-black text-lg font-semibold text-center p-6">
          Speakers are live, but their <br /> cameras are off.
        </div>
        <div
          className="grid gap-2 h-full w-full opacity-20"
          style={{
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
          }}
        >
          {filteredIds.map((id: string) => (
            <ParticipantState key={id} id={id}>
              {(state: any) => (
                <VideoTile
                  id={state.id}
                  name={state.name}
                  isLocal={state.isLocal}
                  micOn={state.audioPlayable}
                  isActiveSpeaker={state.isActiveSpeaker}
                  hasVideo={state.videoPlayable}
                  role={state.role}
                />
              )}
            </ParticipantState>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full p-2">
      <div
        className="grid gap-2 h-full w-full"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
        }}
      >
        {filteredIds.map((id: string) => (
          <ParticipantState key={id} id={id}>
            {(state: any) => (
              <VideoTile
                id={state.id}
                name={state.name}
                isLocal={state.isLocal}
                micOn={state.audioPlayable}
                isActiveSpeaker={state.isActiveSpeaker}
                hasVideo={state.videoPlayable}
                role={state.role}
              />
            )}
          </ParticipantState>
        ))}
      </div>
    </div>
  );
}
