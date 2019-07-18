import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LayerService from 'react-spatial/LayerService';
import Layer from 'react-spatial/Layer';
import TrafimageLayer from '../../layers/TrafimageLayer';
import TOPIC_CONF from '../../appConfig/topics';
import { setActiveTopic } from '../../model/app/actions';
import { setLayers } from '../../model/map/actions';

const propTypes = {
  topic: PropTypes.string.isRequired,
  activeTopic: PropTypes.shape(),
  baseLayers: PropTypes.arrayOf(PropTypes.instanceOf(Layer)),
  layers: PropTypes.arrayOf(PropTypes.instanceOf(Layer)),
  layerService: PropTypes.instanceOf(LayerService).isRequired,
  token: PropTypes.string,

  // mapDispatchToProps
  dispatchSetActiveTopic: PropTypes.func.isRequired,
  dispatchSetLayers: PropTypes.func.isRequired,
};

const defaultProps = {
  activeTopic: null,
  baseLayers: null,
  layers: null,
  token: null,
};

class TopicLoader extends Component {
  constructor(props) {
    super(props);
    const { dispatchSetActiveTopic, topic } = this.props;
    this.topic = TOPIC_CONF.find(t => t.key === topic);
    dispatchSetActiveTopic(this.topic);
  }

  componentDidMount() {
    const { baseLayers, layers } = this.props;
    const appLayers = this.topic.layers;
    const bl = baseLayers || appLayers.filter(l => l.getIsBaseLayer());
    const tl = layers || appLayers.filter(l => !l.getIsBaseLayer());
    const newLayers = [...bl, ...tl];
    this.updateLayers(newLayers);
  }

  componentDidUpdate(prevProps) {
    const { activeTopic } = this.props;

    if (activeTopic !== prevProps.activeTopic) {
      this.updateLayers(activeTopic.layers);
    }
  }

  updateLayers(layers) {
    const { layerService, dispatchSetLayers, token } = this.props;
    layerService.setLayers(layers);
    dispatchSetLayers(layers);

    if (token) {
      layers
        .filter(l => l instanceof TrafimageLayer)
        .forEach(l => l.setToken(token));
    }
  }

  render() {
    return null;
  }
}

const mapStateToProps = state => ({
  activeTopic: state.app.activeTopic,
});

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
