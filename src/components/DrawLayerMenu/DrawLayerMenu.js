import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import LayerTree from 'react-spatial/components/LayerTree';

function DrawLayerMenu() {
  const { t } = useTranslation();
  const layerService = useSelector((state) => state.app.layerService);
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
          layerService={layerService}
          titles={titles}
          t={t}
        />
      </div>
    </div>
  );
}

export default React.memo(DrawLayerMenu);
