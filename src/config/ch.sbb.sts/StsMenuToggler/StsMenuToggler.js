import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import MenuToggler from "../../../components/MapControls/MenuToggler";
import useHasScreenSize from "../../../utils/useHasScreenSize";
import { ReactComponent as MenuOpen } from "../../../img/sbb/040_hamburgermenu_102_36.svg";
import { ReactComponent as SearchIcon } from "../../../components/Search/Search.svg";

function getProps(isMobile, displayMenu, t) {
  return isMobile
    ? {
        icon: !displayMenu ? <MenuOpen /> : <SearchIcon />,
        title: !displayMenu ? t("Menü") : t("Suchen"),
        style: { padding: 8 },
      }
    : {}; // On desktop fall back to default values
}

function StsMenuToggler() {
  const { t } = useTranslation();
  const isMobile = useHasScreenSize(["xs"]);
  const displayMenu = useSelector((state) => state.app.displayMenu);
  const properties = getProps(isMobile, displayMenu, t);

  return (
    <MenuToggler title={properties.title} style={properties.style}>
      {properties.icon}
    </MenuToggler>
  );
}

export default StsMenuToggler;
