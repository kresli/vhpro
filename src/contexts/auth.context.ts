import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { Permission, User } from "src/types";
import { useMount } from "src/hooks";
import { UseApiContext } from ".";

export function useAuthContext({ api }: UseApiContext) {
  const [user, setUser] = useState<User>();

  const fetchUser = useCallback(async () => {
    const { data } = await api.getUser();
    if (data) setUser(data);
  }, [api]);

  useMount(() => {
    fetchUser();
  });

  const signIn = useCallback(
    async (creds: { email: string; password: string }) => {
      const { data } = await api.login(creds);
      const { user } = data;
      setUser(user);
    },
    [api]
  );
  const signOut = useCallback(async () => {}, []);
  const isSigned = useMemo(() => !!user, [user]);
  const isAdmin = useMemo(
    () => user?.permissions.includes(Permission.ADMIN) || false,
    [user?.permissions]
  );
  return { signIn, signOut, user, isSigned, isAdmin };
}

export const AuthContext = createContext<ReturnType<typeof useAuthContext>>(
  null as any
);

export const useAuth = () => useContext(AuthContext);
