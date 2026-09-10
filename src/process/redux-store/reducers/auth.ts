import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { AuthState, SignInForm, SignUpForm } from "./types";

const emptySignIn = (): SignInForm => ({ password: "", username: "" });
const emptySignUp = (): SignUpForm => ({
  confirmPassword: "",
  email: "",
  password: "",
  username: "",
});

const initialState: AuthState = {
  isAuthenticated: false,
  signInForm: emptySignIn(),
  signUpForm: emptySignUp(),
};

const logInAction = (state: AuthState) => {
  state.isAuthenticated = true;
};

const logOutAction = () => initialState;

const updateSignInFormAction = (
  state: AuthState,
  action: PayloadAction<Partial<SignInForm>>,
) => {
  state.signInForm = {
    ...emptySignIn(),
    ...state.signInForm,
    ...action.payload,
  };
};

const updateSignUpFormAction = (
  state: AuthState,
  action: PayloadAction<Partial<SignUpForm>>,
) => {
  state.signUpForm = {
    ...emptySignUp(),
    ...state.signUpForm,
    ...action.payload,
  };
};

export const authSlice = createSlice({
  initialState,
  name: "auth",
  reducers: {
    logIn: logInAction,
    logOut: logOutAction,
    updateSignInForm: updateSignInFormAction,
    updateSignUpForm: updateSignUpFormAction,
  },
});

export const { logIn, logOut, updateSignInForm, updateSignUpForm } =
  authSlice.actions;
export default authSlice;
