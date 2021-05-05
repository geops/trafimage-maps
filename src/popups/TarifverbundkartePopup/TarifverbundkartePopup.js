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
  const { zPass, zones } = properties;

  if (!zones && !zPass?.tarifverbund_urls) {
    return null;
  }

  return (
    <div className="wkp-tarifverbundkarte-popup">
      {zones?.map((tarifZone, idx, array) => {
        return (
          <div key={tarifZone.id}>
            <div className="wkp-tarifverbundkarte-tarifzone">
              {tarifZone.tarifverbund_urls ? (
                <Link href={tarifZone.tarifverbund_urls}>
                  {tarifZone.verbund}
                </Link>
              ) : (
                <span>{tarifZone.verbund}</span>
              )}
            </div>
            <div className="wkp-tarifverbundkarte-tarifzone-number">
              {`${t('Zone')} ${tarifZone.zone}`}
            </div>
            {(idx !== array.length - 1 || zPass) && <hr />}
          </div>
        );
      })}
      {zPass?.tarifverbund_urls && (
        <div key="z-pass" className="wkp-tarifverbundkarte-zpass">
          <Link href={zPass.tarifverbund_urls}>{zPass.partners}</Link>
        </div>
      )}
    </div>
  );
};

TarifverbundkartePopup.propTypes = propTypes;

const memoized = React.memo(TarifverbundkartePopup);
memoized.renderTitle = (feat) => feat.get('name');

export default memoized;
