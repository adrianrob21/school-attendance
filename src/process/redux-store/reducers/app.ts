import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { updateProps } from "ReduxStore/utils";

import type { AppState } from "./types";

const initialState: AppState = {
  value: 0,
};

const incrementAction = (state: AppState) => {
  state.value += 1;
};

const decrementAction = (state: AppState) => {
  if (state.value > 0) {
    state.value -= 1;
  }
};

const incrementByAmountAction = (
  state: AppState,
  action: PayloadAction<number>,
) => {
  const number = action.payload;

  state.value += number;
};

export const appSlice = createSlice({
  initialState,
  name: "app",
  reducers: {
    decrement: decrementAction,
    increment: incrementAction,
    incrementByAmount: incrementByAmountAction,
    incrementWithSaga: () => {},
    updateAppProps: updateProps,
  },
});

export const {
  decrement,
  increment,
  incrementByAmount,
  incrementWithSaga,
  updateAppProps,
} = appSlice.actions;

export default appSlice;
