import { statusQuery } from '@/apis/status';
import { useQuery } from '@tanstack/react-query';
import { createContext, useContext, useEffect, useState } from 'react';

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
    console.log('data', data);
    setIsAuthenticated(data?.data?.status === 1);
  }, [data]);

  return <AuthContext.Provider value={{ isAuthenticated }}>{children}</AuthContext.Provider>;
};
