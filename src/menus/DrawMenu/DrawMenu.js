import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { FaPencilAlt } from 'react-icons/fa';
import MenuItem from '../../components/Menu/MenuItem';
import Draw from '../../components/Draw';
import { isOpenedByMapset } from '../../utils/redirectHelper';

let shouldScroll = isOpenedByMapset();

function DrawMenu({ collapsedOnLoad }) {
  const [collapsed, setCollapsed] = useState(collapsedOnLoad);
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
    // When switching topics
    setCollapsed(collapsedOnLoad);
  }, [collapsedOnLoad]);

  return (
    <div ref={ref} id="wkp-draw-menu">
      <MenuItem
        open
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

DrawMenu.propTypes = {
  collapsedOnLoad: PropTypes.bool,
};

DrawMenu.defaultProps = {
  collapsedOnLoad: false,
};

export default React.memo(DrawMenu);
