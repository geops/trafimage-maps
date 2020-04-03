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

function LayerInfosDialog(props) {
  const language = useSelector((state) => state.app.language);
  const { t } = useTranslation();
  const { selectedForInfos } = props;

  if (!selectedForInfos) {
    return null;
  }

  const componentName =
    selectedForInfos instanceof Layer
      ? selectedForInfos.get('layerInfoComponent')
      : selectedForInfos.layerInfoComponent;

  const description =
    selectedForInfos instanceof Layer
      ? selectedForInfos.get('description')
      : selectedForInfos.description;

  let body;
  if (componentName) {
    const LayerInfoComponent = layerInfos[componentName];
    body = (
      <LayerInfoComponent language={language} properties={selectedForInfos} />
    );
  } else if (description) {
    body = <Trans i18nKey={description} />;
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
