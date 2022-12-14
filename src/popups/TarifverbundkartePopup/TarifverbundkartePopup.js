import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import Feature from 'ol/Feature';
import { makeStyles, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import Link from '../../components/Link';
import TarifverbundkarteLayer from '../../layers/TarifverbundkarteLayer';
// import capitalizeFirstLetter from '../../utils/capitalizeFirstLetter';

const useStyles = makeStyles(() => ({
  zoneNumber: {
    color: '#888',
    fontSize: 12,
  },
  divider: {
    border: '1px solid #f5f5f5',
  },
  partnerLink: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    margin: '5px 0',
  },
  partnerColor: {
    width: 10,
    height: 10,
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
  const { zPass, zones, partners_json: partners } = properties;
  const verbunde = useMemo(() => JSON.parse(partners), [partners]);

  useEffect(() => {
    layer.set('clicked', false);
    return () => {
      /**
       * When the unmount happens due to a click on the map (with the clicked property === true),
       * the deselection is handled in TarifverbundkarteLayer. If the "x"-Button in the popup is clicked
       * it is handled here.
       * @ignore
       */
      if (!layer.get('clicked')) {
        layer.removeSelection();
      }
    };
  });

  if (!zones && !zPass?.tarifverbund_urls) {
    return null;
  }

  return (
    <div className="wkp-tarifverbundkarte-popup">
      {verbunde?.length ? (
        <>
          <Typography variant="h4">
            <b>{t(`Tarifverbunde in ${feature.get('name')}`)}</b>
          </Typography>
          {verbunde.map((v) => {
            console.log(v);
            return (
              <div className={classes.partnerLink}>
                <div
                  className={classes.partnerColor}
                  style={{
                    backgroundColor: v.colour ? `#${v.colour}` : 'black',
                  }}
                />
                <Link href={v.url}>{v.name}</Link>
              </div>
            );
          })}
          <br />
        </>
      ) : null}
      {zones ? (
        <>
          <Typography variant="h4">
            <b>{t('Ausgewählte Zonen')}</b>
          </Typography>
          {zones.map((tarifZone, idx, array) => {
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
        </>
      ) : null}
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
