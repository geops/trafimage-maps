import React from "react";
import { useSelector } from "react-redux";
import { Box } from "@mui/material";
import useTranslation from "../../utils/useTranslation";

function TopicTelephoneInfos() {
  const { t } = useTranslation();
  const activeTopic = useSelector((state) => state.app.activeTopic);

  return (
    <Box
      sx={(theme) => ({
        position: "absolute",
        top: 110,
        left: "50%",
        transform: "translate(-50%, 0)",
        zIndex: 1,
        height: 0,
        backgroundColor: "white",
        overflow: "hidden",
        [theme.breakpoints.down("lg")]: {
          top: 65,
        },
        ".tm-barrier-free &": {
          "&:focus": {
            padding: 1.25, // themeSpacing (10px)
            border: "2px solid #666",
            height: "auto",
          },
        },
      })}
      data-testid="wkp-tel-infos"
      className="wkp-tel-infos"
      tabIndex={0}
      role="button"
    >
      {t("telephone_information", {
        name: t(activeTopic?.name),
      })}
    </Box>
  );
}

export default TopicTelephoneInfos;
