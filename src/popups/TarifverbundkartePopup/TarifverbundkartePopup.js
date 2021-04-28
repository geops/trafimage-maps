import React from 'react';
import PropTypes from 'prop-types';
import Feature from 'ol/Feature';
import Link from '../../components/Link';
import './TarifverbundkartePopup.scss';

const propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
};

const TarifverbundkartePopup = ({ feature }) => {
  const zPass = feature.get('zPass')?.partners;
  const zone = feature.get('zone')?.zoneplan;
  return (
    <div className="wkp-tarifverbundkarte-popup">
      {zPass && <Link href="http://example.com/">{zPass}</Link>}
      {zone && <Link href="http://example.com/">{zone}</Link>}
    </div>
  );
};

TarifverbundkartePopup.propTypes = propTypes;

const memoized = React.memo(TarifverbundkartePopup);
memoized.renderTitle = (feat) => feat.get('name');

export default memoized;
