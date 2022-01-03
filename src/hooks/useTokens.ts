import { useCallback, useEffect, useState } from "react";
import { Tokens } from "src/types";

const ACCESS_TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refresh_token";

function getLocalTokens() {
  return {
    accessToken: localStorage.getItem(ACCESS_TOKEN_KEY),
    refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY),
  };
}

export function useTokens() {
  const [tokens, setTokens] = useState(() => getLocalTokens());
  const { accessToken, refreshToken } = tokens;
  const updateTokens = useCallback((tokens: Tokens) => {
    setTokens(tokens);
    const { accessToken, refreshToken } = tokens;
    if (accessToken) {
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    } else {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
    }
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    } else {
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  }, []);
  useEffect(() => {
    const callback = () => {
      const stored = getLocalTokens();
      if (
        stored.accessToken === accessToken &&
        stored.refreshToken === refreshToken
      )
        return;
      setTokens(stored);
    };
    window.addEventListener("storage", callback);
    return () => window.removeEventListener("storage", callback);
  }, [accessToken, refreshToken]);
  return [tokens, updateTokens] as const;
}
