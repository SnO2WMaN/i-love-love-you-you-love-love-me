import { useMemo } from "react";
import { useLocation } from "react-router";

export const useURLParams = (key: string) => {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search).get(key), [search, key]);
};
