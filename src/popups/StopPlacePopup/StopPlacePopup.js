import React, { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import Feature from "ol/Feature";
import { useSelector } from "react-redux";
import { makeStyles } from "@mui/styles";
import { Typography } from "@mui/material";
import Link from "../../components/Link";
import useTranslation from "../../utils/useTranslation";

const propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
};

const cache = {};

const flexStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 15,
};
const useStyles = makeStyles(() => ({
  popup: {
    padding: 10,
    ...flexStyle,
    "& legend": {
      fontWeight: "bold", // Ensure the title is bold in gitlab
    },
    "& fieldset": {
      ...flexStyle,
      borderWidth: 1, // Ensure border is 1px in gitlab
      padding: "20px 10px",
    },
  },
}));

// TODO: The NOVA data is still quite incomplete. For now check the API accessibility note for this hardcoded string. This needs to be improved when the data is updated
const hardcodedStringForNote =
  "Bei dieser Verbindung benötigen Sie Ein- und Ausstiegshilfen. Bitte melden Sie sich bis spätestens 1 Stunde vor Abfahrt unter swisspass.ch/handicap oder beim Contact Center Handicap.Contact Center Handicaptäglich 5.00–24.00 Uhr, Telefon 0800 007 102 (kostenlos in der Schweiz), aus dem Ausland +41 800 007 102.";

const useStopPlaceData = (uic, cartaroUrl) => {
  const [loading, setLoading] = useState();
  const [data, setData] = useState();
  useEffect(() => {
    const abortController = new AbortController();
    setData();

    if (uic && cache[uic]) {
      setData(cache[uic]);
    } else if (uic) {
      const fetchData = () => {
        setLoading(true);
        fetch(`${cartaroUrl}journey_poi/stop_place?id=${uic}`)
          .then((response) => response.json())
          .then((newData) => {
            cache[uic] = newData;
            setData(newData);
          })
          .catch(() => {
            // eslint-disable-next-line no-console
            console.warn(`StopPlacePopup. No data for stations: ${uic}`);
          })
          .finally(() => {
            setLoading(false);
          });
      };
      fetchData();
    }
    return () => {
      abortController.abort();
    };
  }, [cartaroUrl, uic]);
  return { data, loading };
};

const formatStateData = (data) => {
  if (data === "YES") return "Ja";
  if (data === "NO") return "Nein";
  if (data === "UNKNOWN") return "Unbekannt";
  if (data === "PARTIALLY") return "Teilweise";
  return data;
};

const getNoteTranslation = (note, language) => {
  return typeof note === "object" ? note?.[language] || note?.de : note;
};

const getAccessibility = (value, language, t) => {
  if (!value) return null;
  const note = getNoteTranslation(value?.note, language);
  const hasTranslatedString = note?.includes(hardcodedStringForNote);
  const notTranslatedInfo = hasTranslatedString
    ? note?.split(hardcodedStringForNote)[1]
    : note;
  return {
    component: (
      <fieldset key="accessibility" data-testid="stopplace-accessibility">
        <legend>{t("accessibility")}</legend>
        <Typography>{t(formatStateData(value?.state))}</Typography>
        {hasTranslatedString && (
          <Typography>
            <span
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{
                __html: t(hardcodedStringForNote).replace(
                  "swisspass.ch/handicap",
                  '<a href="https://www.swisspass.ch/handicap" rel="noopener noreferrer"  target="_blank">swisspass.ch/handicap</a>',
                ),
              }}
            />
            s
          </Typography>
        )}
        {notTranslatedInfo && <Typography>{notTranslatedInfo}</Typography>}
      </fieldset>
    ),
    text: `${t("accessibility")}, ${t(formatStateData(value?.state))}${hasTranslatedString ? `, ${t(hardcodedStringForNote)}` : ""}${notTranslatedInfo ? `, ${notTranslatedInfo}` : ""}`,
  };
};

const getAlternativeTransport = (value, language, t) => {
  const note = getNoteTranslation(value?.note, language);
  if (
    !value ||
    (/NO|UNKNOWN|NOT_APPLICABLE|PARTIALLY/.test(value?.state) && !note)
  )
    return null;

  const hasShuttleService = !note && /YES/.test(value?.state);
  return {
    component: (
      <fieldset
        key="alternativeTransport"
        data-testid="stopplace-alternative-transport"
      >
        <legend>{t("alternativeTransport")}</legend>
        {hasShuttleService && (
          <Typography data-testid="stopplace-alternative-transport-state">
            {t("Shuttle-Fahrdienst")}
          </Typography>
        )}
        {note && (
          <Typography data-testid="stopplace-alternative-transport-note">
            {note}
          </Typography>
        )}
      </fieldset>
    ),
    text: `${t("alternativeTransport")}, ${hasShuttleService ? `, ${t("Shuttle-Fahrdienst")}` : ""}${note ? `, ${note}` : ""}`,
  };
};

const getPassengerInformation = (value, t) => {
  if (!value) return null;
  const entries = Object.entries(value).filter(([k, val]) => {
    return val !== "NO" && val !== "UNKNOWN" && k !== "note";
  });
  return entries.length
    ? {
        component: (
          <fieldset
            key="passengerInformation"
            data-testid="stopplace-passengerinfo"
          >
            <legend>{t("passengerInformation")}</legend>
            {entries.map(([k]) => {
              return (
                <div key={k} data-testid={`stopplace-passengerinfo-${k}`}>
                  {t(k)}
                </div>
              );
            })}
          </fieldset>
        ),
        text: `${t("passengerInformation")}, ${entries.map(([k]) => t(k)).join(", ")}`,
      }
    : null;
};

const getNote = (value, language, t) => {
  const text = getNoteTranslation(value, language);
  if (!text) return null;

  return {
    component: (
      <fieldset key="note" data-testid="stopplace-note">
        <legend>{t("Hinweise zur Haltestelle")}</legend>
        {text}
      </fieldset>
    ),
    text: `${t("Hinweise zur Haltestelle")}, ${text}`,
  };
};

const getUrl = (value, t) => {
  if (!value) return null;
  const url = /^http(s)?:\/\//.test(value) ? value : `https://${value}`;
  let niceVal = value;
  try {
    niceVal = /^http(s)?:\/\//.test(url) ? new URL(url).hostname : value;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log("StopPlacePopup. Not a parseable url: ", value);
    niceVal = value;
  }
  return {
    component: (
      <fieldset key="url" data-testid="stopplace-url">
        <legend>{t("Weitere Informationen")}</legend>
        <Link href={url}>{niceVal}</Link>
      </fieldset>
    ),
    text: `${t("Weitere Informationen")}, ${url}`,
  };
};

function StopPlacePopup({ feature }) {
  const classes = useStyles();
  const { t, i18n } = useTranslation();
  const announcerRef = useRef(null);
  const cartaroUrl = useSelector((state) => state.app.cartaroUrl);
  const uic = useMemo(() => {
    return feature?.get("uic");
  }, [feature]);
  const { data, loading } = useStopPlaceData(uic, cartaroUrl);

  const popupContent = useMemo(() => {
    const infos = data?.prmInformation || {};
    const accessibility = getAccessibility(
      infos.accessibility,
      i18n.language,
      t,
    );
    const alternativeTransport = getAlternativeTransport(
      infos.alternativeTransport,
      i18n.language,
      t,
    );
    const passengerInformation = getPassengerInformation(
      infos.passengerInformation,
      t,
    );
    const note = getNote(infos.note, i18n.language, t);
    const url = getUrl(infos.url, t);
    const components = [
      note?.component,
      accessibility?.component,
      alternativeTransport?.component,
      passengerInformation?.component,
      url?.component,
    ].filter(Boolean);
    return {
      component: components.length ? (
        <div className={classes.popup} data-testid="stopplace-popup">
          {components}
        </div>
      ) : (
        <div className={classes.popup} data-testid="stopplace-popup">
          <Typography>{t("Keine Daten für diese Station")}</Typography>
        </div>
      ),
      text: [
        note?.text,
        accessibility?.text,
        alternativeTransport?.text,
        passengerInformation?.text,
        url?.text,
      ]
        .filter(Boolean)
        .join(". "),
    };
  }, [classes.popup, data?.prmInformation, i18n.language, t]);

  useEffect(() => {
    if (popupContent.text && announcerRef.current) {
      announcerRef.current.textContent = popupContent.text;
    }
  }, [popupContent.text]);

  if (loading || !popupContent) {
    return <div>{t("Laden...")}</div>;
  }

  return (
    <>
      {/** Rendering the text separately ensures the text content is read out in the correct order on load by the screen reader */}
      <div
        data-testid="stopplace-announcer"
        ref={announcerRef}
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
        style={{
          position: "absolute",
          left: "-9999px",
          height: "1px",
          width: "1px",
          overflow: "hidden",
        }}
      />
      {popupContent?.component}
    </>
  );
}

StopPlacePopup.propTypes = propTypes;

const memoized = React.memo(StopPlacePopup);
memoized.renderTitle = (feat) => feat.get("name");

export default memoized;
