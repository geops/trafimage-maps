import React from "react";
import { useTranslation } from "react-i18next";

function ZweitausbildungTopicInfo() {
  const { t } = useTranslation();
  return (
    <div>
      <p>{t("ch.sbb.zweitausbildung-desc")}</p>
      <p>
        {t("Datenstand")}: {t("ch.sbb.zweitausbildung-datastatus")}
      </p>
      <p>
        {t("Verantwortlich")}:
        <br />
        HR-POK-SKK-PM
        <br />
        <a href="mailto:pm.skk.kbc@sbb.ch">pm.skk.kbc@sbb.ch</a>.
      </p>
    </div>
  );
}

export default ZweitausbildungTopicInfo;
