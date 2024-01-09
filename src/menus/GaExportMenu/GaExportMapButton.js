import React from "react";
import { BsDownload } from "react-icons/bs";
import { useDispatch } from "react-redux";
import MapButton from "../../components/MapButton";
import { setDialogVisible } from "../../model/app/actions";
import { NAME as GA_EXPORT_MENU_NAME } from "./GaExportMenu";

function GaExportMapButton() {
  const dispatch = useDispatch();
  return (
    <MapButton
      onClick={() => dispatch(setDialogVisible(GA_EXPORT_MENU_NAME))}
      style={{ padding: 8, color: "#444" }}
    >
      <BsDownload />
    </MapButton>
  );
}

export default GaExportMapButton;
