import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import Feature from "ol/Feature";
import { useSelector } from "react-redux";
import { useTranslation, Trans } from "react-i18next";
import { makeStyles } from "@mui/styles";
import { Typography } from "@mui/material";
import Link from "../../components/Link";

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

const formatYesNoData = (data) => {
  if (data === "YES") return "Ja";
  if (data === "NO") return "Nein";
  return data;
};

const getAccessibility = (value, language, t) => {
  if (!value) return null;
  const note =
    typeof value.note === "object"
      ? value?.note?.[language] || value?.note?.de
      : value.note;
  const hasTranslatedString = note?.includes(hardcodedStringForNote);
  const notTranslatedInfo = hasTranslatedString
    ? note?.split(hardcodedStringForNote)[1]
    : note;
  return (
    <fieldset key="accessibility">
      <legend>{t("accessibility")}</legend>
      <Typography>{t(formatYesNoData(value?.state))}</Typography>
      {hasTranslatedString && (
        <Typography>
          {hasTranslatedString ? (
            <Trans
              i18nKey={hardcodedStringForNote}
              components={{
                1: <br />,
                2: (
                  <a
                    href="https://www.swisspass.ch/handicap"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    swisspass.ch/handicap
                  </a>
                ),
              }}
            />
          ) : null}
        </Typography>
      )}
      {notTranslatedInfo && <Typography>{notTranslatedInfo}</Typography>}
    </fieldset>
  );
};

const getAlternativeTransport = (value, language, t) => {
  if (!value) return null;
  return (
    !/^NO|UNKNOWN$/.test(value?.state) && (
      <fieldset key="alternativeTransport">
        <legend>{t("alternativeTransport")}</legend>
        <div>{t("Shuttle-Fahrdienst")}</div>
        {value.note?.[language] && <div>{value.note[language]}</div>}
      </fieldset>
    )
  );
};

const getPassengetInformation = (value, t) => {
  if (!value) return null;
  const entries = Object.entries(value).filter(([k, val]) => {
    return val !== "NO" && val !== "UNKNOWN" && k !== "note";
  });
  return (
    !!entries.length && (
      <fieldset key="passengerInformation">
        <legend>{t("passengerInformation")}</legend>
        {entries.map(([k]) => {
          return <div key={k}>{t(k)}</div>;
        })}
      </fieldset>
    )
  );
};

const getNote = (value, language, t) => {
  if (!value) return null;
  return (
    <fieldset key="note">
      <legend>{t("Hinweise zur Haltestelle")}</legend>
      {typeof value === "object" ? value[language] || value.de : value}
    </fieldset>
  );
};

const getUrl = (value, language, t) => {
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
  return (
    <fieldset key="url">
      <legend>{t("Weitere Informationen")}</legend>
      <Link href={url}>{niceVal}</Link>
    </fieldset>
  );
};

function StopPlacePopup({ feature }) {
  const classes = useStyles();
  const { t, i18n } = useTranslation();
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
    const passengerInformation = getPassengetInformation(
      infos.passengerInformation,
      t,
    );
    const note = getNote(infos.note, i18n.language, t);
    const url = getUrl(infos.url, i18n.language, t);
    const content = [
      accessibility,
      alternativeTransport,
      passengerInformation,
      note,
      url,
    ].filter(Boolean);
    return content?.length ? content : t(`Keine Daten für diese Station`);
  }, [data?.prmInformation, i18n.language, t]);

  if (loading) {
    return <div>Loading ...</div>;
  }

  return <div className={classes.popup}>{popupContent}</div>;
}

StopPlacePopup.propTypes = propTypes;

const memoized = React.memo(StopPlacePopup);
memoized.renderTitle = (feat) => feat.get("name");

export default memoized;
