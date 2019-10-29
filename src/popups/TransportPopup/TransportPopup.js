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
  const name = feature.get('name');
  const uic = feature.get('didok') + 8500000;

  return <TransportPopupContent name={name} uic={uic} />;
};

TransportPopup.propTypes = propTypes;
TransportPopup.defaultProps = defaultProps;

export default compose(withTranslation())(TransportPopup);
