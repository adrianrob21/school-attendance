import type { RouteObject } from "react-router";

import { PRIVATE_PAGES } from "Pages";
import { PRIVATE_PATHS } from "Constants";
import PrivateLayout from "Navigator/Layouts/PrivateLayout";

const PRIVATE_ROUTES: RouteObject = {
  children: [
    { element: <PRIVATE_PAGES.Dashboard />, path: PRIVATE_PATHS.DASHBOARD },
    { element: <PRIVATE_PAGES.PrivatePage />, path: PRIVATE_PATHS.PRIVATE },
  ],
  element: <PrivateLayout />,
};

export default PRIVATE_ROUTES;
