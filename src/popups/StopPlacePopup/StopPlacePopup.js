import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import PropTypes from "prop-types";
import Feature from "ol/Feature";
import { useSelector } from "react-redux";
import { useTranslation, Trans } from "react-i18next";
import { makeStyles } from "@mui/styles";
import Link from "../../components/Link";

const propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
};

const cache = {};

const useStyles = makeStyles(() => ({
  popup: {
    "& legend": {
      fontWeight: "bold", // Ensure the title is bold in gitlab
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

function StopPlacePopup({ feature }) {
  const classes = useStyles();
  const { t, i18n } = useTranslation();
  const cartaroUrl = useSelector((state) => state.app.cartaroUrl);
  const uic = useMemo(() => {
    return feature?.get("uic");
  }, [feature]);
  const { data, loading } = useStopPlaceData(uic, cartaroUrl);

  const renderContent = useCallback(
    ([key, value]) => {
      let content = value && (
        <div key={key}>
          <div>
            {t(key)}: {t(formatYesNoData(value))}
          </div>{" "}
          <br />
        </div>
      );

      if (value && typeof value === "object") {
        const entries = Object.entries(value);
        if (entries.length) {
          content = (
            <div key={key}>
              <fieldset>
                <legend>{t(key)}</legend>
                <br />
                <div>{entries.map(renderContent)}</div>
              </fieldset>
              <br />
            </div>
          );
        }
      }

      if (key === "ticketMachine") content = null;
      if (key === "alternativeTransport") {
        content = !/^NO|UNKNOWN$/.test(value?.state) && (
          <div key={key}>
            <fieldset>
              <legend>{t(key)}</legend>
              <br />
              <div>{t("Shuttle-Fahrdienst")}</div>
              {value.note?.[i18n.language] && (
                <>
                  <br />
                  <div>{value.note[i18n.language]}</div>
                </>
              )}
              <br />
            </fieldset>
            <br />
          </div>
        );
      }

      if (key === "accessibility") {
        const note =
          typeof value.note === "object"
            ? value?.note?.[i18n.language] || value?.note?.de
            : value.note;
        const hasTranslatedString = note?.includes(hardcodedStringForNote);
        const hasAdditionalInfo =
          hasTranslatedString && note?.split(hardcodedStringForNote)[1];
        content = (
          <div key={key}>
            <fieldset>
              <legend>{t(key)}</legend>
              <br />
              <div>{t(formatYesNoData(value?.state))}</div>
              {value?.note && (
                <>
                  <br />
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
                  {hasAdditionalInfo && (
                    <>
                      <br />
                      <br />
                      {hasAdditionalInfo}
                    </>
                  )}
                </>
              )}
              <br />
            </fieldset>
            <br />
          </div>
        );
      }

      if (value && key === "passengerInformation") {
        const entries = Object.entries(value).filter(([k, val]) => {
          return val !== "NO" && val !== "UNKNOWN" && k !== "note";
        });
        content = !!entries.length && (
          <div key={key}>
            <fieldset>
              <legend>{t(key)}</legend>
              <br />
              {entries.map(([k]) => {
                return (
                  <Fragment key={k}>
                    <div>{t(k)}</div>
                    <br />
                  </Fragment>
                );
              })}
            </fieldset>
            <br />
          </div>
        );
      }

      if (value && key === "note") {
        content = (
          <div key={key}>
            {typeof value === "object"
              ? value[i18n.language] || value.de
              : value}
            <br />
          </div>
        );
      }

      if (value && key === "url") {
        const url = /^http(s)?:\/\//.test(value) ? value : `https://${value}`;
        let niceVal = value;
        try {
          niceVal = /^http(s)?:\/\//.test(url) ? new URL(url).hostname : value;
        } catch (e) {
          // eslint-disable-next-line no-console
          console.log("StopPlacePopup. Not a parseable url: ", value);
          niceVal = value;
        }
        content = (
          <div key={key}>
            <Link href={url}>{niceVal}</Link>
            <br />
          </div>
        );
      }

      return content || null;
    },
    [i18n.language, t],
  );

  const popupContent = useMemo(() => {
    const content = Object.entries(data?.prmInformation || {})
      .map(renderContent)
      .filter(Boolean);
    return content?.length ? content : t(`Keine Daten für diese Station`);
  }, [data?.prmInformation, renderContent, t]);

  if (loading) {
    return <div>Loading ...</div>;
  }

  return <div className={classes.popup}>{popupContent}</div>;
}

StopPlacePopup.propTypes = propTypes;

const memoized = React.memo(StopPlacePopup);
memoized.renderTitle = (feat) => feat.get("name");

export default memoized;
