import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Navigate, Outlet, useLocation } from "react-router";

import { PUBLIC_PATHS } from "Constants";
import type { RootState } from "ReduxStore";

const PrivateLayout = () => {
  const location = useLocation();
  const { t: translate } = useTranslation("general");
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  if (!isAuthenticated) {
    return (
      <Navigate replace state={{ from: location }} to={PUBLIC_PATHS.SIGN_IN} />
    );
  }

  return (
    <div>
      <h1 className="text-3xl text-center">{translate("demo.privateLayout")}</h1>
      <Outlet />
    </div>
  );
};

export default PrivateLayout;
