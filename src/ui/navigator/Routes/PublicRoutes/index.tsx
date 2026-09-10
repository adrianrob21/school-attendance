import type { RouteObject } from "react-router";

import { PUBLIC_PAGES } from "Pages";
import PublicLayout from "Navigator/Layouts/PublicLayout";

const PUBLIC_ROUTES: RouteObject = {
  children: [{ element: <PUBLIC_PAGES.SignIn />, index: true }],
  element: <PublicLayout />,
};

export default PUBLIC_ROUTES;
