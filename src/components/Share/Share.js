import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { TiImage, TiSocialFacebook, TiSocialTwitter } from 'react-icons/ti';
import { FaEnvelope } from 'react-icons/fa';
import CanvasSaveButton from 'react-spatial/components/CanvasSaveButton';
import BlankLink from '@geops/react-ui/components/BlankLink';
import SharePermalinkButton from '../SharePermalinkButton';

const socialShareConfig = [
  {
    url: 'mailto:?body={url}',
    title: 'Per Email versenden',
    icon: <FaEnvelope focusable={false} />,
    className: 'ta-mail-icon',
  },
  {
    url: '//www.facebook.com/sharer.php?u={url}',
    title: 'Auf Facebook teilen',
    icon: <TiSocialFacebook focusable={false} />,
    className: 'ta-facebook-icon',
  },
  {
    url: '//twitter.com/intent/tweet?url={url}',
    title: 'Auf Twitter teilen',
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

const Share = () => {
  const map = useSelector(state => state.app.map);
  const { t } = useTranslation();
  const config = [...socialShareConfig];

  for (let i = 0; i < config.length; i += 1) {
    if (config[i].url) {
      config[i].url = config[i].url.replace('{url}', window.location.href);
    }
  }

  const title = t('Karte als Bild speichern');
  return (
    <div className="wkp-share">
      <SharePermalinkButton />
      {renderConf(config[0], t)}
      <CanvasSaveButton aria-label={title} map={map}>
        <TiImage focusable={false} title={title} />
      </CanvasSaveButton>
      {renderConf(config[1], t)}
      {renderConf(config[2], t)}
    </div>
  );
};

export default React.memo(Share);
