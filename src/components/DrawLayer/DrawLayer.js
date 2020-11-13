import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaLink, FaPencilAlt, FaTrash } from 'react-icons/fa';

function DrawLayer() {
  const { t } = useTranslation();
  return (
    <div className="rs-layer-tree-item ">
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label
        className="rs-layer-tree-input rs-layer-tree-input-checkbox rs-checkbox"
        tabIndex="-1"
        title={t('Show Draw layer')}
        aria-label={t('Show Draw layer')}
      >
        <input type="checkbox" tabIndex="-1" readOnly="" />
        <span />
      </label>
      <div
        role="button"
        tabIndex="0"
        className="rs-layer-tree-toggle"
        title="Gemeindegrenzen Unterlayer anzeigen"
        aria-expanded="false"
        aria-label="Gemeindegrenzen Unterlayer anzeigen"
      >
        <div>{t('Draw layer')}</div>
      </div>
      <span />
      <div
        role="button"
        tabIndex="0"
        title={t('Open tootlip with shared links')}
      >
        <FaLink focusable={false} />
      </div>
      <div role="button" tabIndex="0" title={t('Open mapset in edit mode')}>
        <FaPencilAlt />
      </div>
      <div
        role="button"
        tabIndex="0"
        title={t('Open confirmation dialog to delete draw')}
      >
        <FaTrash />
      </div>
    </div>
  );
}

export default React.memo(DrawLayer);
