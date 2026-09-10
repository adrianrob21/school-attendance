import { createBrowserRouter } from "react-router";

import {
  CALENDAR_PATH,
  COMPONENT_PREVIEW_PATH,
  GROUP_SELECTION_PATH,
  ROOT_PATH,
  STUDENTS_PATH,
  TODAY_PATH,
  WELCOME_PATH,
} from "Constants";
import Today from "Pages/Today";
import Welcome from "Pages/Welcome";
import Calendar from "Pages/Calendar";
import Students from "Pages/Students";
import GroupSelection from "Pages/GroupSelection";
import ComponentPreview from "Pages/ComponentPreview";

import PUBLIC_ROUTES from "./Routes/PublicRoutes";
import PRIVATE_ROUTES from "./Routes/PrivateRoutes";

export default createBrowserRouter([
  {
    children: [
      { element: <GroupSelection />, index: true },
      { element: <GroupSelection />, path: GROUP_SELECTION_PATH },
      { element: <ComponentPreview />, path: COMPONENT_PREVIEW_PATH },
      { element: <Welcome />, path: WELCOME_PATH },
      { element: <Students />, path: STUDENTS_PATH },
      { element: <Today />, path: TODAY_PATH },
      { element: <Calendar />, path: CALENDAR_PATH },
      PUBLIC_ROUTES,
      PRIVATE_ROUTES,
    ],
    path: ROOT_PATH,
  },
]);
