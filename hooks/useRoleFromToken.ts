import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { Role, ROLES } from '@/app/auth/roles';
import { extractRoleFromInviteToken, isTokenExpired } from '@/lib/utils/jwt-utils';

/**
 * Custom hook to extract and determine user role from URL token
 * @returns Object containing role, token, and validation state
 */
export function useRoleFromToken() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const result = useMemo(() => {
        // No token provided
        if (!token) {
            return {
                role: ROLES.ATTENDEE,
                token: null,
                isExpired: false,
                hasToken: false,
            };
        }

        // Check if token is expired
        const expired = isTokenExpired(token);

        // Extract role from token
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

/**
 * Hook variant that returns only the role
 * Useful when you only need the role value
 */
export function useRole(): Role {
    const { role } = useRoleFromToken();
    return role;
}
