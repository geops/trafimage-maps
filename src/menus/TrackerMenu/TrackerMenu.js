import React from "react";
import { TiVideo } from "react-icons/ti";
import useTranslation from "../../utils/useTranslation";
import FeatureMenu from "../../components/FeatureMenu";

/**
 * Menu use to display feature info from punctuality layers.
 */
function TrackerMenu(props) {
  const { t } = useTranslation();

  return (
    <FeatureMenu
      {...props}
      property="useTrackerMenu"
      menuItemProps={{
        className: "wkp-tracker-menu",
        title: t("ch.sbb.puenktlichkeit"),
        icon: <TiVideo />,
      }}
    />
  );
}

export default React.memo(TrackerMenu);
