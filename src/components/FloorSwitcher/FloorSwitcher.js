import React, { PureComponent } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getBottomLeft, getTopRight } from "ol/extent";
import { transform } from "ol/proj";
import { IconButton, List, ListItem } from "@mui/material";
import { Layer } from "mobility-toolbox-js/ol";
import { unByKey } from "ol/Observable";
import LayerService from "../../utils/LayerService";
import { FLOOR_LEVELS } from "../../utils/constants";

export const WALKING_BASE_URL = process.env.REACT_APP_WALKING_URL;

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
  activeTopic: PropTypes.string.isRequired,
};

class FloorSwitcher extends PureComponent {
  constructor(props) {
    super(props);

    this.olListeners = [];
    this.layerService = new LayerService();
    this.state = {
      floors: [],
      activeFloor: "2D",
      baseLayerHasLevelLayers: false,
    };
    this.onBaseLayerChange = this.onBaseLayerChange.bind(this);
    this.abortController = new AbortController();
  }

  componentDidMount() {
    this.initialize();
    this.loadFloors();
  }

  componentDidUpdate(prevProps, prevState) {
    const { center, zoom, layers, activeTopic } = this.props;
    const { activeFloor, floors } = this.state;

    if (prevProps.layers !== layers) {
      this.initialize();
    }

    if (prevProps.center !== center) {
      this.loadFloors();
    }

    if (
      prevProps.activeTopic !== activeTopic ||
      (prevState.floors !== floors && !floors.includes(activeFloor))
    ) {
      // Reset to 2D when the active floor is no longer in the extent floors and on topic change
      this.selectFloor("2D");
    }

    if (prevProps.zoom !== zoom) {
      // Apply 2D floor when zoom is less than 16, use state floor otherwise
      this.selectFloor(zoom <= 16 ? "2D" : activeFloor, false);
    }
  }

  componentWillUnmount() {
    // Reset when a topic without floors is loaded
    this.selectFloor("2D");
    this.removeMapListeners();
  }

  onBaseLayerChange() {
    const visibleBaselayer = this.layerService
      .getBaseLayers()
      .find((l) => l.visible);

    const levelLayerBaselayers = this.layerService
      .getLayer("ch.sbb.geschosse")
      ?.children[0]?.get("baselayers");
    this.setState({
      baseLayerHasLevelLayers: levelLayerBaselayers?.includes(visibleBaselayer),
    });
  }

  addMapListeners() {
    this.removeMapListeners();
    const baselayers = this.layerService.getBaseLayers();
    baselayers.forEach((layer) => {
      this.olListeners.push(layer.on("change:visible", this.onBaseLayerChange));
    });
  }

  initialize() {
    const { layers } = this.props;
    this.layerService.setLayers(layers);
    this.onBaseLayerChange();
    this.addMapListeners();
  }

  removeMapListeners() {
    unByKey(this.olListeners);
  }

  loadFloors() {
    const { map } = this.props;
    this.abortController.abort();
    this.abortController = new AbortController();
    const { signal } = this.abortController;

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

  selectFloor(floor, shouldSetState = true) {
    this.layerService
      .getLayer(`ch.sbb.geschosse`)
      ?.children.forEach((layer) => {
        // eslint-disable-next-line no-param-reassign
        layer.visible = false;
      });

    const layer = this.layerService.getLayer(`ch.sbb.geschosse${floor}`);
    if (layer) {
      layer.visible = true;
      if (shouldSetState) {
        this.setState({ activeFloor: floor });
      }
    }
  }

  render() {
    const { zoom } = this.props;
    const { floors, activeFloor, baseLayerHasLevelLayers } = this.state;

    if (zoom < 16 || floors?.length <= 2 || !baseLayerHasLevelLayers) {
      return null;
    }

    return (
      <List
        className="wkp-floor-switcher"
        sx={{
          zIndex: 1000,
          boxShadow: "0 0 7px rgba(0, 0, 0, 0.9)",
          borderRadius: "20px",
          overflow: "hidden",
          backgroundColor: "white",
          gap: "2px",
          display: "flex",
          flexDirection: "column",
          transition: "box-shadow 0.5s ease",
          "&:hover": {
            boxShadow: "0 0 12px 2px rgba(0, 0, 0, 0.9)",
          },
        }}
      >
        {floors.map((floor) => {
          const color = floor === activeFloor ? "white" : "#444";
          const backgroundColor = floor === "2D" ? "#e8e7e7" : "white";
          return (
            <ListItem
              key={floor}
              disablePadding
              sx={{
                width: 40,
                height: 40,
                padding: 0.5,
                backgroundColor: floor === "2D" ? "#e8e7e7" : "white",
              }}
            >
              <IconButton
                onClick={() => this.selectFloor(floor)}
                sx={{
                  typography: "body1",
                  borderRadius: "50%",
                  backgroundColor:
                    activeFloor === floor ? "#444" : backgroundColor,
                  border: 0,
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  height: "100%",
                  color,
                  "&:hover": {
                    color: floor === activeFloor ? "white" : "secondary.dark",
                    backgroundColor:
                      activeFloor === floor ? "#444" : backgroundColor,
                  },
                }}
              >
                {floor}
              </IconButton>
            </ListItem>
          );
        })}
      </List>
    );
  }
}

const mapStateToProps = (state) => ({
  center: state.map.center,
  zoom: state.map.zoom,
  map: state.app.map,
  layers: state.map.layers,
  activeTopic: state.app.activeTopic,
});

const mapDispatchToProps = {};

FloorSwitcher.propTypes = propTypes;

export default connect(mapStateToProps, mapDispatchToProps)(FloorSwitcher);
