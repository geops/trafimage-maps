import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { unByKey } from "ol/Observable";
import { Typography } from "@mui/material";
import useTranslation from "../../utils/useTranslation";
import { MesswagenLayer } from "../../layers";
import Link from "../../components/Link";

function MesswagenPopup() {
  const { t } = useTranslation();
  const topic = useSelector((state) => state.app.activeTopic);
  const [feature, setFeature] = useState(null);

  useEffect(() => {
    const keys = topic.layers
      .filter((l) => l instanceof MesswagenLayer)
      .map((l) =>
        l.on("change:feature", (evt) => {
          setFeature(evt.target.get(evt.key));
        }),
      );
    return () => {
      unByKey(keys);
    };
  }, [topic?.layers]);

  const { title, info } = feature?.getProperties() || {};
  return (
    <div
      data-cy="messwagen-popup"
      style={{
        position: "absolute",
        right: 60,
        bottom: 60,
        width: 190,
        backgroundColor: "rgba(255,255,255,0.9)",
        padding: 5,
        borderRadius: 5,
      }}
    >
      <Typography
        style={{ textAlign: "center", fontWeight: "bold", marginBottom: 5 }}
      >
        {title}
      </Typography>
      {info?.map(({ label, value }) => (
        <div
          key={label}
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 10,
            marginBottom: 5,
          }}
        >
          <Typography
            style={{
              flex: 1,
              textAlign: "right",
            }}
          >
            {t(label)}:
          </Typography>
          <Typography style={{ flex: 1, textAlign: "left" }}>
            {value}
          </Typography>
        </div>
      ))}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 10,
          marginBottom: 5,
        }}
      >
        <Link href="https://maps.trafimage.ch/funkmesswagen-einsatzplanung/infra-mewa-programm-aktuell.pdf">
          {`${t("Einstazplanung")} ${new Date().getFullYear()}`}
        </Link>
      </div>
    </div>
  );
}

export default MesswagenPopup;
