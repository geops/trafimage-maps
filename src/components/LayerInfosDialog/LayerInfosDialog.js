import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';
import Layer from 'react-spatial/layers/Layer';
import Dialog from '../Dialog';
import layerInfos from '../../layerInfos';

const propTypes = {
  selectedForInfos: PropTypes.object,
  appRef: PropTypes.object,
};

const defaultProps = {
  selectedForInfos: null,
  appRef: null,
};

export const NAME = 'infoDialog';

function LayerInfosDialog(props) {
  const language = useSelector(state => state.app.language);
  const { t } = useTranslation();
  const { selectedForInfos, appRef } = props;

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

  const [width, height] =
    appRef && appRef.className
      ? appRef.className
          .split(' ')
          .filter(c => /tm-w-|tm-h-/.test(c))
          .map(c => c.slice(c.length - 1))
      : [];

  return (
    <Dialog
      isDraggable
      isModal={['xs', 's'].includes(height) && ['xs', 's'].includes(width)}
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
