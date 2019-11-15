import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';
import Layer from 'react-spatial/layers/Layer';
import Dialog from '../Dialog';
import layerInfos from '../../layerInfos';

const propTypes = {
  selectedForInfos: PropTypes.object,
};

const defaultProps = {
  selectedForInfos: null,
};

export const NAME = 'infoDialog';

const getLegendUrl = (legendUrl, language) => {
  const src = legendUrl || '';
  return /{language}/.test(legendUrl)
    ? src.replace('{language}', language)
    : src;
};

function LayerInfosDialog(props) {
  const language = useSelector(state => state.app.language);
  const { t } = useTranslation();
  const { selectedForInfos } = props;

  if (!selectedForInfos) {
    return null;
  }

  const componentName =
    selectedForInfos instanceof Layer
      ? selectedForInfos.get('layerInfoComponent')
      : selectedForInfos.layerInfoComponent;

  let body;
  if (componentName) {
    const LayerInfoComponent = layerInfos[componentName];
    body = <LayerInfoComponent language={language} />;
  } else if (selectedForInfos instanceof Layer) {
    body = (
      <Trans
        i18nKey={selectedForInfos.get('description') || ''}
        components={[
          <img
            src={getLegendUrl(selectedForInfos.get('legendUrl'), language)}
            draggable="false"
            alt={t('Kein Bildtext')}
          />,
        ]}
      />
    );
  } else {
    body = (
      <Trans
        i18nKey={selectedForInfos.description || ''}
        components={[
          <img
            src={getLegendUrl(selectedForInfos.legendUrl, language)}
            draggable="false"
            alt={t('Kein Bildtext')}
          />,
        ]}
      />
    );
  }

  return (
    <Dialog
      isDraggable
      cancelDraggable=".tm-dialog-body"
      name={NAME}
      title={<span>{t('Informationen')}</span>}
      body={body}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    />
  );
}

LayerInfosDialog.propTypes = propTypes;
LayerInfosDialog.defaultProps = defaultProps;

export default LayerInfosDialog;
