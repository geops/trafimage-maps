import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ConfigReader from 'react-spatial/ConfigReader';
import LayerService from 'react-spatial/LayerService';
import OLMap from 'ol/Map';
import Layer from 'react-spatial/Layer';
import LAYER_CONF from '../../appConfig/layers';
import { setActiveTopic } from '../../model/app/actions';
import { setLayers } from '../../model/map/actions';

const propTypes = {
  topic: PropTypes.string.isRequired,
  baseLayers: PropTypes.arrayOf(PropTypes.instanceOf(Layer)),
  layers: PropTypes.arrayOf(PropTypes.instanceOf(Layer)),
  layerService: PropTypes.instanceOf(LayerService).isRequired,
  map: PropTypes.instanceOf(OLMap).isRequired,

  // mapDispatchToProps
  dispatchSetActiveTopic: PropTypes.func.isRequired,
  dispatchSetLayers: PropTypes.func.isRequired,
};

const defaultProps = {
  baseLayers: null,
  layers: null,
};

class TopicLoader extends Component {
  constructor(props) {
    super(props);
    const { dispatchSetActiveTopic, topic } = this.props;
    dispatchSetActiveTopic(topic);
  }

  componentDidMount() {
    const {
      dispatchSetLayers,
      baseLayers,
      layers,
      layerService,
      topic,
    } = this.props;

    const appLayers = this.getTopicLayers(topic);
    const bl = baseLayers || appLayers.filter(l => l.getIsBaseLayer());
    const tl = layers || appLayers.filter(l => !l.getIsBaseLayer());
    const newLayers = [...bl, ...tl];

    layerService.setLayers(newLayers);
    dispatchSetLayers(newLayers);
  }

  getTopicLayers(topicName) {
    const { map } = this.props;
    const layers = LAYER_CONF.filter(l => l.topics.includes(topicName));
    return ConfigReader.readConfig(map, layers);
  }

  render() {
    return null;
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  dispatchSetActiveTopic: setActiveTopic,
  dispatchSetLayers: setLayers,
};

TopicLoader.propTypes = propTypes;
TopicLoader.defaultProps = defaultProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TopicLoader);
