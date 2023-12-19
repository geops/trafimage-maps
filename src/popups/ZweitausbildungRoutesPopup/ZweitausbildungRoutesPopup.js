import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Feature from "ol/Feature";
import { withTranslation } from "react-i18next";
import { compose } from "redux";
import ZweitausbildungRoutesHighlightLayer from "../../layers/ZweitausbildungRoutesHighlightLayer";

import "./ZweitausbildungRoutesPopup.scss";

const propTypes = {
  layer: PropTypes.instanceOf(ZweitausbildungRoutesHighlightLayer).isRequired,
  feature: PropTypes.instanceOf(Feature).isRequired,
  t: PropTypes.func.isRequired,
  staticFilesUrl: PropTypes.string.isRequired,
};

class ZweitausbildungRoutesPopup extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      labelSelected: null,
    };
  }

  componentDidMount() {
    this.highlightFirstLine();
  }

  componentDidUpdate(prevProps) {
    const { feature } = this.props;

    if (feature !== prevProps.feature) {
      this.highlightFirstLine();
    }
  }

  componentWillUnmount() {
    const { layer } = this.props;
    layer.onSelect();
    layer.forceRenderList();
  }

  highlightFirstLine() {
    const { layer, feature } = this.props;
    const labels = feature.get(layer.property).split(",");
    layer.onSelect(labels[0], true);
    layer.forceRenderList();
    this.setState({ labelSelected: labels[0] });
  }

  render() {
    const { labelSelected } = this.state;
    const { t, staticFilesUrl, layer, feature } = this.props;
    const labels = feature.get(layer.property).split(",");

    return (
      <div className="wkp-zweitausbildung-routes-popup">
        {labels.map((label) => {
          return (
            <div
              className={`wkp-zweitausbildung-routes-popup-row${
                labelSelected === label ? " highlight" : ""
              }`}
              key={label}
              onMouseEnter={() => {
                layer.onSelect(label);
                layer.forceRenderList();
                this.setState({ labelSelected: label });
              }}
            >
              {layer.lines[label]?.shortname ? (
                <span className="wkp-zweitausbildung-routes-popup-image">
                  <img
                    src={`${staticFilesUrl}/img/layers/zweitausbildung/${layer.lines[label].shortname}.png`}
                    height="16"
                    width="42"
                    draggable="false"
                    alt={t("Kein Bildtext")}
                  />
                </span>
              ) : null}
              <b>{label.split(":")[0]}</b>
              <div className="wkp-zweitausbildung-routes-popup-desc">
                {label.split(":")[1]}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

ZweitausbildungRoutesPopup.propTypes = propTypes;

const composed = compose(withTranslation())(ZweitausbildungRoutesPopup);

composed.renderTitle = (feat, layer, t) => t("Detailinformationen");
export default composed;
