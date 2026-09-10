import { useTranslation } from "react-i18next";
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
  const { t: translate } = useTranslation("general");
  const { actions } = useDashboardState();
  const { logOut } = actions;

  return (
    <div className="flex flex-col mt-4 w-full items-center gap-4">
      <h1 className="text-center text-2xl">{translate("demo.dashboard")}</h1>
      <div className="flex gap-4">
        <button onClick={goToPrivate.bind(null, navigate)} type="button">
          {translate("demo.goToPrivatePage")}
        </button>
        <button
          onClick={logoutAndRedirect.bind(null, logOut, navigate)}
          type="button"
        >
          {translate("auth.logout")}
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
