import React, { useState, useEffect, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { FaShareAlt } from "react-icons/fa";
import Share from "../../components/Share";
import MenuItem from "../../components/Menu/MenuItem";

function ShareMenu() {
  const activeTopic = useSelector((state) => state.app.activeTopic);
  const menuOpen = useSelector((state) => state.app.menuOpen);
  const collapsedOnLoad = useMemo(() => {
    return activeTopic.elements.drawMenu?.collapsedOnLoad || false;
  }, [activeTopic]);
  const [collapsed, setCollapsed] = useState(false);
  const { t } = useTranslation();
  const ref = useRef();

  useEffect(() => {
    // Open menu item when loading/switching topic
    if (menuOpen) {
      setCollapsed(collapsedOnLoad);
    }
  }, [menuOpen, collapsedOnLoad]);

  return (
    <div ref={ref}>
      <MenuItem
        open
        fixedHeight={375}
        className="wkp-share-menu"
        title={t("Teilen")}
        icon={<FaShareAlt focusable={false} />}
        collapsed={collapsed}
        onCollapseToggle={(c) => setCollapsed(c)}
      >
        <Share />
      </MenuItem>
    </div>
  );
}

export default React.memo(ShareMenu);
