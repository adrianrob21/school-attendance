import { get, set } from "idb-keyval";

import type { RootState } from "../types";
import type { CreatePersistMiddlewareType } from "./types";

const KEY = "storage";
const VERSION = 1;
const DEBOUNCE_MS = 500;

const migrations = {
  1: (state: RootState) => state,
};

const loadState = async () => {
  const persisted: { _version: number; state: RootState } | undefined =
    await get(KEY);

  if (!persisted) return undefined;

  let { _version, state } = persisted;

  while (_version < VERSION) {
    _version++;
    state = migrations[_version as keyof typeof migrations](state);
  }

  return state;
};

const isNotBlacklisted = (blackList: string[], [key]: [string, unknown]) =>
  !blackList.includes(key);

const createPersistMiddleware = ({
  blackList,
}: CreatePersistMiddlewareType) => {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let pendingState: unknown = null;

  const flush = () => {
    if (pendingState !== null) {
      void set(KEY, { _version: VERSION, state: pendingState });
      pendingState = null;
    }
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
  };

  if (typeof window !== "undefined") {
    window.addEventListener("beforeunload", flush);

    window.addEventListener("pagehide", flush);
  }

  return (store: any) => (next: any) => (action: any) => {
    const result = next(action);

    const fullState = store.getState();
    pendingState = Object.fromEntries(
      Object.entries(fullState).filter(isNotBlacklisted.bind(null, blackList)),
    );

    if (timer !== null) clearTimeout(timer);
    timer = setTimeout(flush, DEBOUNCE_MS);

    return result;
  };
};

export { createPersistMiddleware, loadState };
