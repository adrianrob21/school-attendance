import { useNavigate, type NavigateFunction } from "react-router";

import { ROOT_PATH, PRIVATE_PATHS } from "Constants";

import useDashboardState from "./state";

const goToPrivate = (navigate: NavigateFunction) => {
  navigate(PRIVATE_PATHS.PRIVATE);
};

const logoutAndRedirect = (logOut: () => void, navigate: NavigateFunction) => {
  logOut();
  navigate(ROOT_PATH, { replace: true });
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { actions } = useDashboardState();
  const { logOut } = actions;

  return (
    <div className="flex flex-col mt-4 w-full items-center gap-4">
      <h1 className="text-center text-2xl">Dashboard</h1>
      <div className="flex gap-4">
        <button onClick={goToPrivate.bind(null, navigate)} type="button">
          Go to Private page
        </button>
        <button
          onClick={logoutAndRedirect.bind(null, logOut, navigate)}
          type="button"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
