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

/**
 * RoleGuard - A professional wrapper for conditional UI rendering
 * 
 * Supports both specific permissions and role-based checks.
 * Use permissions for granular features and roles for high-level sections.
 */
export function RoleGuard({
    children,
    permission,
    role,
    fallback = null
}: RoleGuardProps) {
    const { can, role: userRole } = useAuth();

    // 1. Check permissions if provided
    if (permission && !can(permission)) {
        return <>{fallback}</>;
    }

    // 2. Check roles if provided
    if (role) {
        const roles = Array.isArray(role) ? role : [role];
        if (!userRole || !roles.includes(userRole)) {
            return <>{fallback}</>;
        }
    }

    return <>{children}</>;
}
