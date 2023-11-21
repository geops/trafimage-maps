import React from 'react';
import PropTypes from 'prop-types';
import Feature from 'ol/Feature';
import { useSelector } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { Typography, Link } from '@material-ui/core';
import { ReactComponent as LinkIcon } from '../../components/Link/Link.svg';

const propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
  t: PropTypes.func.isRequired,
};

const defaultProps = {};

function PassagierFrequenzenPopup({ feature, t }) {
  const language = useSelector((state) => state.app.language);

  const statisticDate = feature.get('passagier_freq_jahr');
  const dwv = feature
    .get('dwv')
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '\u2009');
  const remark = feature.get(`passagier_freq_bemerkungen_${language}`);
  const evu = feature.get(`passagier_freq_evu_${language}`);
  const url = feature.get(`passagier_freq_url`);

  return (
    <div className="wkp-passagier-freq-popup">
      <div className="wkp-passagier-freq-popup-body">
        <Typography>{t('passagier_freq_anzahl')}</Typography>
        <Typography paragraph>{`${dwv} ${t(
          'Ein- und Aussteigende',
        )}`}</Typography>
        <Typography paragraph>
          {t('passagier_freq_jahr')} {statisticDate}
        </Typography>
        {evu ? <Typography paragraph>{evu}</Typography> : null}
        {remark ? (
          <Typography paragraph>
            <i>{remark}</i>
          </Typography>
        ) : null}
        {url ? (
          <Typography>
            {t('Detaillierter Datensatz auf')}{' '}
            <Link
              href={url}
              rel="noopener noreferrer"
              target="_blank"
              style={{ textDecoration: 'none' }}
            >
              data.sbb.ch <LinkIcon />
            </Link>
          </Typography>
        ) : null}
      </div>
    </div>
  );
}

PassagierFrequenzenPopup.propTypes = propTypes;
PassagierFrequenzenPopup.defaultProps = defaultProps;

const composed = withTranslation()(PassagierFrequenzenPopup);

composed.renderTitle = (feat) => feat.get('name');
export default composed;
