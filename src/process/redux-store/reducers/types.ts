export interface AppState {
  value: number;
}

export interface SignInForm {
  password: string;
  username: string;
}

export interface SignUpForm {
  confirmPassword: string;
  email: string;
  password: string;
  username: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  signInForm: SignInForm;
  signUpForm: SignUpForm;
}
