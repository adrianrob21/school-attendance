import { useTranslation } from "react-i18next";
import type { i18n as I18nInstance } from "i18next";

import usePublicPageState from "./state";

const changeLanguage = (i18n: I18nInstance, language: string) => {
  i18n.changeLanguage(language);
};

const callAction = (action: () => void) => {
  action();
};

const PublicPage = () => {
  const { actions, state } = usePublicPageState();

  const { i18n, t: translate } = useTranslation();

  const { value } = state;
  const { decrement, increment, incrementByAmount, incrementWithSaga } =
    actions;

  return (
    <div>
      <h1 className={"text-9xl"}>{value}</h1>

      <div className={"text-2xl flex flex-col gap-2"}>
        <button onClick={callAction.bind(null, increment)}>
          {translate("general:increment")}
        </button>
        <button onClick={callAction.bind(null, decrement)}>
          {translate("general:decrement")}
        </button>
        <button onClick={incrementByAmount.bind(null, 10)}>
          {translate("general:incrementByAmount")}
        </button>

        <button onClick={incrementWithSaga.bind(null, 10)}>
          {translate("general:incrementWithSaga")}
        </button>
      </div>

      <div className="flex flex-col gap-3 items-center mt-5">
        <h1 className="text-3xl">
          {translate("general:currentLanguage", { language: i18n.language })}
        </h1>
        <button
          className="bg-blue-900 text-white w-fit p-2"
          onClick={changeLanguage.bind(null, i18n, "en")}
        >
          {translate("general:changeLanguageEN")}
        </button>
        <button
          className="bg-blue-900 text-white w-fit p-2"
          onClick={changeLanguage.bind(null, i18n, "ro")}
        >
          {translate("general:changeLanguageRO")}
        </button>
      </div>
    </div>
  );
};

export default PublicPage;
