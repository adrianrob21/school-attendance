import { put } from "redux-saga/effects";

import { updateAppProps } from "ReduxStore/reducers/app";

export const incrementWithSaga = function* ({ payload }: { payload: number }) {
  yield put({
    payload: {
      value: payload,
    },
    type: updateAppProps.type,
  });
};
