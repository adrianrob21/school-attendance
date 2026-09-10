import { createBrowserRouter } from "react-router";

import { ROOT_PATH } from "Constants";

import PUBLIC_ROUTES from "./Routes/PublicRoutes";
import PRIVATE_ROUTES from "./Routes/PrivateRoutes";

export default createBrowserRouter([
  {
    children: [PUBLIC_ROUTES, PRIVATE_ROUTES],
    path: ROOT_PATH,
  },
]);
