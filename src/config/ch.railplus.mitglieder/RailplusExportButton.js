import React from "react";
import { PropTypes } from "prop-types";
import { BsDownload } from "react-icons/bs";
import MapButton from "../../components/MapButton";
import ExportButton from "../../components/ExportButton";
import { ReactComponent as Loader } from "../../img/loader.svg";
import { RAILPLUS_EXPORTBTN_ID } from "../../utils/constants";
import { sizesByFormat } from "../../utils/exportUtils";

const format = "a0";

function BtnCmpt({ isLoading, style, ...props }) {
  return (
    <MapButton
      {...props}
      style={{ padding: 10, color: "#444", ...(style || {}) }}
    >
      {isLoading ? <Loader /> : <BsDownload />}
    </MapButton>
  );
}
BtnCmpt.propTypes = { isLoading: PropTypes.bool, style: PropTypes.object };

const center = [909001.8239356248, 5915092.625643606];

const params = new URLSearchParams(window.location.search);

function RailplusExportButton() {
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
      style={{
        display: params.get("exportbtn") === "true" ? "block" : "none", // just hide the button so message can trigger download
      }}
    >
      <BtnCmpt />
    </ExportButton>
  );
}

export default React.memo(RailplusExportButton);
