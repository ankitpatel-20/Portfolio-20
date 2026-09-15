import { useState, useEffect } from 'react';

export const ADMIN_EMAIL = 'ankitpatel11411@gmail.com';
export const DEFAULT_ADMIN_PASSWORD = '@nKiTp@TeL22';
const AUTH_STORAGE_KEY = 'ankit_admin_auth';
const CUSTOM_PWD_KEY = 'ankit_custom_admin_pwd';
const AUTH_EVENT_NAME = 'ankit_admin_auth_changed';

export const getStoredAdminPassword = (): string => {
  try {
    return localStorage.getItem(CUSTOM_PWD_KEY) || DEFAULT_ADMIN_PASSWORD;
  } catch {
    return DEFAULT_ADMIN_PASSWORD;
  }
};

export const setStoredAdminPassword = (newPassword: string): void => {
  try {
    localStorage.setItem(CUSTOM_PWD_KEY, newPassword.trim());
  } catch (e) {
    console.error('Failed to store admin password:', e);
  }
};

export const resetAdminPasswordToDefault = (): void => {
  try {
    localStorage.removeItem(CUSTOM_PWD_KEY);
  } catch (e) {
    console.error('Failed to reset admin password:', e);
  }
};

export const checkAdminPassword = (inputPassword: string): boolean => {
  const activePassword = getStoredAdminPassword();
  return inputPassword.trim() === activePassword.trim();
};

export const isAdminAuthenticated = (): boolean => {
  try {
    return (
      sessionStorage.getItem(AUTH_STORAGE_KEY) === 'true' ||
      localStorage.getItem(AUTH_STORAGE_KEY) === 'true'
    );
  } catch {
    return false;
  }
};

export const setAdminAuthenticated = (auth: boolean): void => {
  try {
    if (auth) {
      sessionStorage.setItem(AUTH_STORAGE_KEY, 'true');
      localStorage.setItem(AUTH_STORAGE_KEY, 'true');
    } else {
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch (e) {
    console.error('Failed to set admin auth storage:', e);
  }

  // Notify all components across the app
  try {
    window.dispatchEvent(new Event(AUTH_EVENT_NAME));
  } catch (e) {
    // ignore in non-browser environments
  }
};

export const loginAdmin = (): void => setAdminAuthenticated(true);
export const logoutAdmin = (): void => setAdminAuthenticated(false);

export const useAdminAuth = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(() => isAdminAuthenticated());

  useEffect(() => {
    const handleAuthChange = () => {
      setIsAdmin(isAdminAuthenticated());
    };

    window.addEventListener(AUTH_EVENT_NAME, handleAuthChange);
    window.addEventListener('storage', handleAuthChange);

    return () => {
      window.removeEventListener(AUTH_EVENT_NAME, handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  const login = (password: string): { success: boolean; error?: string } => {
    if (checkAdminPassword(password)) {
      setAdminAuthenticated(true);
      return { success: true };
    }
    return { success: false, error: 'Incorrect Admin Password. Access denied.' };
  };

  const logout = () => {
    setAdminAuthenticated(false);
  };

  return {
    isAdmin,
    login,
    logout,
    adminEmail: ADMIN_EMAIL,
  };
};
