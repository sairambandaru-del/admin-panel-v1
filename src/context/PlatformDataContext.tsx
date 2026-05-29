"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Account {
  id: string;
  name: string;
  type: 'STR' | 'Corporate' | 'Vendor';
  domain: string;
  allowedModules: string[];
  status: 'Active' | 'Inactive';
  manager: string;
}

export interface PlatformUser {
  id: string;
  name: string;
  email: string;
  role: string;
  accountId: string;
  status: 'Active' | 'Inactive';
  customPermissions: string[];
}

interface PlatformDataContextType {
  accounts: Account[];
  users: PlatformUser[];
  addAccount: (account: Omit<Account, 'id' | 'status'>) => Account;
  updateAccount: (account: Account) => void;
  toggleAccountStatus: (id: string) => void;
  addUser: (user: Omit<PlatformUser, 'id' | 'status'>) => PlatformUser;
  updateUser: (user: PlatformUser) => void;
  toggleUserStatus: (id: string) => void;
}

const PlatformDataContext = createContext<PlatformDataContextType | undefined>(undefined);

const INITIAL_ACCOUNTS: Account[] = [
  { id: 'ACC-01', name: 'TechCorp Solutions', type: 'Corporate', domain: 'techcorp.com', allowedModules: ['dashboard', 'corporate'], status: 'Active', manager: 'Sarah Jenkins' },
  { id: 'ACC-02', name: 'Elite Housekeeping', type: 'Vendor', domain: 'elitehouse.com', allowedModules: ['dashboard', 'vendors'], status: 'Active', manager: 'David Miller' },
  { id: 'ACC-03', name: 'Skyline Holdings', type: 'STR', domain: 'skyline.com', allowedModules: ['dashboard', 'inventory', 'finance'], status: 'Active', manager: 'Emma Wilson' },
];

const INITIAL_USERS: PlatformUser[] = [
  { id: 'USR-01', name: 'Sarah Jenkins', email: 'sarah@techcorp.com', role: 'Account Admin', accountId: 'ACC-01', status: 'Active', customPermissions: ['dashboard', 'corporate'] },
  { id: 'USR-02', name: 'David Miller', email: 'david.m@elitehouse.com', role: 'Staff Coordinator', accountId: 'ACC-02', status: 'Active', customPermissions: ['dashboard', 'vendors'] },
  { id: 'USR-03', name: 'Emma Wilson', email: 'emma@skyline.com', role: 'Finance Analyst', accountId: 'ACC-03', status: 'Active', customPermissions: ['dashboard', 'finance'] },
];

export const PlatformDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accounts, setAccounts] = useState<Account[]>(() => {
    const saved = localStorage.getItem('straizen_accounts');
    return saved ? JSON.parse(saved) : INITIAL_ACCOUNTS;
  });

  const [users, setUsers] = useState<PlatformUser[]>(() => {
    const saved = localStorage.getItem('straizen_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  useEffect(() => {
    localStorage.setItem('straizen_accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem('straizen_users', JSON.stringify(users));
  }, [users]);

  const addAccount = (accData: Omit<Account, 'id' | 'status'>) => {
    const newAcc: Account = {
      ...accData,
      id: `ACC-0${accounts.length + 1}`,
      status: 'Active'
    };
    setAccounts(prev => [...prev, newAcc]);
    return newAcc;
  };

  const updateAccount = (updated: Account) => {
    setAccounts(prev => prev.map(a => a.id === updated.id ? updated : a));
  };

  const toggleAccountStatus = (id: string) => {
    setAccounts(prev => prev.map(a => {
      if (a.id === id) {
        const nextStatus = a.status === 'Active' ? 'Inactive' : 'Active';
        return { ...a, status: nextStatus };
      }
      return a;
    }));
  };

  const addUser = (userData: Omit<PlatformUser, 'id' | 'status'>) => {
    const newUser: PlatformUser = {
      ...userData,
      id: `USR-0${users.length + 1}`,
      status: 'Active'
    };
    setUsers(prev => [...prev, newUser]);
    return newUser;
  };

  const updateUser = (updated: PlatformUser) => {
    setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
  };

  const toggleUserStatus = (id: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        const nextStatus = u.status === 'Active' ? 'Inactive' : 'Active';
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  return (
    <PlatformDataContext.Provider value={{
      accounts,
      users,
      addAccount,
      updateAccount,
      toggleAccountStatus,
      addUser,
      updateUser,
      toggleUserStatus
    }}>
      {children}
    </PlatformDataContext.Provider>
  );
};

export const usePlatformData = () => {
  const context = useContext(PlatformDataContext);
  if (context === undefined) {
    throw new Error('usePlatformData must be used within a PlatformDataProvider');
  }
  return context;
};