import React from 'react';
import { IconButton } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { ReactComponent as MenuOpenImg } from '../../img/sbb/040_hamburgermenu_102_36.svg';
import { ReactComponent as MenuClosedImg } from '../../img/sbb/040_schliessen_104_36.svg';
import { setDisplayMenu } from '../../model/app/actions';

function MenuToggleButton() {
  const dispatch = useDispatch();
  const displayMenu = useSelector((state) => state.app.displayMenu);

  return (
    <IconButton
      className="wkp-menu-toggler"
      onClick={() => dispatch(setDisplayMenu(!displayMenu))}
      size="medium"
    >
      {displayMenu ? <MenuClosedImg /> : <MenuOpenImg />}
    </IconButton>
  );
}

MenuToggleButton.propTypes = {};

export default MenuToggleButton;
