import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { FaLink, FaPencilAlt, FaTrash } from 'react-icons/fa';
import LayerTree from 'react-spatial/components/LayerTree';
import LayerService from 'react-spatial/LayerService';

function DrawLayerMenu({ layerService }) {
  const { t } = useTranslation();
  const drawLayer = useSelector((state) => state.map.drawLayer);

  const titles = useMemo(() => {
    return {
      layerShow: t('Layer anzeigen'),
      layerHide: t('Layer verbergen'),
    };
  }, [t]);

  return (
    <div className="wkp-draw-layer-menu">
      <div className="wkp-layer-tree">
        <LayerTree
          isItemHidden={(layer) => layer !== drawLayer}
          layerService={layerService}
          titles={titles}
          t={t}
          renderItemContent={(layer, layerTreeComp) => (
            <>
              {layerTreeComp.renderItemContent(layer)}
              <div
                role="button"
                tabIndex="0"
                title={t('Open tootlip with shared links')}
              >
                <FaLink focusable={false} />
              </div>
              <div
                role="button"
                tabIndex="0"
                title={t('Open mapset in edit mode')}
              >
                <FaPencilAlt />
              </div>
              <div
                role="button"
                tabIndex="0"
                title={t('Open confirmation dialog to delete draw')}
              >
                <FaTrash />
              </div>
            </>
          )}
        />
      </div>
    </div>
  );
}

DrawLayerMenu.propTypes = {
  layerService: PropTypes.instanceOf(LayerService).isRequired,
};

export default React.memo(DrawLayerMenu);
