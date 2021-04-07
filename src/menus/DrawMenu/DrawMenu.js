import { memo, useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaPencilAlt } from 'react-icons/fa';
import MenuItem from '../../components/Menu/MenuItem';
import Draw from '../../components/Draw';
import { isOpenedByMapset } from '../../utils/redirectHelper';

let shouldScroll = isOpenedByMapset();

function DrawMenu() {
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

  return (
    <div ref={ref} id="test">
      <MenuItem
        open
        title={t('Zeichnen auf der Karte')}
        icon={<FaPencilAlt focusable={false} />}
        collapsed={collapsed}
        onCollapseToggle={(c) => setCollapsed(c)}
      >
        <Draw />
      </MenuItem>
    </div>
  );
}

export default memo(DrawMenu);
