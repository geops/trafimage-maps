/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import PropTypes from "prop-types";
import { useMatomo } from "@jonkoops/matomo-tracker-react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { TiImage, TiSocialFacebook, TiSocialTwitter } from "react-icons/ti";
import { FaEnvelope } from "react-icons/fa";
import CanvasSaveButton from "react-spatial/components/CanvasSaveButton";
import { IconButton } from "@mui/material";
import SharePermalinkButton from "../SharePermalinkButton";
import {
  TRACK_SHARE_DL_ACTION,
  TRACK_SHARE_FB_ACTION,
  TRACK_SHARE_MAIL_ACTION,
  TRACK_SHARE_PERMALINK_ACTION,
  TRACK_SHARE_TW_ACTION,
} from "../../utils/constants";
import { generateExtraData } from "../../utils/exportUtils";

const socialShareConfig = [
  {
    url: "mailto:?body={url}",
    title: "Per Email versenden",
    children: <FaEnvelope focusable={false} style={{ fontSize: 23 }} />,
    className: "ta-mail-icon",
    trackEventAction: TRACK_SHARE_MAIL_ACTION,
  },
  {
    url: "//www.facebook.com/sharer.php?u={url}",
    title: "Auf Facebook teilen",
    children: <TiSocialFacebook focusable={false} style={{ fontSize: 30 }} />,
    className: "ta-facebook-icon",
    trackEventAction: TRACK_SHARE_FB_ACTION,
  },
  {
    url: "//twitter.com/intent/tweet?url={url}",
    title: "Auf Twitter teilen",
    children: <TiSocialTwitter focusable={false} style={{ fontSize: 30 }} />,
    className: "ta-twitter-icon",
    trackEventAction: TRACK_SHARE_TW_ACTION,
  },
];

const replaceParams = (url, language, appBaseUrl) => {
  return url
    .replace("{url}", encodeURIComponent(window.location.href))
    .replace("{language}", language)
    .replace("{appBaseUrl}", appBaseUrl);
};

function ShareLink({ url, title, trackEventAction, children, ...props }) {
  const appBaseUrl = useSelector((state) => state.app.appBaseUrl);
  const activeTopic = useSelector((state) => state.app.activeTopic);
  const language = useSelector((state) => state.app.language);
  const { t } = useTranslation();
  const { trackEvent } = useMatomo();
  return (
    <IconButton
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
      {...props}
    >
      {children}
    </IconButton>
  );
}

ShareLink.propTypes = {
  url: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  trackEventAction: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
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
      <ShareLink {...socialShareConfig[0]} />
      <CanvasSaveButton
        map={map}
        extraData={generateExtraData(layers)}
        onSaveStart={(mapp) => {
          trackEvent({
            category: activeTopic?.key,
            action: TRACK_SHARE_DL_ACTION,
          });
          return Promise.resolve(mapp);
        }}
      >
        <IconButton
          className="rs-canvas-save-button"
          title={t("Karte als Bild speichern")}
          size="large"
        >
          <TiImage focusable={false} />
        </IconButton>
      </CanvasSaveButton>
      <ShareLink {...socialShareConfig[1]} />
      <ShareLink {...socialShareConfig[2]} />
    </div>
  );
}

export default React.memo(Share);
