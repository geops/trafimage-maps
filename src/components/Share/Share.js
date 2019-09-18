import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Map from 'ol/Map';
import { TiImage, TiSocialFacebook, TiSocialTwitter } from 'react-icons/ti';
import { FaEnvelope } from 'react-icons/fa';
import CanvasSaveButton from 'react-spatial/components/CanvasSaveButton';
import BlankLink from 'react-spatial/components/BlankLink';
import SharePermalinkButton from '../SharePermalinkButton';
import './Share.scss';

const propTypes = {
  map: PropTypes.instanceOf(Map).isRequired,
};

const defaultProps = {};

const socialShareConfig = [
  {
    url: 'mailto:?body={url}',
    title: 'Per Email teilen.',
    icon: <FaEnvelope focusable={false} />,
    className: 'ta-mail-icon',
  },
  {
    url: '//www.facebook.com/sharer.php?u={url}',
    title: 'Auf Facebook teilen.',
    icon: <TiSocialFacebook focusable={false} />,
    className: 'ta-facebook-icon',
  },
  {
    url: '//twitter.com/intent/tweet?url={url}',
    title: 'Twittern.',
    icon: <TiSocialTwitter focusable={false} />,
    className: 'ta-twitter-icon',
  },
];
const renderConf = (conf, t) => (
  <div className={conf.className} key={conf.title}>
    <BlankLink href={conf.url} title={t(conf.title)}>
      {conf.icon}
    </BlankLink>
  </div>
);

const Share = ({ map }) => {
  const { t } = useTranslation();
  const config = [...socialShareConfig];

  for (let i = 0; i < config.length; i += 1) {
    if (config[i].url) {
      config[i].url = config[i].url.replace('{url}', window.location.href);
    }
  }

  return (
    <div className="wkp-share">
      <SharePermalinkButton />
      {renderConf(config[0], t)}
      <CanvasSaveButton title={t('Karte als Bild speichern')} map={map}>
        <TiImage focusable={false} />
      </CanvasSaveButton>
      {renderConf(config[1], t)}
      {renderConf(config[2], t)}
    </div>
  );
};

Share.propTypes = propTypes;
Share.defaultProps = defaultProps;

export default React.memo(Share);
