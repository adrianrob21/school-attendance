import { all } from "redux-saga/effects";

import appWatchers from "./app/watchers";

export default function* rootSaga() {
  yield all([...appWatchers]);
}
