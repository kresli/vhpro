import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Permission, User } from "src/types";
import { useTokens } from "src/hooks";
import { UseApiContext } from ".";
import jwtDecode from "jwt-decode";

function useAccessTokenTimeout(
  accessToken: string | null,
  callback: () => void
) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;
  const expOffset = 1000 * 60;

  useEffect(() => {
    if (!accessToken) return;
    const { exp } = jwtDecode<{ exp: number }>(accessToken);
    const expireTime = exp * 1000 - expOffset;
    const currTime = new Date().getTime();
    if (expireTime < currTime) {
      callbackRef.current();
      return;
    }
    const regTimeout = setTimeout(callbackRef.current, expireTime - currTime);
    return () => clearTimeout(regTimeout);
  }, [accessToken, expOffset]);
}

export function useAuthContext(
  api: UseApiContext,
  [tokens, setTokens]: ReturnType<typeof useTokens>
) {
  const [user, setUser] = useState<User>();
  const loading = useMemo(
    () => !!tokens.accessToken && !user,
    [tokens.accessToken, user]
  );
  useEffect(() => {
    if (tokens.accessToken && !user) {
      api.getUser().then(({ user }) => setUser(user));
    }
  }, [api, tokens.accessToken, user]);

  useAccessTokenTimeout(tokens.accessToken, async () => {
    const { accessToken } = await api.refetchAccessToken();
    setTokens({ ...tokens, accessToken });
  });

  const signIn = useCallback(
    async (creds: { email: string; password: string }) => {
      const { user, tokens } = await api.login(creds);
      setTokens(tokens);
      setUser(user);
    },
    [api, setTokens]
  );
  const signOut = useCallback(async () => {
    setTokens({ accessToken: null, refreshToken: null });
    api.logout();
  }, [api, setTokens]);
  const isSigned = useMemo(() => !!user, [user]);
  const isAdmin = useMemo(
    () => user?.permissions.includes(Permission.ADMIN) || false,
    [user?.permissions]
  );
  return { signIn, signOut, user, isAdmin, loading, isSigned };
}

export const AuthContext = createContext<ReturnType<typeof useAuthContext>>(
  null as any
);

export const useAuth = () => useContext(AuthContext);
