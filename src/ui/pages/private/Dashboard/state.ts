import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { bindActionCreators } from "@reduxjs/toolkit";

import type { DispatchType } from "ReduxStore";
import { logOut } from "ReduxStore/reducers/auth";

const useDashboardState = () => {
  const dispatch = useDispatch<DispatchType>();

  const actions = useMemo(
    () => bindActionCreators({ logOut }, dispatch),
    [dispatch],
  );

  return { actions };
};

export default useDashboardState;
