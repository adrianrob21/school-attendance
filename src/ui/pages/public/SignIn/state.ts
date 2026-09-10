import { useMemo } from "react";
import { bindActionCreators } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

import type { DispatchType, RootState } from "ReduxStore";
import { updateSignInForm, logIn } from "ReduxStore/reducers/auth";

const useSignInState = () => {
  const state = useSelector((state: RootState) => state.auth.signInForm);

  const dispatch = useDispatch<DispatchType>();

  const actions = useMemo(
    () => bindActionCreators({ logIn, updateSignInForm }, dispatch),
    [dispatch],
  );

  return { actions, state };
};

export default useSignInState;
