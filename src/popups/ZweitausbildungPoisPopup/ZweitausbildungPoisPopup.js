import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Feature from "ol/Feature";
import ZweitausbildungPoisLayer from "../../layers/ZweitausbildungPoisLayer";

import "./ZweitausbildungPoisPopup.scss";

const propTypes = {
  feature: PropTypes.arrayOf(PropTypes.instanceOf(Feature)).isRequired,
  layer: PropTypes.oneOfType([
    PropTypes.instanceOf(ZweitausbildungPoisLayer),
    PropTypes.arrayOf(PropTypes.instanceOf(ZweitausbildungPoisLayer)),
  ]).isRequired,
  t: PropTypes.func.isRequired,
};

class ZweitausbildungPoisPopup extends PureComponent {
  render() {
    const { feature, layer, t } = this.props;
    // if feature is an array, layer is also an array
    return (
      <div className="wkp-zweitausbildung-pois-popup">
        {(Array.isArray(feature) ? feature : [feature]).map((feat, index) => (
          <div
            className="wkp-zweitausbildung-pois-popup-row"
            key={feat.get("name")}
            onMouseEnter={() => layer[index].highlightFromPopup(feat, true)}
            onMouseLeave={() => layer[index].highlightFromPopup(feat, false)}
          >
            <b>{feat.get("name")}</b>
            {!!feat.get("rail_away") && (
              <div className="wkp-zweitausbildung-pois-popup-railaway">
                RailAway
              </div>
            )}
            <div className="wkp-zweitausbildung-pois-popup-image">
              {!!feat.get("foto") && (
                <img
                  src={feat.get("foto")}
                  draggable="false"
                  alt={t("Kein Bildtext")}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }
}

ZweitausbildungPoisPopup.propTypes = propTypes;

const composed = ZweitausbildungPoisPopup;

composed.renderTitle = (feat, layer, t) => t("Detailinformationen");
composed.hidePagination = true;
export default composed;
