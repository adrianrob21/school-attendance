import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

import { GroupCarousel } from "Components";
import { KINDERGARTEN_GROUPS } from "Constants";
import type { GroupOption } from "Components/GroupCarousel/types";

import "./GroupSelection.css";

const GroupSelection = () => {
  const navigate = useNavigate();
  const { t: translate } = useTranslation("general");
  const groups = KINDERGARTEN_GROUPS.map((group) => ({
    ...group,
    name: translate(group.nameKey),
  }));

  const enterGroup = (group: GroupOption) => {
    const selectedGroup = KINDERGARTEN_GROUPS.find(({ id }) => id === group.id);

    if (selectedGroup) navigate(selectedGroup.welcomePath);
  };

  return (
    <main className="group-selection meadow-background">
      <div className="group-selection__content">
        <header className="group-selection__header">
          <h1>{translate("groupSelection.title")}</h1>
          <p>{translate("groupSelection.subtitle")}</p>
        </header>

        <GroupCarousel
          groups={groups}
          labels={{
            region: translate("groupSelection.carousel"),
            enterGroup: translate("groupSelection.enterGroup"),
            previous: translate("groupSelection.previous"),
            next: translate("groupSelection.next"),
            selectGroup: (name) =>
              translate("groupSelection.selectGroup", { name }),
            position: (current, total) =>
              translate("groupSelection.position", { current, total }),
          }}
          onEnterGroup={enterGroup}
        />
      </div>

      <footer className="group-selection__footer">
        {translate("groupSelection.footer")}
      </footer>
    </main>
  );
};

export default GroupSelection;
