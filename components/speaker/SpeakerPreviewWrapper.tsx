
import { useLocalParticipant } from '@daily-co/daily-react';
import { SpeakerVideoPreview } from './SpeakerVideoPreview';
import { Role } from '@/app/auth/roles';

export function SpeakerPreviewWrapper({ role, isCamOn }: { role: Role, isCamOn: boolean }) {
    const localParticipant = useLocalParticipant();
    return (
        <SpeakerVideoPreview
            localParticipant={localParticipant}
            isLive={false} // Always false in lobby
            isCamOn={isCamOn}
            role={role}
        />
    );
}
