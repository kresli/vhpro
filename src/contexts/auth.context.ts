import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { Api } from "src/api";
import jwtDecode from "jwt-decode";
import { Permission, User } from "src/types";
import { useMount } from "src/hooks";

export function useAuthContext(api: Api) {
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
