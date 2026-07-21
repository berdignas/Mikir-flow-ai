'use client';

import React, { createContext, useContext, useState } from 'react';

export type UserRole = 'pm' | 'developer' | 'client';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  status: 'Active' | 'Pending';
  assignedProjectIds?: string[]; // IDs of projects owned by this client
}

interface AuthContextType {
  currentUser: UserAccount | null;
  usersList: UserAccount[];
  loginAs: (role: UserRole) => void;
  logout: () => void;
  addUser: (user: Omit<UserAccount, 'id'>) => void;
  deleteUser: (id: string) => void;
  updateUserRole: (id: string, role: UserRole) => void;
  updateUserProjects: (id: string, projectIds: string[]) => void;
}

const DUMMY_PROJECT_ID = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

const initialUsers: UserAccount[] = [
  { id: 'u1', name: 'Bagoes Pratama', email: 'pm@mikirflow.ai', role: 'pm', status: 'Active' },
  { id: 'u2', name: 'Dev Team Lead', email: 'dev@mikirflow.ai', role: 'developer', status: 'Active' },
  { id: 'u3', name: 'Klien (PT Javas)', email: 'client@javas.co.id', role: 'client', status: 'Active', assignedProjectIds: [DUMMY_PROJECT_ID] },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usersList, setUsersList] = useState<UserAccount[]>(initialUsers);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(initialUsers[0]); // Default PM

  const loginAs = (role: UserRole) => {
    const userMatch = usersList.find((u) => u.role === role) || {
      id: `u-${Date.now()}`,
      name: role === 'pm' ? 'Project Manager' : role === 'developer' ? 'Developer' : 'Klien Workspace',
      email: `${role}@mikirflow.ai`,
      role,
      status: 'Active',
      assignedProjectIds: role === 'client' ? [DUMMY_PROJECT_ID] : undefined,
    };
    setCurrentUser(userMatch);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const addUser = (newUser: Omit<UserAccount, 'id'>) => {
    const created: UserAccount = {
      ...newUser,
      id: `u-${Date.now()}`,
    };
    setUsersList((prev) => [...prev, created]);
  };

  const deleteUser = (id: string) => {
    setUsersList((prev) => prev.filter((u) => u.id !== id));
  };

  const updateUserRole = (id: string, role: UserRole) => {
    setUsersList((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role } : u))
    );
    if (currentUser?.id === id) {
      setCurrentUser((prev) => (prev ? { ...prev, role } : null));
    }
  };

  const updateUserProjects = (id: string, projectIds: string[]) => {
    setUsersList((prev) =>
      prev.map((u) => (u.id === id ? { ...u, assignedProjectIds: projectIds } : u))
    );
    if (currentUser?.id === id) {
      setCurrentUser((prev) => (prev ? { ...prev, assignedProjectIds: projectIds } : null));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        usersList,
        loginAs,
        logout,
        addUser,
        deleteUser,
        updateUserRole,
        updateUserProjects,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuthContext must be used within AuthProvider');
  return context;
};
