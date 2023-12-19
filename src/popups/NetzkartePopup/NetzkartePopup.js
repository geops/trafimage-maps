/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import PropTypes from "prop-types";
import Feature from "ol/Feature";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { transform as transformCoords } from "ol/proj";
import { Link as MuiLink } from "@mui/material";
import Link from "../../components/Link";
import BahnhofplanPopup from "../BahnhofplanPopup";
import coordinateHelper from "../../utils/coordinateHelper";
import DeparturePopup from "../DeparturePopup";
import CloseButton from "../../components/CloseButton";

const propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
  coordinate: PropTypes.arrayOf(PropTypes.number).isRequired,
};

function NetzkartePopup({ feature, coordinate }) {
  const [showPlanLinks, setShowPlanLinks] = useState(true);
  const [showCoordinates, setShowCoordinates] = useState(false);
  const [showDepartures, setShowDepartures] = useState(
    feature?.get("showDepartures"),
  );
  const projection = useSelector((state) => state.app.projection);
  const { t } = useTranslation();

  const {
    name,
    latitude,
    longitude,
    altitude,
    sbb_id: sbbId,
    layer,
    rail,
    ferry,
    country_code: countryCode,
    url_interactive_plan: iabpUrl,
    url_a4: a4Url,
    url_poster: posterUrl,
    url_shopping: shoppingUrl,
    url_bep: bepUrl,
  } = feature.getProperties();

  let airportLabel = null;
  let stationTimetableLink = null;
  let stationServiceLink = null;
  let bepLink = null;
  let transportLink = null;

  const hasPlanLinks = !!iabpUrl || !!a4Url || !!posterUrl || !!shoppingUrl;

  let styleLayer = layer || (rail ? "railway" : "");
  if (ferry) {
    styleLayer = "ship";
  }

  // TODO: verify that this code is used, it seems the airport label is never displayed.
  // because there is no translations with flug text and the indexOf test seems wrong
  // (it should be > -1).
  const isAirport = styleLayer && styleLayer.indexOf("flug") > 0;

  const floatSbbId = parseFloat(sbbId);
  const didok =
    (countryCode && countryCode === "CH") ||
    (!countryCode && floatSbbId >= 8500000 && /^85/.test(sbbId))
      ? floatSbbId - 8500000
      : null;

  if (bepUrl) {
    bepLink = (
      <div>
        <Link href={bepUrl}> {t("url_bep")}</Link>
      </div>
    );
  }

  if (Number.isFinite(didok)) {
    transportLink = (
      <div>
        <div
          tabIndex={0}
          role="button"
          onClick={() => setShowDepartures(true)}
          onKeyPress={() => setShowDepartures(true)}
          className="wkp-departure-btn"
        >
          {t("Abfahrtszeiten")}
        </div>
      </div>
    );
  }

  if (isAirport) {
    airportLabel = <div>{t(styleLayer)}</div>;
  }

  if (name && !isAirport) {
    const stationTimetableUrl = t("station_timetable_url").replace(
      "{stationname}",
      escape(name),
    );
    stationTimetableLink = (
      <div>
        <Link href={stationTimetableUrl}> {t("Fahrplan")}</Link>
      </div>
    );
  }

  // We want certain links only for swiss stations.
  if (Number.isFinite(didok) && styleLayer === "railway") {
    const stationServiceUrl = t("station_service_url").replace(
      "{didok}",
      escape(didok),
    );
    stationServiceLink = (
      <div>
        <Link href={stationServiceUrl}> {t("Webseite Bahnhof")}</Link>
      </div>
    );
  }

  // The feature is not necessarly a point.
  // If it's the case and if there is no properties, we use the coordinate of the click event
  let pointCoordinate = [0, 0];

  if (longitude && latitude) {
    pointCoordinate = transformCoords(
      [parseFloat(longitude, 10), parseFloat(latitude, 10)],
      "EPSG:4326",
      projection.value,
    );
  } else if (feature.getGeometry().getType() === "Point") {
    pointCoordinate = transformCoords(
      feature.getGeometry().getCoordinates(),
      "EPSG:3857",
      projection.value,
    );
  } else if (coordinate) {
    pointCoordinate = transformCoords(
      coordinate,
      "EPSG:3857",
      projection.value,
    );
  }

  const formatedCoords =
    projection.value === "EPSG:4326"
      ? coordinateHelper.wgs84Format(pointCoordinate, ",")
      : coordinateHelper.meterFormat(pointCoordinate);

  const coordinatesWrapper = (
    <>
      <div
        tabIndex={0}
        role="button"
        aria-expanded={showCoordinates}
        className="wkp-coordinate-toggle"
        onClick={() => setShowCoordinates(!showCoordinates)}
        onKeyPress={() => setShowCoordinates(!showCoordinates)}
      >
        {t("Koordinaten")}
      </div>

      <div
        className={`wkp-coordinates-infos${
          showCoordinates ? "" : " wkp-closed"
        }`}
      >
        <span className="wkp-projection-label">{projection.label}</span>
        <span>{`${t("Länge")} (X): ${formatedCoords[0]}`}</span>
        <span>{`${t("Breite")} (Y): ${formatedCoords[1]}`}</span>
        {altitude && <span>{`${t("Höhe")}: ${altitude}m`}</span>}
      </div>
    </>
  );

  return showDepartures ? (
    <DeparturePopup feature={feature} coordinate={coordinate}>
      <CloseButton
        size="small"
        style={{ position: "absolute", top: 0, right: 0, padding: "4px 0px" }}
        onClick={() => {
          setShowDepartures(false);
        }}
      />
    </DeparturePopup>
  ) : (
    <div className="wkp-netzkarte-popup">
      {airportLabel}
      {hasPlanLinks ? (
        <>
          <div>
            <MuiLink
              onClick={() => {
                setShowPlanLinks(!showPlanLinks);
              }}
              aria-expanded={showPlanLinks}
              className="wkp-popup-plans"
              tabIndex="0"
            >
              {t("Bahnhofpläne")}
            </MuiLink>
          </div>
          <div
            className={`wkp-bahnhofplan-links${
              showPlanLinks ? " wkp-visible" : ""
            }`}
          >
            <BahnhofplanPopup feature={feature} />
          </div>
        </>
      ) : null}
      {bepLink}
      {stationTimetableLink}
      {transportLink}
      {stationServiceLink}
      {coordinatesWrapper}
    </div>
  );
}

NetzkartePopup.propTypes = propTypes;

const memoized = React.memo(NetzkartePopup);
memoized.renderTitle = (feat, layer, t) => {
  const { name, platform } = feat.getProperties();
  if (platform) {
    return `${name} (${t("abfahrtszeiten_kante")} ${platform})`;
  }
  return name;
};

export default memoized;
