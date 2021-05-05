import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Feature from 'ol/Feature';
import { makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import Link from '../../components/Link';
import TarifverbundkarteLayer from '../../layers/TarifverbundkarteLayer';

const useStyles = makeStyles(() => ({
  zoneNumber: {
    color: '#888',
    fontSize: 12,
  },
  divider: {
    border: '1px solid #f5f5f5',
  },
}));

const propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
  layer: PropTypes.instanceOf(TarifverbundkarteLayer).isRequired,
};

const TarifverbundkartePopup = ({ feature, layer }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const properties = feature.getProperties();
  const { zPass, zones } = properties;

  useEffect(() => {
    return () => {
      /**
       * The layer selction is removed on unmount if the feature hasn't changed
       * (when the popup is closed with the "x"-Button).
       */
      if (layer.selectedZone?.get('id') === feature.get('id')) {
        layer.removeSelection();
      }
    };
  });

  if (!zones && !zPass?.tarifverbund_urls) {
    return null;
  }

  return (
    <div className="wkp-tarifverbundkarte-popup">
      {zones?.map((tarifZone, idx, array) => {
        return (
          <div key={tarifZone.id}>
            <div>
              {tarifZone.tarifverbund_urls ? (
                <Link href={tarifZone.tarifverbund_urls}>
                  {tarifZone.verbund}
                </Link>
              ) : (
                <span>{tarifZone.verbund}</span>
              )}
            </div>
            <div className={classes.zoneNumber}>
              {`${t('Zone')} ${tarifZone.zone}`}
            </div>
            {(idx !== array.length - 1 || zPass) && (
              <hr className={classes.divider} />
            )}
          </div>
        );
      })}
      {zPass?.tarifverbund_urls && (
        <div key="z-pass">
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
