import { useMemo } from "react";
import { bindActionCreators } from "@reduxjs/toolkit";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

import {
  decrement,
  increment,
  incrementByAmount,
  incrementWithSaga,
} from "ReduxStore/reducers/app";
import type { DispatchType, RootState } from "ReduxStore";

const usePublicPageState = () => {
  const state = useSelector(
    (state: RootState) => ({ value: state.app.value }),
    shallowEqual,
  );

  const dispatch = useDispatch<DispatchType>();

  const actions = useMemo(
    () =>
      bindActionCreators(
        {
          decrement,
          increment,
          incrementByAmount,
          incrementWithSaga,
        },
        dispatch,
      ),
    [dispatch],
  );

  return { actions, state };
};

export default usePublicPageState;
