import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import LayerTree from 'react-spatial/components/LayerTree';
import InfosButton from '../InfosButton';

function DrawLayerMenu() {
  const { t } = useTranslation();
  const layers = useSelector((state) => state.map.layers);
  const drawLayer = useSelector((state) => state.map.drawLayer);
  const drawIds = useSelector((state) => state.app.drawIds);

  const titles = useMemo(() => {
    return {
      layerShow: t('Layer anzeigen'),
      layerHide: t('Layer verbergen'),
    };
  }, [t]);

  if (!drawIds) {
    return null;
  }

  return (
    <div className="wkp-draw-layer-menu">
      <div className="wkp-layer-tree">
        <LayerTree
          isItemHidden={(layer) => layer !== drawLayer}
          renderItemContent={(layer, layerTreeComp) => (
            <>
              {layer.renderItemContent
                ? layer.renderItemContent(layerTreeComp)
                : layerTreeComp.renderItemContent(layer)}
              {layer.get('hasInfos') && <InfosButton selectedInfo={layer} />}
            </>
          )}
          layers={layers}
          titles={titles}
          t={t}
        />
      </div>
    </div>
  );
}

export default React.memo(DrawLayerMenu);
