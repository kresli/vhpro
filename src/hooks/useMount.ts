import { EffectCallback, useEffect, useRef } from "react";

export const useMount = (effect?: EffectCallback) => {
  const isMountedRef = useRef(true);
  useEffect(() => {
    isMountedRef.current = true;
    effect?.();
    return () => {
      isMountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return isMountedRef;
};
