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
    overflowY: 'auto',
    height: 120,
    boxShadow: '-1px 1px 2px rgba(0, 0, 0, 0.4)',
  },
}));

function ZweitausbildungRoutesSubLayerInfo({ properties, staticFilesUrl }) {
  const { t } = useTranslation();
  const { infos } = properties.get('zweitausbildung');
  const { title, desc, legend } = infos;
  const classes = useStyles();

  return (
    <div>
      <p>{t(title)}</p>
      <p>{t(desc)}</p>
      <div className={classes.legend}>
        <img
          src={`${staticFilesUrl}/img/layers/zweitausbildung/${legend.image}`}
          draggable="false"
          alt={t('Kein Bildtext')}
        />
      </div>
    </div>
  );
}

ZweitausbildungRoutesSubLayerInfo.propTypes = propTypes;

export default ZweitausbildungRoutesSubLayerInfo;
