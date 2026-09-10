import type { PayloadAction } from "@reduxjs/toolkit";

const updateProps = (state: any, action: PayloadAction<string, any>) => {
  const { payload = {} } = action || {};

  return {
    ...state,
    ...payload,
  };
};

export { updateProps };
