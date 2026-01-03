'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/app/auth/auth-context';
import { Permission, Role } from '@/app/auth/roles';
import { Loader2, ShieldAlert } from 'lucide-react';

interface PageGuardProps {
    children: ReactNode;
    permission?: Permission;
    role?: Role | Role[];
}

/**
 * PageGuard - Professional route-level protection
 * 
 * Used to wrap entire pages to prevent unauthorized access.
 * Displays a professional 'Access Denied' screen if requirements aren't met.
 */
export function PageGuard({
    children,
    permission,
    role
}: PageGuardProps) {
    const { can, role: userRole } = useAuth();

    // 1. Loading state (if role isn't initialized yet)
    // Note: In a real app, you'd check a 'loading' state from your auth provider
    if (!userRole) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-slate-50 gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <p className="text-slate-500 font-medium">Verifying access permissions...</p>
            </div>
        );
    }

    // 2. Permission check
    const hasPermission = permission ? can(permission) : true;

    // 3. Role check
    const roles = role ? (Array.isArray(role) ? role : [role]) : null;
    const hasRole = roles ? roles.includes(userRole) : true;

    if (!hasPermission || !hasRole) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-slate-50 p-6 text-center">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                    <ShieldAlert className="h-10 w-10 text-red-600" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Access Denied</h1>
                <p className="text-slate-600 max-w-md mb-8">
                    You do not have the necessary permissions to view this page.
                    If you believe this is an error, please contact your event administrator.
                </p>
                <button
                    onClick={() => window.location.href = '/dashboard'}
                    className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium"
                >
                    Return to Dashboard
                </button>
            </div>
        );
    }

    return <>{children}</>;
}
