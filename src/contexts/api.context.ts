import { createContext, useContext, useMemo } from "react";
import { Api } from "src/api";
import { Env } from "src/env";
import { useTokens } from "src/hooks";

export const useApiContext = (
  env: Env,
  [tokens]: ReturnType<typeof useTokens>
) =>
  useMemo(
    () =>
      new Api(env.apiEndpoint, {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      }),
    [env.apiEndpoint, tokens.accessToken, tokens.refreshToken]
  );

export type UseApiContext = ReturnType<typeof useApiContext>;

export const ApiContext = createContext<UseApiContext>(null as any);

export const useApi = () => useContext(ApiContext);
