import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import MenuToggler from "../../../components/MapControls/MenuToggler";
import useHasScreenSize from "../../../utils/useHasScreenSize";
import { ReactComponent as MenuOpen } from "../../../img/sbb/040_hamburgermenu_102_36.svg";
import { ReactComponent as SearchIcon } from "../../../components/Search/Search.svg";
import MapButton from "../../../components/MapButton";
import { setDisplayMenu } from "../../../model/app/actions";

function StsMenuToggler() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const isMobile = useHasScreenSize(["xs"]);
  const displayMenu = useSelector((state) => state.app.displayMenu);

  return !isMobile ? (
    <MenuToggler />
  ) : (
    <MapButton
      onClick={() => dispatch(setDisplayMenu(!displayMenu))}
      title={t("Suchen")}
      style={{ padding: 8 }}
    >
      {displayMenu ? <SearchIcon /> : <MenuOpen />}
    </MapButton>
  );
}

export default StsMenuToggler;
