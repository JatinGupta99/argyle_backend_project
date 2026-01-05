'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/app/auth/auth-context';
import { Permission, Role } from '@/app/auth/roles';

interface RoleGuardProps {
    children: ReactNode;
    permission?: Permission;
    role?: Role | Role[];
    fallback?: ReactNode;
}

export function RoleGuard({
    children,
    permission,
    role,
    fallback = null
}: RoleGuardProps) {
    const { can, role: userRole } = useAuth();
    if (permission && !can(permission)) {
        return <>{fallback}</>;
    }
    if (role) {
        const roles = Array.isArray(role) ? role : [role];
        if (!userRole || !roles.includes(userRole)) {
            return <>{fallback}</>;
        }
    }

    return <>{children}</>;
}
