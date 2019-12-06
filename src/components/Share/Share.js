import React from 'react';
import qs from 'query-string';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { TiImage, TiSocialFacebook, TiSocialTwitter } from 'react-icons/ti';
import { FaEnvelope, FaPencilAlt } from 'react-icons/fa';
import { transform } from 'ol/proj';
import CanvasSaveButton from 'react-spatial/components/CanvasSaveButton';
import BlankLink from '@geops/react-ui/components/BlankLink';
import Button from '@geops/react-ui/components/Button';
import layerHelper from '../../layers/layerHelper';
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

const redirectToDraw = topicKey => {
  const urlParams = qs.parse(window.location.search);

  if (urlParams.z) {
    // Convert the zoom level to match the different scale on the old wkp.
    urlParams.zoom = layerHelper.convertToOldZoom(parseInt(urlParams.z, 10));
    delete urlParams.z;
  }

  if (urlParams.x || urlParams.y) {
    // Reproject the coordinates to the old wkp projection: EPSG:21781.
    const [newX, newY] = transform(
      [parseInt(urlParams.x, 10), parseInt(urlParams.y, 10)],
      'EPSG:3857',
      'EPSG:21781',
    );
    urlParams.x = newX;
    urlParams.y = newY;
  }

  window.location.href = `http://wkp.prod.trafimage.geops.ch/#/${topicKey}?${qs.stringify(
    urlParams,
  )}`;
};

const Share = () => {
  const map = useSelector(state => state.app.map);
  const activeTopic = useSelector(state => state.app.activeTopic);
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
      <div className="ta-draw-icon">
        <Button
          onClick={() => redirectToDraw(activeTopic.key)}
          title={`${t('Zeichnen')}.`}
        >
          <FaPencilAlt focusable={false} />
        </Button>
      </div>
    </div>
  );
};

export default React.memo(Share);
