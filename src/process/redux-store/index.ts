import createSagaMiddleware from "redux-saga";
import { configureStore } from "@reduxjs/toolkit";

import rootSaga from "Sagas";

import {
  createLoggerMiddleware,
  createPersistMiddleware,
  loadState,
} from "./middlewares";
import { app, rehydrate, auth } from "./reducers";
import { rehydrated } from "./reducers/rehydrate";

const sagaMiddleware = createSagaMiddleware();

export const createStore = async () => {
  const preloadedState = await loadState();

  const store = configureStore({
    reducer: {
      app: app.reducer,
      auth: auth.reducer,
      rehydrate: rehydrate.reducer,
    },
    preloadedState,
    middleware: (getDefault) =>
      getDefault({ serializableCheck: false }).concat(
        createPersistMiddleware({ blackList: [] }),
        createLoggerMiddleware(),
        sagaMiddleware,
      ),
  });

  sagaMiddleware.run(rootSaga);
  store.dispatch(rehydrated());

  return store;
};

export type { AppStore, RootState, DispatchType } from "./types";
