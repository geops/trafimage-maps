/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import PropTypes from "prop-types";
import { useMatomo } from "@jonkoops/matomo-tracker-react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { TiImage, TiSocialFacebook } from "react-icons/ti";
import { RiTwitterXLine } from "react-icons/ri";
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
import { trackEvent } from "../../utils/trackingUtils";

const socialShareConfig = [
  {
    url: "mailto:?body={url}",
    title: "Per Email versenden",
    children: <FaEnvelope focusable={false} style={{ fontSize: 23 }} />,
    className: "ta-mail-icon",
    trackMatomoEventAction: TRACK_SHARE_MAIL_ACTION,
  },
  {
    url: "//www.facebook.com/sharer.php?u={url}",
    title: "Auf Facebook teilen",
    children: <TiSocialFacebook focusable={false} style={{ fontSize: 28 }} />,
    className: "ta-facebook-icon",
    trackMatomoEventAction: TRACK_SHARE_FB_ACTION,
  },
  {
    url: "//twitter.com/intent/tweet?url={url}",
    title: "Auf X teilen",
    children: <RiTwitterXLine focusable={false} style={{ fontSize: 22 }} />,
    className: "ta-x-icon",
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
  topic,
  matomoCategory,
  matomoTrackFunc,
  title,
  t,
  action = "action",
  variant,
  value,
) {
  matomoTrackFunc({
    category: topic?.key,
    action: matomoCategory,
  });
  trackEvent({
    eventType: action,
    componentName: "share button",
    label: t(title),
    location: t(topic?.name, { lng: "de" }),
    variant: variant || t(title, { lng: "de" }),
    value,
  });
}

function ShareLink({
  url,
  title,
  children,
  className,
  trackMatomoEventAction,
  ...props
}) {
  const appBaseUrl = useSelector((state) => state.app.appBaseUrl);
  const activeTopic = useSelector((state) => state.app.activeTopic);
  const language = useSelector((state) => state.app.language);
  const { t } = useTranslation();
  const { trackEvent: trackMatomoEvent } = useMatomo();

  return (
    <IconButton
      className={className}
      href={replaceParams(url, language, appBaseUrl)}
      title={t(title)}
      target="_blank"
      tabIndex={0}
      onClick={() => {
        handleTracking(
          activeTopic,
          trackMatomoEventAction,
          trackMatomoEvent,
          title,
          t,
        );
      }}
      data-testid={`wkp-share-${title.replace(/\s+/g, "-").toLowerCase()}`}
      {...props}
    >
      {children}
    </IconButton>
  );
}

ShareLink.propTypes = {
  className: PropTypes.string,
  url: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  trackEventAction: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  trackMatomoEventAction: PropTypes.string,
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
              activeTopic,
              TRACK_SHARE_PERMALINK_ACTION,
              trackMatomoEvent,
              "Permalink erstellen",
              t,
            );
          },
        }}
      />
      <ShareLink {...socialShareConfig[0]} />
      <CanvasSaveButton
        map={map}
        extraData={generateExtraData(layers)}
        onSaveStart={(mapp) => {
          handleTracking(
            activeTopic,
            TRACK_SHARE_DL_ACTION,
            trackMatomoEvent,
            "Karte als Bild speichern",
            t,
            "download",
            "PNG export",
            `${window.document.title.replace(/ /g, "_").toLowerCase()}.png`,
          );
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
