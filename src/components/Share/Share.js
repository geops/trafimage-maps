import React from 'react';
import PropTypes from 'prop-types';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { TiImage, TiSocialFacebook, TiSocialTwitter } from 'react-icons/ti';
import { FaEnvelope } from 'react-icons/fa';
import CanvasSaveButton from 'react-spatial/components/CanvasSaveButton';
import { Link } from '@material-ui/core';
import SharePermalinkButton from '../SharePermalinkButton';
import {
  TRACK_SHARE_DL_ACTION,
  TRACK_SHARE_FB_ACTION,
  TRACK_SHARE_MAIL_ACTION,
  TRACK_SHARE_PERMALINK_ACTION,
  TRACK_SHARE_TW_ACTION,
} from '../../utils/constants';
import { generateExtraData } from '../ExportButton/exportUtils';

const socialShareConfig = [
  {
    url: 'mailto:?body={url}',
    title: 'Per Email versenden',
    icon: <FaEnvelope focusable={false} />,
    className: 'ta-mail-icon',
    trackEventAction: TRACK_SHARE_MAIL_ACTION,
  },
  {
    url: '//www.facebook.com/sharer.php?u={url}',
    title: 'Auf Facebook teilen',
    icon: <TiSocialFacebook focusable={false} />,
    className: 'ta-facebook-icon',
    trackEventAction: TRACK_SHARE_FB_ACTION,
  },
  {
    url: '//twitter.com/intent/tweet?url={url}',
    title: 'Auf Twitter teilen',
    icon: <TiSocialTwitter focusable={false} />,
    className: 'ta-twitter-icon',
    trackEventAction: TRACK_SHARE_TW_ACTION,
  },
];

const replaceParams = (url, language, appBaseUrl) => {
  return url
    .replace('{url}', encodeURIComponent(window.location.href))
    .replace('{language}', language)
    .replace('{appBaseUrl}', appBaseUrl);
};

function ShareLink({ config }) {
  const appBaseUrl = useSelector((state) => state.app.appBaseUrl);
  const activeTopic = useSelector((state) => state.app.activeTopic);
  const language = useSelector((state) => state.app.language);
  const { t } = useTranslation();
  const { trackEvent } = useMatomo();
  const { className, url, title, trackEventAction, icon } = config;
  return (
    <div className={className}>
      <Link
        href={replaceParams(url, language, appBaseUrl)}
        title={t(title)}
        target="_blank"
        tabIndex="0"
        onClick={() => {
          if (trackEventAction) {
            trackEvent({
              category: activeTopic?.key,
              action: trackEventAction,
            });
          }
        }}
      >
        {icon}
      </Link>
    </div>
  );
}

ShareLink.propTypes = {
  config: PropTypes.shape({
    url: PropTypes.string,
    className: PropTypes.string,
    title: PropTypes.string,
    trackEventAction: PropTypes.string,
    icon: PropTypes.node,
  }).isRequired,
};

function Share() {
  const map = useSelector((state) => state.app.map);
  const layers = useSelector((state) => state.map.layers);
  const activeTopic = useSelector((state) => state.app.activeTopic);
  const { t } = useTranslation();
  const { trackEvent } = useMatomo();

  return (
    <div className="wkp-share">
      <SharePermalinkButton
        buttonProps={{
          onClick: () => {
            trackEvent({
              category: activeTopic?.key,
              action: TRACK_SHARE_PERMALINK_ACTION,
            });
          },
        }}
      />
      <ShareLink config={socialShareConfig[0]} />
      <CanvasSaveButton
        map={map}
        title={t('Karte als Bild speichern')}
        extraData={generateExtraData(layers)}
        onSaveStart={(mapp) => {
          trackEvent({
            category: activeTopic?.key,
            action: TRACK_SHARE_DL_ACTION,
          });
          return Promise.resolve(mapp);
        }}
      >
        <TiImage focusable={false} />
      </CanvasSaveButton>
      <ShareLink config={socialShareConfig[1]} />
      <ShareLink config={socialShareConfig[2]} />
    </div>
  );
}

export default React.memo(Share);
