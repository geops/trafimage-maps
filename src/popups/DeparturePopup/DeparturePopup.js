import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Feature from 'ol/Feature';
import { useSelector, useDispatch } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { setFeatureInfo } from '../../model/app/actions';

import DeparturePopupContent from './DeparturePopupContent';

const propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
};

const defaultProps = {};

let returnToNetzkarte = false;

const DeparturePopup = ({ feature }) => {
  const dispatch = useDispatch();
  const featureInfo = useSelector((state) => state.app.featureInfo);
  const layerService = useSelector((state) => state.app.layerService);
  const name = feature.get('name');
  const platform = feature.get('platform');
  const uic = parseFloat(feature.get('sbb_id'));

  const openNetzkartePopup = () => {
    const netkarteFeature = { ...featureInfo[0] };
    const stationsLayer = layerService.getLayer('ch.sbb.netzkarte.stationen');
    netkarteFeature.layer = stationsLayer;
    dispatch(setFeatureInfo([netkarteFeature]));
  };

  useEffect(() => {
    return () => {
      if (returnToNetzkarte) {
        // Re-open NetzkartePopup on popup close.
        openNetzkartePopup();
        returnToNetzkarte = false;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <DeparturePopupContent name={name} uic={uic} platform={platform} />;
};

DeparturePopup.propTypes = propTypes;
DeparturePopup.defaultProps = defaultProps;

const composed = withTranslation()(DeparturePopup);
composed.renderTitle = (feat, t) => {
  const platform = feat.get('platform');
  if (platform) {
    return `${feat.get('name')} (${t('abfahrtszeiten_kante')} ${platform})`;
  }
  return feat.get('name');
};
// Trigerred on popup close with close button only.
composed.onCloseBtClick = () => {
  returnToNetzkarte = true;
};

export default composed;
