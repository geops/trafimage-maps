import React, { PureComponent } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getBottomLeft, getTopRight } from "ol/extent";
import { transform } from "ol/proj";
import { Divider, List, ListItem } from "@mui/material";
import { Layer } from "mobility-toolbox-js/ol";
import LayerService from "../../utils/LayerService";

export const FLOOR_LEVELS = [-6, -5, -4, -3, -2, -1, 0, "2D", 1, 2, 3, 4, 5, 6];

export const WALKING_BASE_URL = `https://walking.geops.io/`;

export const to4326 = (coord, decimal = 5) => {
  return transform(coord, "EPSG:3857", "EPSG:4326").map((c) =>
    parseFloat(c.toFixed(decimal)),
  );
};

const propTypes = {
  // mapStateToProps
  center: PropTypes.arrayOf(PropTypes.number.isRequired),
  zoom: PropTypes.number.isRequired,
  map: PropTypes.object.isRequired,
  layers: PropTypes.arrayOf(PropTypes.instanceOf(Layer)).isRequired,
};

let abortController = new AbortController();

class FloorSwitcher extends PureComponent {
  /**
   * Sort floors based on their latitude.
   */
  static sortFloors(floors) {
    const sorted = [...floors];
    sorted.sort(
      (a, b) => parseInt(b.iabp_name, 10) - parseInt(a.iabp_name, 10),
    );

    return sorted;
  }

  constructor(props) {
    super(props);

    this.state = {
      floors: [],
      activeFloor: "2D",
    };
  }

  componentDidMount() {
    this.loadFloors();
  }

  componentDidUpdate(prevProps) {
    const { center, zoom } = this.props;

    if (prevProps.center !== center) {
      this.loadFloors();
    }

    if (prevProps.zoom !== zoom && zoom < 16) {
      this.selectFloor("2D");
    }
  }

  componentWillUnmount() {
    // Reset when a topic without floors is loaded
    this.selectFloor("2D");
  }

  loadFloors() {
    const { map } = this.props;
    abortController.abort();
    abortController = new AbortController();
    const { signal } = abortController;

    const extent = map.getView().calculateExtent();
    const reqUrl = `${WALKING_BASE_URL}availableLevels?bbox=${to4326(
      getBottomLeft(extent),
    )
      .reverse()
      .join(",")}|${to4326(getTopRight(extent)).reverse().join(",")}`;
    fetch(reqUrl, { signal })
      .then((response) => response.json())
      .then((response) => {
        const floors = response.properties.availableLevels
          .filter((level) => FLOOR_LEVELS.includes(level))
          .join()
          .split(",");
        if (!floors.includes("2D")) {
          floors.splice(floors.indexOf("0") + 1, 0, "2D");
        }
        this.setState({
          floors: floors.reverse(),
        });
      })
      .catch((err) => {
        if (err.name === "AbortError") {
          // eslint-disable-next-line no-console
          console.warn(`Abort ${reqUrl}`);
          return;
        }
        // It's important to rethrow all other errors so you don't silence them!
        // For example, any error thrown by setState(), will pass through here.
        throw err;
      });
  }

  selectFloor(floor) {
    const { layers } = this.props;
    const layerService = new LayerService(layers);
    layerService.getLayer(`ch.sbb.geschosse`).children.forEach((layer) => {
      // eslint-disable-next-line no-param-reassign
      layer.visible = false;
    });
    const layer = layerService.getLayer(`ch.sbb.geschosse${floor}`);
    if (layer) {
      layer.visible = true;
      this.setState({ activeFloor: floor });
    }
  }

  render() {
    const { zoom } = this.props;
    const { floors, activeFloor } = this.state;

    if (zoom < 16) {
      return null;
    }

    return (
      <List
        className="wkp-floor-switcher"
        sx={{
          zIndex: 1000,
          width: 32,
          boxShadow: "0 0 7px rgba(0, 0, 0, 0.9)",
          borderRadius: "25px",
          overflow: "hidden",
          backgroundColor: "white",
          gap: 0.5,
          padding: 0.5,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {floors.map((floor) => (
          <>
            {floor === "2D" && (
              <Divider sx={{ borderColor: "text.secondary" }} />
            )}
            <ListItem
              key={floor}
              component="button"
              disablePadding
              onClick={() => this.selectFloor(floor)}
              sx={{
                fontWeight: floor === "2D" ? "bold" : "normal",
                borderRadius: "50%",
                backgroundColor: activeFloor === floor ? "#444" : "white",
                border: 0,
                alignItems: "center",
                justifyContent: "center",
                height: 32,
                color: activeFloor === floor ? "white" : "text.secondary",
                "&:hover": {
                  color: activeFloor === floor ? "white" : "secondary.dark",
                },
              }}
            >
              {floor}
            </ListItem>
            {floor === "2D" && (
              <Divider sx={{ borderColor: "text.secondary" }} />
            )}
          </>
        ))}
      </List>
    );
  }
}

const mapStateToProps = (state) => ({
  center: state.map.center,
  zoom: state.map.zoom,
  map: state.app.map,
  layers: state.map.layers,
});

const mapDispatchToProps = {};

FloorSwitcher.propTypes = propTypes;

export default connect(mapStateToProps, mapDispatchToProps)(FloorSwitcher);
