import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { safeFetch } from '../lib/fetchUtils';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithProvider: (provider: 'google' | 'microsoft' | 'apple') => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: any }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    safeFetch('/api/auth/session', { headers })
      .then(data => setUser(data.user || null))
      .catch((e) => {
        console.error('Session check failed:', e);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const data = await safeFetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (data.token) localStorage.setItem('auth_token', data.token);
      setUser(data.user);
    } catch (e: any) {
      console.error('Login error:', e);
      throw e;
    }
  };

  const loginWithProvider = async (provider: 'google' | 'microsoft' | 'apple') => {
    try {
      const { signInWith } = await import('../firebase');
      const result = await signInWith(provider);
      
      const data = await safeFetch('/api/auth/oauth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: result.idToken }),
      });
      
      if (data.token) localStorage.setItem('auth_token', data.token);
      setUser(data.user);
    } catch (error: any) {
      if (error.code === 'auth/unauthorized-domain' || error.message?.includes('unauthorized-domain') || error.message?.includes('auth/unauthorized-domain')) {
        const domain = window.location.hostname;
        console.error(`[Firebase] Domain "${domain}" is not authorized.`);
        throw new Error(`Domain not authorized. Please open Firebase Console and add "${domain}" to Authentication -> Settings -> Authorized Domains.`);
      }
      throw error;
    }
  };

  const logout = async () => {
    const token = localStorage.getItem('auth_token');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    try {
      await safeFetch('/api/auth/logout', { method: 'POST', headers });
    } catch(e) {
      console.error('Logout error:', e);
    }
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithProvider, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
