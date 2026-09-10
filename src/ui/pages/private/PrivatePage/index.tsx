import { useTranslation } from "react-i18next";
import { useNavigate, type NavigateFunction } from "react-router";

const goBack = (navigate: NavigateFunction) => {
  navigate(-1);
};

const PrivatePage = () => {
  const navigate = useNavigate();
  const { t: translate } = useTranslation("general");

  return (
    <div className="flex flex-col mt-4 w-full items-center gap-4">
      <h1 className="text-center text-2xl">{translate("demo.privatePage")}</h1>
      <button
        aria-label={translate("common.back")}
        onClick={goBack.bind(null, navigate)}
        type="button"
      >
        <span aria-hidden="true">←</span>
      </button>
    </div>
  );
};

export default PrivatePage;
