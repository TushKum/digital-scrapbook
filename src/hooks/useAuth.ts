import { useCallback, useEffect, useState } from 'react';
import type { AuthUser } from '../lib/api';
import { ApiError, fetchMe, getAuthToken, login as apiLogin, setAuthToken } from '../lib/api';

export type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated';

// Session management: validates a stored token on load, exposes login/logout.
export function useAuth() {
  const [status, setStatus] = useState<AuthStatus>(() => (getAuthToken() ? 'checking' : 'unauthenticated'));
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loginPending, setLoginPending] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Revalidate a persisted token against the API on mount.
  useEffect(() => {
    if (!getAuthToken()) return;
    const controller = new AbortController();
    fetchMe(controller.signal)
      .then((u) => {
        setUser(u);
        setStatus('authenticated');
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        setAuthToken(null);
        setStatus('unauthenticated');
      });
    return () => controller.abort();
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    setLoginPending(true);
    setLoginError(null);
    try {
      const res = await apiLogin(username, password);
      setAuthToken(res.token);
      setUser(res.user);
      setStatus('authenticated');
    } catch (err) {
      setLoginError(err instanceof ApiError ? err.message : 'Unable to reach the server');
    } finally {
      setLoginPending(false);
    }
  }, []);

  const logout = useCallback(() => {
    setAuthToken(null);
    setUser(null);
    setLoginError(null);
    setStatus('unauthenticated');
  }, []);

  return { status, user, loginPending, loginError, login, logout };
}
