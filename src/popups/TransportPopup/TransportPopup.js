import React from 'react';
import PropTypes from 'prop-types';
import Feature from 'ol/Feature';
import { withTranslation } from 'react-i18next';
import { compose } from 'lodash/fp';

import TransportPopupContent from './TransportPopupContent';

const propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
};

const defaultProps = {};

const TransportPopup = ({ feature }) => {
  // TODO Eva nicht hier, vorher
  // const { clickedFeatureInfo } = useSelector(state => state.app);

  // if (!clickedFeatureInfo || !clickedFeatureInfo.length) {
  //   return null;
  // }

  // const { coordinate, features, layer } = clickedFeatureInfo[0];
  // const feature = features[0];

  // // Styleguidist try to load every file in the folder if we don't put index.js
  // const PopupComponent = React.lazy(() =>
  //   import(`../../popups/${popupComponents[info.layer.getKey()]}/index.js`),
  // );

  // return (
  //   <PopupComponent
  //     key={layer.getKey()}
  //     feature={feature}
  //   />
  // );

  const name = feature.get('name');
  const uic = feature.get('didok') + 8500000;

  return <TransportPopupContent name={name} uic={uic} />;
};

TransportPopup.propTypes = propTypes;
TransportPopup.defaultProps = defaultProps;

export default compose(withTranslation())(TransportPopup);
