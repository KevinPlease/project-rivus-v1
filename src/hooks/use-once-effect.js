import { useRef } from "react";
import { useUpdateEffect } from "./use-update-effect";

export const useOnceEffect = (effect, dependencies = []) => {
  const hasRunOnce = useRef(false);

  useUpdateEffect(() => {
      if (!hasRunOnce.current) {
        hasRunOnce.current = true;
        return effect();

      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    dependencies);
};
