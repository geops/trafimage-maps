import React from "react";
import PropTypes from "prop-types";
import Feature from "ol/Feature";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { compose } from "redux";
import { FaRegFilePdf } from "react-icons/fa";
import Link from "../../components/Link";

const propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
  language: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
};

const defaultProps = {};

function BahnhofplanPopup({ feature, language, t }) {
  const iabpUrl = feature.get("url_interactive_plan");
  const a4Url = feature.get("url_a4");
  const posterUrl = feature.get("url_poster");
  const shoppingUrl = feature.get("url_shopping");

  let iabpLink;
  let a4Link;
  let posterLink;
  let shoppingLink;

  if (iabpUrl) {
    iabpLink = (
      <div>
        <Link href={`${iabpUrl}#?lang=${language}`}>
          {t("Interaktiver Bahnhofplan")}
        </Link>
      </div>
    );
  }

  if (a4Url) {
    a4Link = (
      <div>
        <a href={a4Url} rel="noopener noreferrer" target="_blank">
          {t("Format A4")}
          <FaRegFilePdf />
        </a>
      </div>
    );
  }

  if (posterUrl) {
    posterLink = (
      <div>
        <a href={posterUrl} rel="noopener noreferrer" target="_blank">
          {t("Plakat")}
          <FaRegFilePdf />
        </a>
      </div>
    );
  }

  if (shoppingUrl) {
    shoppingLink = (
      <div>
        <a href={shoppingUrl} rel="noopener noreferrer" target="_blank">
          {t("Shopping im Bahnhof")}
          <FaRegFilePdf />
        </a>
      </div>
    );
  }

  return (
    <div className="wkp-bahnhofplan-popup">
      {iabpLink}
      {a4Link}
      {posterLink}
      {shoppingLink}
    </div>
  );
}

const mapStateToProps = (state) => ({
  language: state.app.language,
});

BahnhofplanPopup.propTypes = propTypes;
BahnhofplanPopup.defaultProps = defaultProps;

const composed = compose(
  withTranslation(),
  connect(mapStateToProps),
)(BahnhofplanPopup);

composed.renderTitle = (feat) => feat.get("name");
export default composed;
