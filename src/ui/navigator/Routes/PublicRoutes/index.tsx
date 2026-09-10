import type { RouteObject } from "react-router";

import { PUBLIC_PAGES } from "Pages";
import { PUBLIC_PATHS } from "Constants";
import PublicLayout from "Navigator/Layouts/PublicLayout";

const PUBLIC_ROUTES: RouteObject = {
  children: [{ element: <PUBLIC_PAGES.SignIn />, path: PUBLIC_PATHS.SIGN_IN }],
  element: <PublicLayout />,
};

export default PUBLIC_ROUTES;
