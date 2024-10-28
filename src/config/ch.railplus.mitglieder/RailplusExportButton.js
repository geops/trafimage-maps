import React from "react";
import { PropTypes } from "prop-types";
import { BsDownload } from "react-icons/bs";
import MapButton from "../../components/MapButton";
import ExportButton from "../../components/ExportButton";
import { ReactComponent as Loader } from "../../img/loader.svg";
import { RAILPLUS_EXPORTBTN_ID } from "../../utils/constants";
import { sizesByFormat } from "../../utils/exportUtils";

const format = "a0";

function BtnCmpt({ isLoading, ...props }) {
  return (
    <MapButton {...props} style={{ padding: 8, color: "#444" }}>
      {isLoading ? <Loader /> : <BsDownload />}
    </MapButton>
  );
}
BtnCmpt.propTypes = { isLoading: PropTypes.bool };

const center = [909001.8239356248, 5915092.625643606];

const params = new URLSearchParams(window.location.search);

function RailplusExportButton() {
  if (params.get("exportbtn") !== "true") return null;
  return (
    <ExportButton
      id={RAILPLUS_EXPORTBTN_ID}
      exportFormat={format}
      exportScale={3}
      exportSize={sizesByFormat[format]}
      exportZoom={9.85}
      exportExtent={null}
      exportCoordinates={[center, center]}
      trackingEventOptions={null}
    >
      <BtnCmpt />
    </ExportButton>
  );
}

export default React.memo(RailplusExportButton);
