import React from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";

const propTypes = {
  t: PropTypes.func.isRequired,
};

const defaultProps = {};

function InterventionTopicInfo({ t }) {
  return (
    <div>
      <p>{t("ch.sbb.intervention-desc")}</p>
      <p>
        {t("Verantwortlich")}:
        <br />
        I-B-OCI-TLZ,&nbsp;
        <a href={`mailto:${t("alsi@sbb.ch")}`}>{t("alsi@sbb.ch")}</a>.
      </p>
    </div>
  );
}

InterventionTopicInfo.propTypes = propTypes;
InterventionTopicInfo.defaultProps = defaultProps;

export default withTranslation()(InterventionTopicInfo);
