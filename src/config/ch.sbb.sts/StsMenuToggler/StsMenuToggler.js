import React from "react";
import { useSelector } from "react-redux";
import useTranslation from "../../../utils/useTranslation";
import MenuToggler from "../../../components/MapControls/MenuToggler";
import useHasScreenSize from "../../../utils/useHasScreenSize";
import { ReactComponent as MenuOpen } from "../../../img/sbb/040_hamburgermenu_102_36.svg";
import { ReactComponent as SearchIcon } from "../../../components/Search/Search.svg";

function StsMenuToggler() {
  const { t } = useTranslation();
  const isMobile = useHasScreenSize(["xs"]);
  const displayMenu = useSelector((state) => state.app.displayMenu);

  return (
    <MenuToggler
      {...(isMobile
        ? {
            children: !displayMenu ? <MenuOpen /> : <SearchIcon />,
            title: !displayMenu ? t("Menü") : t("Suchen"),
            style: { padding: 8 },
          }
        : {})}
    />
  );
}

export default StsMenuToggler;
