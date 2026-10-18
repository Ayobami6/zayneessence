'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { CustomerAddress, CustomerSession } from '@/types/domain';

const AUTH_STORAGE_KEY = 'zayneessence_auth_session_v1';

interface AuthContextValue {
  session: CustomerSession | null;
  signInWithPhoneOtp: (phone: string, name?: string) => void;
  signInWithMagicLink: (email: string, name?: string) => void;
  signOut: () => void;
  toggleAdminRole: () => void;
  saveAddress: (address: CustomerAddress) => void;
  removeAddress: (addressId: string) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<CustomerSession | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
      if (raw) {
        setSession(JSON.parse(raw) as CustomerSession);
      }
    } catch {
      // Ignore malformed storage
    }
  }, []);

  const persistSession = (next: CustomerSession | null) => {
    setSession(next);
    if (typeof window === 'undefined') return;
    if (next) {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(next));
    } else {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  };

  const signInWithPhoneOtp = (phone: string, name?: string) => {
    const next: CustomerSession = {
      id: `cust-${phone.replace(/\D/g, '')}`,
      phone,
      email: session?.email || 'client@zayneessence.com',
      name: name?.trim() || session?.name || 'Amara Danjuma',
      authMethod: 'phone_otp',
      role: session?.role || 'customer',
      savedAddresses: session?.savedAddresses || [
        {
          id: 'addr-default-1',
          recipientName: name?.trim() || 'Amara Danjuma',
          phone,
          state: 'Lagos',
          cityOrLga: 'Ikoyi',
          streetAddress: '14 Bourdillon Road',
          landmark: 'Near Falomo Roundabout',
          isDefault: true,
        },
      ],
    };
    persistSession(next);
  };

  const signInWithMagicLink = (email: string, name?: string) => {
    const isAdminEmail = email.toLowerCase().includes('admin@zayneessence.com');
    const next: CustomerSession = {
      id: `cust-${email.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      email: email.trim(),
      phone: session?.phone || '+234 803 456 7890',
      name: name?.trim() || session?.name || 'Zayne Studio Client',
      authMethod: 'email_magic_link',
      role: isAdminEmail ? 'admin' : session?.role || 'customer',
      savedAddresses: session?.savedAddresses || [
        {
          id: 'addr-default-1',
          recipientName: name?.trim() || 'Zayne Studio Client',
          phone: '+234 803 456 7890',
          state: 'Lagos',
          cityOrLga: 'Victoria Island',
          streetAddress: '8A Kofo Abayomi Street',
          isDefault: true,
        },
      ],
    };
    persistSession(next);
  };

  const signOut = () => {
    persistSession(null);
  };

  const toggleAdminRole = () => {
    if (!session) {
      const adminSession: CustomerSession = {
        id: 'cust-admin-studio',
        email: 'admin@zayneessence.com',
        phone: '+234 803 000 0000',
        name: 'zayneessence Studio Admin',
        authMethod: 'email_magic_link',
        role: 'admin',
        savedAddresses: [],
      };
      persistSession(adminSession);
      return;
    }
    persistSession({
      ...session,
      role: session.role === 'admin' ? 'customer' : 'admin',
    });
  };

  const saveAddress = (address: CustomerAddress) => {
    if (!session) return;
    const exists = session.savedAddresses.some((a) => a.id === address.id);
    const updated = exists
      ? session.savedAddresses.map((a) => (a.id === address.id ? address : a))
      : [...session.savedAddresses, address];
    persistSession({
      ...session,
      savedAddresses: updated,
    });
  };

  const removeAddress = (addressId: string) => {
    if (!session) return;
    persistSession({
      ...session,
      savedAddresses: session.savedAddresses.filter((a) => a.id !== addressId),
    });
  };

  const value = useMemo(
    () => ({
      session,
      signInWithPhoneOtp,
      signInWithMagicLink,
      signOut,
      toggleAdminRole,
      saveAddress,
      removeAddress,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
