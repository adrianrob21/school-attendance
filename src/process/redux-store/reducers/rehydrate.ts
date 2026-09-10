import { createSlice } from "@reduxjs/toolkit";

const rehydrateSlice = createSlice({
  initialState: { isRehydrated: false },
  name: "rehydrate",
  reducers: {
    rehydrated: (state) => {
      state.isRehydrated = true;
    },
  },
});

export const { rehydrated } = rehydrateSlice.actions;
export default rehydrateSlice;
