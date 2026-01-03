
import { useLocalParticipant } from '@daily-co/daily-react';
import { SpeakerVideoPreview } from './SpeakerVideoPreview';
import { Role } from '@/app/auth/roles';

export function SpeakerPreviewWrapper({ role, isCamOn, isMicOn }: { role: Role, isCamOn: boolean, isMicOn: boolean }) {
    const localParticipant = useLocalParticipant();
    return (
        <SpeakerVideoPreview
            localParticipant={localParticipant}
            isLive={false} // Always false in lobby
            isCamOn={isCamOn}
            isMicOn={isMicOn}
            role={role}
        />
    );
}
