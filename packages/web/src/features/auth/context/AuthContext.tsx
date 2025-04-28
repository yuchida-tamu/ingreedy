import { statusQuery } from '@/apis/status';
import { useQuery } from '@tanstack/react-query';
import { createContext, useContext, useEffect, useState } from 'react';

const AuthStatus = {
  UNAUTHENTICATED: 0,
  AUTHENTICATED: 1,
} as const;

type AuthContext = {
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContext>({
  isAuthenticated: false,
});

export const useAuth = () => {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data } = useQuery({
    queryKey: ['auth-status'],
    queryFn: statusQuery,
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(data?.data?.status === AuthStatus.AUTHENTICATED);
  }, [data]);

  return <AuthContext.Provider value={{ isAuthenticated }}>{children}</AuthContext.Provider>;
};
