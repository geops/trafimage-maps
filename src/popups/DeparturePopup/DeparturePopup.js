import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Feature from 'ol/Feature';
import { useSelector, useDispatch } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { setClickedFeatureInfo } from '../../model/app/actions';

import DeparturePopupContent from './DeparturePopupContent';

const propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
};

const defaultProps = {};

let returnToNetzkarte = false;

const DeparturePopup = ({ feature }) => {
  const dispatch = useDispatch();
  const { clickedFeatureInfo, layerService } = useSelector(state => state.app);
  const name = feature.get('name');
  const uic = parseFloat(feature.get('sbb_id'));

  const openNetzkartePopup = () => {
    const netkarteFeature = { ...clickedFeatureInfo[0] };
    const stationsLayer = layerService.getLayer('ch.sbb.netzkarte.stationen');
    netkarteFeature.layer = stationsLayer;
    dispatch(setClickedFeatureInfo([netkarteFeature]));
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

  return <DeparturePopupContent name={name} uic={uic} />;
};

DeparturePopup.propTypes = propTypes;
DeparturePopup.defaultProps = defaultProps;

const composed = withTranslation()(DeparturePopup);
composed.renderTitle = feat => feat.get('name');
// Trigerred on popup close with close button only.
composed.onCloseBtClick = () => {
  returnToNetzkarte = true;
};

export default composed;
