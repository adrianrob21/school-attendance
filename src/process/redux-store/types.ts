import { configureStore } from "@reduxjs/toolkit";

import type { createStore } from ".";
import { app, auth, rehydrate } from "./reducers";

const _typeStore = configureStore({
  reducer: {
    app: app.reducer,
    auth: auth.reducer,
    rehydrate: rehydrate.reducer,
  },
});

export type AppStore = Awaited<ReturnType<typeof createStore>>;
export type RootState = ReturnType<typeof _typeStore.getState>;
export type DispatchType = typeof _typeStore.dispatch;
