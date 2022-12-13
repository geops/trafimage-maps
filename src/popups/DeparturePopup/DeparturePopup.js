import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Feature from 'ol/Feature';
import { useSelector, useDispatch } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { setFeatureInfo } from '../../model/app/actions';
import LayerService from '../../utils/LayerService';
import DeparturePopupContent from './DeparturePopupContent';

const propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
  coordinate: PropTypes.arrayOf(PropTypes.number).isRequired,
};

const defaultProps = {};

let returnToNetzkarte = false;

function DeparturePopup({ feature, coordinate }) {
  const dispatch = useDispatch();
  const layers = useSelector((state) => state.map.layers);
  const platform = feature.get('platform');
  const uic = parseFloat(feature.get('sbb_id'));

  const openNetzkartePopup = () => {
    dispatch(
      setFeatureInfo([
        {
          features: [feature],
          coordinate,
          layer: new LayerService(layers).getLayer(
            'ch.sbb.netzkarte.stationen',
          ),
        },
      ]),
    );
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

  return <DeparturePopupContent uic={uic} platform={platform} showTitle />;
}

DeparturePopup.propTypes = propTypes;
DeparturePopup.defaultProps = defaultProps;

const composed = withTranslation()(DeparturePopup);
composed.renderTitle = (feat, layer, t) => {
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
