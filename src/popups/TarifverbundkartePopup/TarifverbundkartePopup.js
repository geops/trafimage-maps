import React from 'react';
import PropTypes from 'prop-types';
import Feature from 'ol/Feature';
import { useTranslation } from 'react-i18next';
import Link from '../../components/Link';
import './TarifverbundkartePopup.scss';

const propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
};

const TarifverbundkartePopup = ({ feature }) => {
  const { t } = useTranslation();
  const properties = feature.getProperties();
  const municipality = properties.name;
  const tarifGroup = properties.partners;
  const tarifGroupUrl = properties.tarifverbund_urls;
  const tarifZone = properties.zone?.zone;
  const zPass = properties.zPass?.partners;
  const zPassUrl = properties.zPass?.tarifverbund_urls;

  return (
    <div className="wkp-tarifverbundkarte-popup">
      <div className="wkp-tarifverbundkarte-popup-cell-head">
        {`${t('Gemeinde')}:`}
      </div>
      <div className="wkp-tarifverbundkarte-popup-cell">{municipality}</div>
      {tarifGroup && (
        <>
          <div className="wkp-tarifverbundkarte-popup-cell-head">
            {`${t('Verbund')}:`}
          </div>
          <div className="wkp-tarifverbundkarte-popup-cell">
            {tarifGroupUrl ? (
              <Link href={tarifGroupUrl}>{tarifGroup}</Link>
            ) : (
              `${tarifGroup}`
            )}
          </div>
        </>
      )}
      {tarifZone && (
        <>
          <div className="wkp-tarifverbundkarte-popup-cell-head">
            {`${t('Zone')}:`}
          </div>
          <div className="wkp-tarifverbundkarte-popup-cell">{tarifZone}</div>
        </>
      )}
      {properties.zPass && (
        <>
          <div className="wkp-tarifverbundkarte-popup-cell-head">
            {`${t('Z-Pass')}:`}
          </div>
          <div className="wkp-tarifverbundkarte-popup-cell">
            <Link href={zPassUrl}>{zPass}</Link>
          </div>
        </>
      )}
    </div>
  );
};

TarifverbundkartePopup.propTypes = propTypes;

const memoized = React.memo(TarifverbundkartePopup);
memoized.hideHeader = () => true;

export default memoized;
