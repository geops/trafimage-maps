import React from 'react';
import PropTypes from 'prop-types';
import { Feature } from 'ol';
import { useTranslation } from 'react-i18next';
import SchmalspurLayer from '../../layers/SchmalspurLayer';
import IsbPopup from '../IsbPopup';

function SchmalspurPopup({ feature, layer }) {
  const { i18n } = useTranslation();
  const tuNummer = feature.get('isb_tu_nummer');
  const tuDetails = layer.tuInfos[tuNummer];
  const href = tuDetails?.[`url_${i18n.language}`];

  // We feed the feature to fit ISB popup behavior.
  feature.set(`url_isb_${i18n.language}`, JSON.stringify([href]));
  feature.set('isb_tu_name', tuDetails?.name);
  layer.set('shortToLongName', {
    [tuDetails?.name]: tuDetails?.long_name,
  });

  return <IsbPopup feature={feature} layer={layer} />;
}

SchmalspurPopup.propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
  layer: PropTypes.instanceOf(SchmalspurLayer).isRequired,
};

export default React.memo(SchmalspurPopup);
