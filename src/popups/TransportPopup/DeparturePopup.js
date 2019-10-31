import React from 'react';
import PropTypes from 'prop-types';
import Feature from 'ol/Feature';
import { withTranslation } from 'react-i18next';
import { compose } from 'lodash/fp';

import DeparturePopupContent from './DeparturePopupContent';

const propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
};

const defaultProps = {};

const DeparturePopup = ({ feature }) => {
  const name = feature.get('name');
  const uic = feature.get('didok') + 8500000;

  return <DeparturePopupContent name={name} uic={uic} />;
};

DeparturePopup.propTypes = propTypes;
DeparturePopup.defaultProps = defaultProps;

export default compose(withTranslation())(DeparturePopup);
