import { createContext, useContext, useEffect, useMemo } from "react";
import { Api } from "src/api";
import { Env } from "src/env";
import { useTokens } from "src/hooks";
import jwtDecode from "jwt-decode";

const expOffset = 1000 * 60;
export const useApiContext = (env: Env) => {
  const { tokens, updateTokens } = useTokens();
  const api = useMemo(
    () => new Api(env.apiEndpoint, updateTokens),
    [env.apiEndpoint, updateTokens]
  );
  useEffect(() => {
    api.setTokens(tokens);
    const { accessToken } = tokens;
    if (!accessToken) return;
    const { exp } = jwtDecode<{ exp: number }>(accessToken);
    const expireTime = exp * 1000 - expOffset;
    const currTime = new Date().getTime();
    if (expireTime < currTime) {
      api.refetchAccessToken();
      return;
    }
    const regTimeout = setTimeout(
      () => api.refetchAccessToken(),
      expireTime - currTime
    );
    return () => clearTimeout(regTimeout);
  }, [api, tokens]);
  return api;
};

export const ApiContext = createContext<ReturnType<typeof useApiContext>>(
  null as any
);

export const useApi = () => useContext(ApiContext);
