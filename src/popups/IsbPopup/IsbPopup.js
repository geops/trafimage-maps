import React from "react";
import PropTypes from "prop-types";
import { Feature } from "ol";
import { Layer } from "mobility-toolbox-js/ol";
import { makeStyles } from "@mui/styles";
import useTranslation from "../../utils/useTranslation";
import Link from "../../components/Link";
import phoneIcon from "../../img/popups/NetzentwicklungPopup/phone.svg";
import mailIcon from "../../img/popups/NetzentwicklungPopup/mail.svg";
import useHighlightSomeFeatures from "../../utils/useHighlightSomeFeatures";

const useStyles = makeStyles(() => {
  return {
    row: {
      display: "flex",
      alignItems: "center",
      minHeight: 15,
      padding: "5px 0",
      "& img": {
        paddingRight: 5,
      },
    },
  };
});

const urlIsDefined = (url) => !!url;

const getUrls = (properties, language) => {
  let value = properties[`url_isb_${language}`];
  const urls = JSON.parse(value || "[]");
  if (urls.some(urlIsDefined)) {
    return urls.filter(urlIsDefined);
  }
  // If there are no urls in the current language default to first defined
  const linkKeys = Object.keys(properties).filter((key) =>
    /url_isb_/.test(key),
  );
  value =
    properties[
      linkKeys.find((key) => JSON.parse(properties[key]).some(urlIsDefined))
    ];
  return urls.filter(urlIsDefined);
};

const propTypes = {
  feature: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.instanceOf(Feature)),
    PropTypes.instanceOf(Feature),
  ]).isRequired,
  layer: PropTypes.instanceOf(Layer).isRequired,
};

const translations = {
  de: {
    vorgabenUrl:
      "https://vorgaben.sbb.ch/inhalte/18027?jump-to=&regulation-redirect=0",
  },
  fr: {
    vorgabenUrl:
      "https://vorgaben.sbb.ch/fr/contenu/18027?jump-to=&regulation-redirect=0",
  },
  it: {
    vorgabenUrl:
      "https://vorgaben.sbb.ch/it/contenuti/18027?jump-to=&regulation-redirect=0",
  },
  en: {
    vorgabenUrl:
      "https://vorgaben.sbb.ch/en/content/18027?jump-to=&regulation-redirect=0",
  },
};

function IsbPopup({ feature, layer }) {
  const classes = useStyles();
  const { i18n, t } = useTranslation();
  const shortToLongName = layer.get("shortToLongName") || {};
  const properties = feature.getProperties();
  const {
    phone_isb: phone,
    mail_isb: mail,
    isb_tu_name: operator,
  } = feature.getProperties();
  const urls = getUrls(properties, i18n.language) || [];
  const mainUrl = urls[0];
  const secondaryUrl = urls[1];
  // Character case of operator could change in the future, so we prevent futur errors using a regex.
  const operatorLongName =
    (Object.entries(shortToLongName).find(([key]) => {
      return new RegExp(`^${operator}$`, "i").test(key);
    }) || [])[1] || operator;

  // Highlight only the feature display in the feature information
  useHighlightSomeFeatures([feature], layer);

  return (
    <div>
      {operatorLongName && (
        <div className={classes.row}>
          {`${t("bei")} ${t(operatorLongName)}.`}
        </div>
      )}
      {mainUrl && (
        <div className={classes.row}>
          <Link href={mainUrl}>
            {t("zur Webseite von", { operator: t(operator) })}
          </Link>
        </div>
      )}
      {secondaryUrl && (
        <div className={classes.row}>
          {/(networkstatement|vorgaben)/.test(secondaryUrl) ? (
            <Link href={translations[i18n.language].vorgabenUrl}>
              www.networkstatement.ch
            </Link>
          ) : (
            <Link href={secondaryUrl}>
              {t("weitere Informationen von", { operator: t(operator) })}
            </Link>
          )}
        </div>
      )}
      {phone && (
        <div className={classes.row}>
          <img src={phoneIcon} alt="Phone" />
          <a href={`tel:${phone}`}>{phone}</a>
        </div>
      )}
      {mail && (
        <div className={classes.row}>
          <img src={mailIcon} alt="Mail" />
          <a href={`mailto:${mail}`} rel="noopener noreferrer" target="_blank">
            {mail}
          </a>
        </div>
      )}
    </div>
  );
}

IsbPopup.propTypes = propTypes;
IsbPopup.renderTitle = (feat, layer, t) => {
  return t("Informationen zum Netzzugang bei");
};
export default IsbPopup;
