import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { FaInfoCircle } from "react-icons/fa";
import { IconButton } from "@mui/material";
import { setSelectedForInfos } from "../../model/app/actions";
import { trackEvent } from "../../utils/trackingUtils";

function InfosButton({ selectedInfo, className = "wkp-info-bt" }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const selectedForInfos = useSelector((state) => state.app.selectedForInfos);
  const activeTopic = useSelector((state) => state.app.activeTopic);

  const isSelected = useMemo(() => {
    return selectedForInfos === selectedInfo;
  }, [selectedForInfos, selectedInfo]);

  const classNam = useMemo(() => {
    const classes = [className];

    if (isSelected) {
      classes.push("wkp-selected");
    }
    return classes.join(" ");
  }, [className, isSelected]);

  return (
    <IconButton
      className={classNam}
      title={t("Layerinformationen anzeigen", { layer: t(selectedInfo.key) })}
      onClick={(evt) => {
        trackEvent(
          {
            eventType: "action",
            componentName: "info button",
            label: t(selectedInfo.key),
            location: t(activeTopic?.name, { lng: "de" }),
            variant: selectedInfo?.get ? "Layer" : "Topic", // We test the get method for layer or topic, see LayerInfosDialog.js
          },
          activeTopic,
        );
        dispatch(setSelectedForInfos(isSelected ? null : selectedInfo));
        evt.stopPropagation();
      }}
      data-cy={`infos-button-${selectedInfo.key || selectedInfo.name}`}
    >
      <FaInfoCircle focusable={false} />
    </IconButton>
  );
}

InfosButton.propTypes = {
  // A topic or a layer
  selectedInfo: PropTypes.object.isRequired,
  className: PropTypes.string,
};

export default React.memo(InfosButton);
