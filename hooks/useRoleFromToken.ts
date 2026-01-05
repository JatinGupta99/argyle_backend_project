import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { Role, ROLES } from '@/app/auth/roles';
import { extractRoleFromInviteToken, isTokenExpired } from '@/lib/utils/jwt-utils';

export function useRoleFromToken() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const result = useMemo(() => {
        if (!token) {
            return {
                role: ROLES.ATTENDEE,
                token: null,
                isExpired: false,
                hasToken: false,
            };
        }
        const expired = isTokenExpired(token);
        const role = extractRoleFromInviteToken(token);

        return {
            role,
            token,
            isExpired: expired,
            hasToken: true,
        };
    }, [token]);

    return result;
}

export function useRole(): Role {
    const { role } = useRoleFromToken();
    return role;
}
