import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core';

const propTypes = {
  properties: PropTypes.object.isRequired,
  staticFilesUrl: PropTypes.string.isRequired,
};

const useStyles = makeStyles(() => ({
  legend: {
    display: 'table',
    marginTop: '1em',

    '& img': {
      verticalAlign: 'middle',
      paddingRight: 10,
    },
  },
}));

const ZweitausbildungLayerInfo = ({ properties, staticFilesUrl }) => {
  const { t } = useTranslation();
  const { infos } = properties.get('zweitausbildung');
  const { title, legend } = infos;
  const classes = useStyles();

  return (
    <div>
      <p>{t(title)}</p>
      {legend ? (
        <div className={classes.legend}>
          <img
            src={`${staticFilesUrl}/img/layers/zweitausbildung/${legend.image}`}
            draggable="false"
            alt={t('Kein Bildtext')}
          />
          {t(legend.name)}
        </div>
      ) : null}
      <p>
        {t('Datengrundlage')}:
        <br />
        <a
          href="http://espace.sbb.ch/teams/526/1775/_layouts/DocIdRedir.aspx?ID=T0526-1440065995-48"
          rel="noopener noreferrer"
          target="_blank"
        >
          {t('Link Übersichtsliste Geografie im Produkte-eSpace VM HR-BIL')}
        </a>
      </p>
      <p>
        {t('Aktualisierungs-Zyklus')}:
        <br />
        {t(
          'Gemäss Life Cycle Management des Produktemanagements von HR-BIL-SKK(-PM)',
        )}
      </p>
      <p>
        {t('Verantwortlich')}:
        <br />
        {t('HR-BIL-SKK-PM (VM und VS)')},
        <br />
        <a href="mailto:pm.skk.kbc@sbb.ch">pm.skk.kbc@sbb.ch</a>.
      </p>
    </div>
  );
};

ZweitausbildungLayerInfo.propTypes = propTypes;

export default ZweitausbildungLayerInfo;
