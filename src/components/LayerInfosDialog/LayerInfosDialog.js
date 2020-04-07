import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';
import Layer from 'react-spatial/layers/Layer';
import Dialog from '../Dialog';
import layerInfos from '../../layerInfos';

const propTypes = {
  style: PropTypes.object,
  isDraggable: PropTypes.bool,
  selectedForInfos: PropTypes.object,
};

const defaultProps = {
  style: undefined,
  isDraggable: true,
  selectedForInfos: null,
};

export const NAME = 'infoDialog';

function LayerInfosDialog(props) {
  const language = useSelector((state) => state.app.language);
  const { t } = useTranslation();
  const { style, isDraggable, selectedForInfos } = props;

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
    body = (
      <div>
        <Trans i18nKey={description} />
      </div>
    );
  }

  return (
    <Dialog
      isDraggable={isDraggable}
      cancelDraggable=".tm-dialog-body"
      name={NAME}
      title={<span>{t('Informationen')}</span>}
      body={body}
      style={style}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    />
  );
}

LayerInfosDialog.propTypes = propTypes;
LayerInfosDialog.defaultProps = defaultProps;

export default LayerInfosDialog;
