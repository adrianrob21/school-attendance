import { takeLatest } from "redux-saga/effects";

import { app } from "ReduxStore/reducers";

import { incrementWithSaga } from ".";

export default [
  takeLatest(app.actions.incrementWithSaga.type as any, incrementWithSaga),
];
