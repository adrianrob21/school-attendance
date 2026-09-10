import Api from "Api";
import { app } from "ReduxStore/reducers";

import type {
  ActionType,
  ErrorType,
  NextType,
  PayloadType,
  SetLoadingTypes,
} from "./types";

const setLoading = ({ isLoading, next, options }: SetLoadingTypes) => {
  if (!options.key) return;

  const value = isLoading ? options.value || true : false;

  next({
    payload: { [options.key]: value },
    type: app.actions.updateAppProps.type,
  });
};

const apiMiddleware = () => {
  return (next: NextType) => (action: ActionType) => {
    const { actions = {}, promise, type, ...rest } = action;

    const {
      fail,
      finallyActions,
      load = { key: "processing" },
      success,
    } = actions;

    setLoading({ isLoading: true, next, options: load });

    if (type !== Api.API_CALL) {
      return next(action);
    }

    return promise
      .then((payload: PayloadType) => {
        if (success && success.type) {
          return next({ ...rest, payload: payload?.data, ...success });
        }
      })
      .catch((error: ErrorType) => {
        const response = error?.response;

        if (fail && fail.type) {
          return next({
            ...rest,
            ...response,
            error,
            ...fail,
          });
        }
      })
      .finally(() => {
        setLoading({ isLoading: false, next, options: load });
        if (finallyActions && finallyActions.type) {
          return next({ ...rest, ...finallyActions });
        }
      });
  };
};

export { apiMiddleware };
