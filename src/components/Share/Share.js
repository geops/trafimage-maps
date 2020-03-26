import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { TiSocialFacebook, TiSocialTwitter } from 'react-icons/ti';
import CanvasSaveButton from 'react-spatial/components/CanvasSaveButton';
import BlankLink from '@geops/react-ui/components/BlankLink';
import Button from '@geops/react-ui/components/Button';
import SharePermalinkButton from '../SharePermalinkButton';
import redirectHelper from '../../utils/redirectHelper';

import { ReactComponent as ImageSVG } from '../../img/sbb/share/picture_147_large.svg';
import { ReactComponent as EnvelopSVG } from '../../img/sbb/share/envelope_3_large.svg';
import { ReactComponent as PencilSVG } from '../../img/sbb/share/pen_16_large.svg';

const socialShareConfig = [
  {
    url: 'mailto:?body={url}',
    title: 'Per Email versenden',
    icon: <EnvelopSVG focusable={false} />,
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

const propTypes = {
  appBaseUrl: PropTypes.string,
};

const defaultProps = {
  appBaseUrl: null,
};

const renderConf = (conf, t) => (
  <div className={conf.className} key={conf.title}>
    <BlankLink href={conf.url} title={t(conf.title)}>
      {conf.icon}
    </BlankLink>
  </div>
);

const Share = ({ appBaseUrl }) => {
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
        <ImageSVG focusable={false} title={title} />
      </CanvasSaveButton>
      {renderConf(config[1], t)}
      {renderConf(config[2], t)}
      <div className="ta-draw-icon">
        <Button
          onClick={() =>
            redirectHelper.redirect(appBaseUrl, 'ch.sbb.netzkarte.draw', {
              'wkp.draw': '',
            })
          }
          title={`${t('Zeichnen')}.`}
        >
          <PencilSVG focusable={false} />
        </Button>
      </div>
    </div>
  );
};

Share.propTypes = propTypes;
Share.defaultProps = defaultProps;

export default React.memo(Share);
