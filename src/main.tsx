import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import Navigator from "Navigator";

import "./index.css";
import "./process/locales";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Navigator />
  </StrictMode>,
);
