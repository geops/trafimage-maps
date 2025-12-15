import React from "react";
import useTranslation from "../../utils/useTranslation";

const propTypes = {};

function NetzkarteTopicInfo() {
  const { t } = useTranslation();
  return (
    <div>
      <p>{`${t("ch.sbb.netzkarte-desc")} ${t(
        "ch.sbb.netzkarte-desc-topic-info",
      )}`}</p>
      <p>
        {t("Verantwortlich")}:
        <br />
        {t("SBB AG, Product Owner Trafimage")},
        <br />
        Daniel Hofstetter,&nbsp;
        <a href={`mailto:${t("trafimage@sbb.ch")}`}>{t("trafimage@sbb.ch")}</a>.
      </p>
    </div>
  );
}

NetzkarteTopicInfo.propTypes = propTypes;

export default NetzkarteTopicInfo;
