'use client';

import React, { createContext, useContext, useState, useCallback, useSyncExternalStore } from 'react';
import { 
  AGE_VERIFICATION_COOKIE_NAME, 
  AGE_VERIFICATION_EXPIRY_DAYS,
  MINIMUM_AGE 
} from '@/lib/constants';
import { calculateAge } from '@/lib/utils';

// Helper functions for cookie management (server-safe)
function getCookieValue(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const nameEQ = name + '=';
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length);
    }
  }
  return null;
}

function setCookieValue(name: string, value: string, days: number): void {
  if (typeof document === 'undefined') return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict;Secure`;
}

// Simple store for age verification state with subscribers
let subscribers: Array<() => void> = [];

function subscribe(callback: () => void) {
  subscribers.push(callback);
  return () => {
    subscribers = subscribers.filter(sub => sub !== callback);
  };
}

function getSnapshot(): boolean {
  if (typeof document === 'undefined') return false;
  return getCookieValue(AGE_VERIFICATION_COOKIE_NAME) === 'true';
}

function getServerSnapshot(): boolean {
  return false;
}

function notifySubscribers() {
  subscribers.forEach(callback => callback());
}

interface AgeVerificationContextType {
  isAgeVerified: boolean;
  showAgeGate: boolean;
  verifyAge: (birthDate: Date) => boolean;
  closeAgeGate: () => void;
  resetVerification: () => void;
}

const AgeVerificationContext = createContext<AgeVerificationContextType | undefined>(undefined);

export function AgeVerificationProvider({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  // Use useSyncExternalStore for cookie-based state
  const isVerifiedFromCookie = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  
  // Local state for UI control (derived from cookie state)
  const [forceShowGate, setForceShowGate] = useState(false);

  const verifyAge = useCallback((birthDate: Date): boolean => {
    const age = calculateAge(birthDate);
    
    if (age >= MINIMUM_AGE) {
      setCookieValue(AGE_VERIFICATION_COOKIE_NAME, 'true', AGE_VERIFICATION_EXPIRY_DAYS);
      setForceShowGate(false);
      notifySubscribers();
      return true;
    }
    
    return false;
  }, []);

  const closeAgeGate = useCallback(() => {
    setForceShowGate(false);
  }, []);

  const resetVerification = useCallback(() => {
    if (typeof document !== 'undefined') {
      document.cookie = `${AGE_VERIFICATION_COOKIE_NAME}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    }
    setForceShowGate(true);
    notifySubscribers();
  }, []);

  // Derive state from cookie
  const isAgeVerified = isVerifiedFromCookie;
  const showAgeGate = !isVerifiedFromCookie || forceShowGate;

  return (
    <AgeVerificationContext.Provider
      value={{
        isAgeVerified,
        showAgeGate,
        verifyAge,
        closeAgeGate,
        resetVerification,
      }}
    >
      {children}
    </AgeVerificationContext.Provider>
  );
}

export function useAgeVerification() {
  const context = useContext(AgeVerificationContext);
  if (context === undefined) {
    throw new Error('useAgeVerification must be used within an AgeVerificationProvider');
  }
  return context;
}
