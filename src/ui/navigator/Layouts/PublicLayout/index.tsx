import { useSelector } from "react-redux";
import type { Location } from "react-router";
import { Navigate, Outlet, useLocation } from "react-router";

import { PRIVATE_PATHS } from "Constants";
import type { RootState } from "ReduxStore";

const PublicLayout = () => {
  const location = useLocation();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  if (isAuthenticated) {
    const from = (location.state as { from?: Location } | null)?.from;

    return <Navigate replace to={from ?? PRIVATE_PATHS.DASHBOARD} />;
  }

  return (
    <div>
      <h1 className="text-3xl text-center">This is the PUBLIC LAYOUT</h1>
      <Outlet />
    </div>
  );
};

export default PublicLayout;
