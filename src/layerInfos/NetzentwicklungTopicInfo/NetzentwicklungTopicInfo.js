import React from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import { compose } from "redux";
import DataLink from "../../components/DataLink";

const propTypes = {
  t: PropTypes.func.isRequired,
};

function NetzentwicklungTopicInfo({ t }) {
  return (
    <div>
      <p>{t("ch.sbb.netzentwicklung-desc")}</p>
      <p>
        {t("Verantwortlich")}: I-NAT-NET-NAP, Christof Mahnig,{" "}
        <a href="mailto:christof.mahnig@sbb.ch">christof.mahnig@sbb.ch</a>
      </p>
      <hr />
      <p>
        <DataLink href="https://geo.sbb.ch/portal/home/group.html?id=4778f8efa0ad41a6829f0094339158e2#overview">
          {t("Zu den Trafimage-Datensätzen im SBB Geoportal (SBB-intern)")}
        </DataLink>
      </p>
    </div>
  );
}

NetzentwicklungTopicInfo.propTypes = propTypes;
export default compose(withTranslation())(NetzentwicklungTopicInfo);
