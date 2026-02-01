"use client";

import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from "react";
import { ROLE_PERMISSIONS, Role, Permission, ROLES_ADMIN } from "./roles";

interface AuthContextType {
  role: Role | null;
  userId: string | null;
  token: string | null;
  userData: any | null; // Unified user details
  setAuth: (role: Role, userId: string, token: string) => void;
  logout: () => void;
  can: (permission: Permission) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRoleState] = useState<Role | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<any | null>(null);

  useEffect(() => {
    // 1. Priority: URL Token (Invite Links)
    // Using window.location to avoid Next.js Suspense requirements for useSearchParams in this provider
    let initialToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      let urlToken = params.get('token');

      // Check for attendee cookie if no other token is primary
      const { getAttendeeTokenCookie } = require('@/lib/utils/cookie-utils');
      const attendeeCookieToken = getAttendeeTokenCookie();

      if (urlToken) {
        console.log('[AuthContext] Found token in URL, hydrating session...');
        if (urlToken.includes(' ')) {
          urlToken = urlToken.replace(/ /g, '+');
        }
        initialToken = urlToken;

        // Clean URL history (remove token)
        const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + window.location.hash;
        window.history.replaceState({ path: newUrl }, '', newUrl);
      } else if (!initialToken && attendeeCookieToken) {
        console.log('[AuthContext] Found attendee token in cookie, hydrating session...');
        initialToken = attendeeCookieToken;
      }
    }

    if (initialToken) {
      // Validate & Decode
      try {
        // We need to decode to get role/userId. 
        // Importing explicitly to avoid circular dependency issues if any, 
        // but jwt-utils is pure.
        const { extractUserDataFromToken } = require('@/lib/utils/jwt-utils');
        const userData = extractUserDataFromToken(initialToken);

        if (userData) {
          console.log('[AuthContext] Session restored for:', userData.userId, userData.role);

          setToken(initialToken);
          setRoleState(userData.role);
          setUserId(userData.userId);
          setUserData(userData);
          localStorage.setItem('token', initialToken);
        }
      } catch (e) {
        console.error('[AuthContext] Failed to restore session:', e);
      }
    }
  }, []);

  const can = useCallback((permission: Permission): boolean => {
    if (!role) return false;
    const permissions = ROLE_PERMISSIONS[role];
    return permissions?.includes(permission) ?? false;
  }, [role]);

  const setAuth = (newRole: Role, newUserId: string, newToken: string) => {
    setRoleState(newRole);
    setUserId(newUserId);
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  const logout = () => {
    setRoleState(null);
    setUserId(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ role, userId, token, userData, setAuth, logout, can }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
