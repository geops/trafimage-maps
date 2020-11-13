import React, { useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { FaTrash } from 'react-icons/fa';
import LayerTree from 'react-spatial/components/LayerTree';
import LayerService from 'react-spatial/LayerService';
import { setDialogVisible } from '../../model/app/actions';
import DrawButton from '../DrawButton';
import { NAME } from '../DrawRemoveDialog';
import SharePermalinkButton from '../SharePermalinkButton';

function DrawLayerMenu({ layerService }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const drawLayer = useSelector((state) => state.map.drawLayer);
  const drawIds = useSelector((state) => state.app.drawIds);

  const titles = useMemo(() => {
    return {
      layerShow: t('Layer anzeigen'),
      layerHide: t('Layer verbergen'),
    };
  }, [t]);

  const onRemoveClick = useCallback(() => {
    dispatch(setDialogVisible(NAME));
  }, [dispatch]);

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
          renderItemContent={(layer, layerTreeComp) => (
            <>
              {layerTreeComp.renderItemContent(layer)}
              <SharePermalinkButton />
              <DrawButton />
              <div
                role="button"
                tabIndex="0"
                title={t('Open confirmation dialog to delete draw')}
                onClick={onRemoveClick}
                onKeyPress={onRemoveClick}
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
