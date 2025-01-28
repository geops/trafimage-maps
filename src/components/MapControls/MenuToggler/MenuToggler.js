import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@mui/styles";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import MapButton from "../../MapButton";
import { ReactComponent as MenuOpen } from "../../../img/sbb/040_hamburgermenu_102_36.svg";
import { ReactComponent as MenuClosed } from "../../../img/sbb/040_schliessen_104_36.svg";
import { setDisplayMenu } from "../../../model/app/actions";

const useStyles = makeStyles({
  displayMenuToggler: { padding: "8px" },
});

function MenuToggler({ children, ...props }) {
  const classes = useStyles();
  const { t } = useTranslation();
  const displayMenu = useSelector((state) => state.app.displayMenu);
  const dispatch = useDispatch();

  return (
    <MapButton
      className={`wkp-display-menu-toggler ${classes.displayMenuToggler}`}
      onClick={() => dispatch(setDisplayMenu(!displayMenu))}
      title={displayMenu ? t("Schliessen") : t("Menü")}
      data-testid="map-controls-menu-toggler"
      {...props}
    >
      {children ?? (displayMenu ? <MenuClosed /> : <MenuOpen />)}
    </MapButton>
  );
}

MenuToggler.propTypes = {
  children: PropTypes.node,
};

export default MenuToggler;
