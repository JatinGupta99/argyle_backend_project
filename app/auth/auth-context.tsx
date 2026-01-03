"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { ROLE_PERMISSIONS, Role, Permission } from "./roles";

interface AuthContextType {
  role: Role | null;
  userId: string | null;
  setRole: (role: Role, userId: string) => void;
  can: (permission: Permission) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRoleState] = useState<Role | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const can = useCallback((permission: Permission): boolean => {
    if (!role) return false;
    const permissions = ROLE_PERMISSIONS[role];
    return permissions?.includes(permission) ?? false;
  }, [role]);

  const setRole = (role: Role, userId: string) => {
    setRoleState(role);
    setUserId(userId);
  };

  return (
    <AuthContext.Provider value={{ role, userId, setRole, can }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
