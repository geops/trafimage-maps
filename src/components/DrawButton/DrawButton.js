import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { FaPencilAlt } from 'react-icons/fa';

function DrawButton() {
  const mapsetUrl = useSelector((state) => state.app.mapsetUrl);
  const { t } = useTranslation();
  return (
    <div className="ta-draw-icon">
      <a
        href={`${mapsetUrl}?parent=${encodeURIComponent(window.location)}`}
        target="blank_"
        title={`${t('Zeichnen')}.`}
      >
        <FaPencilAlt focusable={false} />
      </a>
    </div>
  );
}

export default React.memo(DrawButton);
