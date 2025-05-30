import { statusFetcher } from '@/domains/apis/status';
import { useQuery } from '@tanstack/react-query';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';

const AuthStatus = {
  UNAUTHENTICATED: 0,
  AUTHENTICATED: 1,
} as const;

type AuthContext = {
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
};

const AuthContext = createContext<AuthContext>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
});

export const useAuth = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

  const handleAuthenticated = useCallback(() => {
    flushSync(() => {
      setIsAuthenticated(true);
    });
  }, [setIsAuthenticated]);

  const handleUnauthenticated = useCallback(() => {
    flushSync(() => {
      setIsAuthenticated(false);
    });
  }, [setIsAuthenticated]);
  return { isAuthenticated, handleAuthenticated, handleUnauthenticated };
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data } = useQuery({
    queryKey: ['auth-status'],
    queryFn: statusFetcher,
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(data?.data?.status === AuthStatus.AUTHENTICATED);
  }, [data]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
