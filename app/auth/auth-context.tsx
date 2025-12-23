"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import {  ROLE_CONFIG, RoleConfig } from "./role-config";
import { Role } from "./roles";

interface AuthContextType {
  role: Role | null;
  userId: string | null;
  roleConfig: RoleConfig | null;
  setRole: (role: Role, userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRoleState] = useState<Role | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [roleConfig, setRoleConfig] = useState<RoleConfig | null>(null);

  const setRole = (role: Role, userId: string) => {
    setRoleState(role);
    setUserId(userId);
    setRoleConfig(ROLE_CONFIG[role]);
  };

  return (
    <AuthContext.Provider value={{ role, userId, roleConfig, setRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
