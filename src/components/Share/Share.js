import React from "react";
import PropTypes from "prop-types";
import { useMatomo } from "@jonkoops/matomo-tracker-react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { TiImage, TiSocialFacebook, TiSocialTwitter } from "react-icons/ti";
import { FaEnvelope } from "react-icons/fa";
import CanvasSaveButton from "react-spatial/components/CanvasSaveButton";
import { Link } from "@mui/material";
import SharePermalinkButton from "../SharePermalinkButton";
import {
  TRACK_SHARE_DL_ACTION,
  TRACK_SHARE_FB_ACTION,
  TRACK_SHARE_MAIL_ACTION,
  TRACK_SHARE_PERMALINK_ACTION,
  TRACK_SHARE_TW_ACTION,
} from "../../utils/constants";
import { generateExtraData } from "../../utils/exportUtils";
import { trackEvent } from "../../utils/trackingUtils";

const socialShareConfig = [
  {
    url: "mailto:?body={url}",
    title: "Per Email versenden",
    icon: <FaEnvelope focusable={false} />,
    className: "ta-mail-icon",
    trackMatomoEventAction: TRACK_SHARE_MAIL_ACTION,
  },
  {
    url: "//www.facebook.com/sharer.php?u={url}",
    title: "Auf Facebook teilen",
    icon: <TiSocialFacebook focusable={false} />,
    className: "ta-facebook-icon",
    trackMatomoEventAction: TRACK_SHARE_FB_ACTION,
  },
  {
    url: "//twitter.com/intent/tweet?url={url}",
    title: "Auf Twitter teilen",
    icon: <TiSocialTwitter focusable={false} />,
    className: "ta-twitter-icon",
    trackMatomoEventAction: TRACK_SHARE_TW_ACTION,
  },
];

const replaceParams = (url, language, appBaseUrl) => {
  return url
    .replace("{url}", encodeURIComponent(window.location.href))
    .replace("{language}", language)
    .replace("{appBaseUrl}", appBaseUrl);
};

function handleTracking(
  matomoAction,
  matomoCategory,
  matomoTrackFunc,
  title,
  t,
  action = "action",
  variant,
) {
  matomoTrackFunc({
    category: matomoAction,
    action: matomoCategory,
  });
  trackEvent({
    eventType: action,
    componentName: "icon button",
    label: t(title),
    variant: variant || title,
  });
}

function ShareLink({ config }) {
  const appBaseUrl = useSelector((state) => state.app.appBaseUrl);
  const activeTopic = useSelector((state) => state.app.activeTopic);
  const language = useSelector((state) => state.app.language);
  const { t } = useTranslation();
  const { trackEvent: trackMatomoEvent } = useMatomo();
  const { className, url, title, trackMatomoEventAction, icon } = config;
  return (
    <div className={className}>
      <Link
        href={replaceParams(url, language, appBaseUrl)}
        title={t(title)}
        target="_blank"
        tabIndex="0"
        onClick={() => {
          handleTracking(
            activeTopic.key,
            trackMatomoEventAction,
            trackMatomoEvent,
            title,
            t,
          );
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
    trackMatomoEventAction: PropTypes.string,
    icon: PropTypes.node,
  }).isRequired,
};

function Share() {
  const map = useSelector((state) => state.app.map);
  const layers = useSelector((state) => state.map.layers);
  const activeTopic = useSelector((state) => state.app.activeTopic);
  const { t } = useTranslation();
  const { trackEvent: trackMatomoEvent } = useMatomo();

  return (
    <div className="wkp-share">
      <SharePermalinkButton
        buttonProps={{
          onClick: () => {
            handleTracking(
              activeTopic?.key,
              TRACK_SHARE_PERMALINK_ACTION,
              trackMatomoEvent,
              "Permalink erstellen",
              t,
            );
          },
        }}
      />
      <ShareLink config={socialShareConfig[0]} />
      <CanvasSaveButton
        map={map}
        extraData={generateExtraData(layers)}
        onSaveStart={(mapp) => {
          handleTracking(
            activeTopic?.key,
            TRACK_SHARE_DL_ACTION,
            trackMatomoEvent,
            "Karte als Bild speichern",
            t,
            "download",
            "PNG export",
          );
          return Promise.resolve(mapp);
        }}
      >
        <button
          className="rs-canvas-save-button"
          type="button"
          aria-label="download"
          title={t("Karte als Bild speichern")}
        >
          <TiImage focusable={false} />
        </button>
      </CanvasSaveButton>
      <ShareLink config={socialShareConfig[1]} />
      <ShareLink config={socialShareConfig[2]} />
    </div>
  );
}

export default React.memo(Share);
