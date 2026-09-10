import type { PAGE } from "./types";
import SignIn from "./public/SignIn";
import SignUp from "./public/SignUp";
import Dashboard from "./private/Dashboard";
import PublicPage from "./public/PublicPage";
import PrivatePage from "./private/PrivatePage";

export const PUBLIC_PAGES: PAGE = {
  PublicPage,
  SignIn,
  SignUp,
};

export const PRIVATE_PAGES: PAGE = {
  Dashboard,
  PrivatePage,
};
