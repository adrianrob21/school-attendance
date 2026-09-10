import { useSelector } from "react-redux";
import type { Location } from "react-router";
import { useTranslation } from "react-i18next";
import { Navigate, Outlet, useLocation } from "react-router";

import { PRIVATE_PATHS } from "Constants";
import type { RootState } from "ReduxStore";

const PublicLayout = () => {
  const location = useLocation();
  const { t: translate } = useTranslation("general");
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  if (isAuthenticated) {
    const from = (location.state as { from?: Location } | null)?.from;

    return <Navigate replace to={from ?? PRIVATE_PATHS.DASHBOARD} />;
  }

  return (
    <div>
      <h1 className="text-3xl text-center">{translate("demo.publicLayout")}</h1>
      <Outlet />
    </div>
  );
};

export default PublicLayout;
