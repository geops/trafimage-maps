import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';
import Dialog from '../Dialog';
import layerInfos from '../../layerInfos';

const propTypes = {
  style: PropTypes.object,
  isDraggable: PropTypes.bool,
  selectedForInfos: PropTypes.object,
  staticFilesUrl: PropTypes.string,
};

const defaultProps = {
  style: undefined,
  isDraggable: true,
  selectedForInfos: null,
  staticFilesUrl: null,
};

export const NAME = 'infoDialog';

function LayerInfosDialog(props) {
  const language = useSelector((state) => state.app.language);
  const { t } = useTranslation();
  const { style, isDraggable, selectedForInfos, staticFilesUrl } = props;
  if (!selectedForInfos) {
    return null;
  }

  let component = null;
  let description = null;

  // use ducktyping instead of `instanceof` since the layer may be created
  // outside this bundle
  if (selectedForInfos.isReactSpatialLayer) {
    component = selectedForInfos.get('layerInfoComponent');
    description = selectedForInfos.get('description');
  } else {
    component = selectedForInfos.layerInfoComponent;
    description = selectedForInfos.description;
  }

  let body;

  if (component) {
    const LayerInfoComponent =
      typeof component === 'string' ? layerInfos[component] : component;
    body = (
      <LayerInfoComponent
        language={language}
        properties={selectedForInfos}
        staticFilesUrl={staticFilesUrl}
        t={t}
      />
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
      title={
        <span>{t(`${selectedForInfos.name || selectedForInfos.key}`)}</span>
      }
      body={<div>{body}</div>}
      style={style}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    />
  );
}

LayerInfosDialog.propTypes = propTypes;
LayerInfosDialog.defaultProps = defaultProps;

export default LayerInfosDialog;
