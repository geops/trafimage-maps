import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { TiImage, TiSocialFacebook, TiSocialTwitter } from 'react-icons/ti';
import { FaEnvelope } from 'react-icons/fa';
import CanvasSaveButton from 'react-spatial/components/CanvasSaveButton';
import { Link } from '@material-ui/core';
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

const replaceParams = (url, language, appBaseUrl) => {
  return url
    .replace('{url}', encodeURIComponent(window.location.href))
    .replace('{language}', language)
    .replace('{appBaseUrl}', appBaseUrl);
};

const renderConf = (conf, t, lang, appBaseUrl) => (
  <div className={conf.className} key={conf.title}>
    <Link
      href={replaceParams(conf.url, lang, appBaseUrl)}
      title={t(conf.title)}
      target="_blank"
      tabIndex="0"
    >
      {conf.icon}
    </Link>
  </div>
);

const Share = () => {
  const appBaseUrl = useSelector((state) => state.app.appBaseUrl);
  const language = useSelector((state) => state.app.language);
  const map = useSelector((state) => state.app.map);
  const { t } = useTranslation();
  const config = [...socialShareConfig];

  const title = t('Karte als Bild speichern');
  return (
    <div className="wkp-share">
      <SharePermalinkButton />
      {renderConf(config[0], t, language, appBaseUrl)}
      <CanvasSaveButton aria-label={title} map={map}>
        <TiImage focusable={false} title={title} />
      </CanvasSaveButton>
      {renderConf(config[1], t, language, appBaseUrl)}
      {renderConf(config[2], t, language, appBaseUrl)}
    </div>
  );
};

export default React.memo(Share);
