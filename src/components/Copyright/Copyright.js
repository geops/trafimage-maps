import React from "react";
import { useSelector } from "react-redux";
import RsCopyright from "react-spatial/components/Copyright";
import { makeStyles } from "@mui/styles";
import useTranslation from "../../utils/useTranslation";

const useStyles = makeStyles(() => ({
  wrapper: {
    position: "absolute",
    right: 5,
    paddingLeft: 5,
    fontSize: 12,
    bottom: ({ footer }) => (footer ? 42 : 2),
    "& a:not(.MuiIconButton-root)": {
      whiteSpace: "nowrap",
      textDecoration: "none !important",
    },
  },
}));

function Copyright() {
  const { t } = useTranslation();
  const topic = useSelector((state) => state.app.activeTopic);
  const map = useSelector((state) => state.app.map);
  const classes = useStyles({ footer: topic.elements.footer });

  return (
    <div className={`wkp-copyright ${classes.wrapper}`}>
      <RsCopyright
        map={map}
        format={(f) => `${t("Geodaten")} ${f.join(", ")}`}
      />
    </div>
  );
}

export default Copyright;
