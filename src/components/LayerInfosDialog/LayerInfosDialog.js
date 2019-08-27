import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';
import Layer from 'react-spatial/layers/Layer';
import Dialog from '../Dialog';

const propTypes = {
  layer: PropTypes.instanceOf(Layer),
};

const defaultProps = {
  layer: null,
};

export const NAME = 'layerInfos';

function LayerInfosDialog({ layer }) {
  const language = useSelector(state => state.app.language);
  const { t } = useTranslation();

  if (!layer) {
    return null;
  }

  return (
    <Dialog
      name={NAME}
      title={<span>{t('Informationen')}</span>}
      body={
        <div>
          <Trans
            i18nKey={layer.get('description')}
            components={[
              <img
                src={(layer.get('legendUrl') || '').replace(
                  '{language}',
                  language,
                )}
                draggable="false"
                alt={t('Kein Bildtext')}
              ></img>,
            ]}
          ></Trans>
        </div>
      }
    />
  );
}

LayerInfosDialog.propTypes = propTypes;
LayerInfosDialog.defaultProps = defaultProps;

export default LayerInfosDialog;
