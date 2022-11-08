import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { FaPencilAlt } from 'react-icons/fa';
import MenuItem from '../../components/Menu/MenuItem';
import Draw from '../../components/Draw';
import { isOpenedByMapset } from '../../utils/redirectHelper';

let shouldScroll = isOpenedByMapset();

function DrawMenu() {
  const activeTopic = useSelector((state) => state.app.activeTopic);
  const menuOpen = useSelector((state) => state.app.menuOpen);
  const collapsedOnLoad = useMemo(() => {
    return activeTopic.elements.drawMenu?.collapsedOnLoad || false;
  }, [activeTopic]);
  const [collapsed, setCollapsed] = useState(false);
  const { t } = useTranslation();
  const ref = useRef();

  // When we open the page from mapset we want that the drawMenu was avalaible in the view.
  useEffect(() => {
    let timeout;
    if (shouldScroll && ref.current) {
      // We use a timeout because of the animation of the TopicsMenu
      timeout = window.setTimeout(() => {
        ref.current.scrollIntoView(false);
        shouldScroll = false;
      }, 500);
    }
    return () => {
      window.clearTimeout(timeout);
    };
  }, [ref]);

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
        className="wkp-draw-menu"
        title={t('Zeichnen auf der Karte')}
        icon={<FaPencilAlt focusable={false} />}
        collapsed={collapsed}
        onCollapseToggle={(c) => setCollapsed(c)}
        fixedHeight={130}
      >
        <Draw />
      </MenuItem>
    </div>
  );
}

export default React.memo(DrawMenu);
