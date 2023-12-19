import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { makeStyles } from "@mui/styles";
import { useTranslation } from "react-i18next";

import TarifverbundPartner from "../../components/TarifverbundPartner";
import useFetch from "../../utils/useFetch";
import useIsMobile from "../../utils/useIsMobile";

const useStyles = makeStyles(() => {
  return {
    legend: {
      display: "grid",
      gridTemplateColumns: (props) =>
        props.isMobile ? "1fr 1fr" : "200px 200px",
      gap: 5,
    },
  };
});

function TarifVerbundLegend() {
  const { t } = useTranslation();
  const vectorTilesUrl = useSelector((state) => state.app.vectorTilesUrl);
  const apiKey = useSelector((state) => state.app.apiKey);
  const isMobile = useIsMobile();
  const classes = useStyles({ isMobile });
  const { data: style, loading } = useFetch(
    `${vectorTilesUrl}/styles/ch.sbb.tarifverbund/style.json?key=${apiKey}`,
  );
  const verbunde = useMemo(() => {
    return style?.metadata?.partners?.sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, [style]);

  return (
    <div className={classes.legend} data-testid="tarifverbund-legend-container">
      {loading ? `${t("Wird geladen")}...` : null}
      {!loading && (verbunde || []).length ? (
        <>
          {verbunde.map((v) => (
            <TarifverbundPartner
              key={v.name}
              color={v.verbund_colour_hex ? `#${v.verbund_colour_hex}` : null}
              label={v.name}
            />
          ))}
          <TarifverbundPartner
            style={{
              background:
                "repeating-linear-gradient(45deg, transparent, transparent 2px, #bd9189 2px, #bd9189 4px)",
            }}
            label="Z-Pass"
          />
        </>
      ) : null}
    </div>
  );
}

export default TarifVerbundLegend;
