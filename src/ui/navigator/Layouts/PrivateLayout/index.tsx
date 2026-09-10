import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router";

import { ROOT_PATH } from "Constants";
import type { RootState } from "ReduxStore";

const PrivateLayout = () => {
  const location = useLocation();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: location }} to={ROOT_PATH} />;
  }

  return (
    <div>
      <h1 className="text-3xl text-center">This is the PRIVATE LAYOUT</h1>
      <Outlet />
    </div>
  );
};

export default PrivateLayout;
