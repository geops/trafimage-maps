import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { unByKey } from "ol/Observable";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { MesswagenLayer } from "../../layers";

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
      style={{
        position: "absolute",
        left: "calc(50% - 95px)",
        bottom: 45,
        width: 190,
        backgroundColor: "rgba(255,255,255,0.6)",
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
    </div>
  );
}

export default MesswagenPopup;
