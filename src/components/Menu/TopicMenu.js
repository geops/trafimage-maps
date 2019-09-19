import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { compose } from 'lodash/fp';
import PropTypes from 'prop-types';
import { FaInfoCircle } from 'react-icons/fa';
import LayerTree from 'react-spatial/components/LayerTree';
import Select from 'react-spatial/components/Select';
import LayerService from 'react-spatial/LayerService';
import Button from 'react-spatial/components/Button';
import Layer from 'react-spatial/layers/Layer';
import Collapsible from '../Collapsible';
import {
  setActiveTopic,
  setLayerSelectedForInfos,
} from '../../model/app/actions';

import './TopicMenu.scss';

const propTypes = {
  topic: PropTypes.shape().isRequired,
  layerService: PropTypes.instanceOf(LayerService).isRequired,

  // mapStateToProps
  activeTopic: PropTypes.shape().isRequired,
  layerSelectedForInfos: PropTypes.instanceOf(Layer),

  // mapDispatchToProps
  dispatchSetActiveTopic: PropTypes.func.isRequired,
  dispatchSetlayerSelectedForInfos: PropTypes.func.isRequired,

  t: PropTypes.func.isRequired,
};

const defaultProps = {
  layerSelectedForInfos: null,
};

class TopicMenu extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isCollapsed: false,
      currentBaseLayerKey: null,
    };
    this.updateCurrentBaseLayerKey = this.updateCurrentBaseLayerKey.bind(this);
  }

  componentDidMount() {
    this.listenLayerServiceEvent();

    const { layerService } = this.props;
    this.setState({
      currentBaseLayerKey:
        layerService &&
        layerService
          .getBaseLayers()
          .find(l => l.getVisible())
          .getKey(),
    });
  }

  componentDidUpdate(prevProps) {
    const { layerService } = this.props;
    if (layerService !== prevProps.layerService) {
      this.listenLayerServiceEvent(prevProps.layerService);
    }
  }

  componentWillUnmount() {
    this.unlistenLayerServiceEvent();
  }

  onTopicClick(topic) {
    const { activeTopic, dispatchSetActiveTopic } = this.props;
    const { isCollapsed } = this.state;

    if (topic.key === activeTopic.key) {
      this.setState({ isCollapsed: !isCollapsed });
    } else {
      dispatchSetActiveTopic(topic);
    }
  }

  listenLayerServiceEvent() {
    this.unlistenLayerServiceEvent();
    const { layerService } = this.props;
    if (layerService) {
      layerService.on('change:visible', this.updateCurrentBaseLayerKey);
    }
  }

  unlistenLayerServiceEvent(prevLayerService) {
    const { layerService } = this.props;
    if (layerService || prevLayerService) {
      (prevLayerService || layerService).un(
        'change:visible',
        this.updateCurrentBaseLayerKey,
      );
    }
  }

  updateCurrentBaseLayerKey(layer) {
    if (layer.getIsBaseLayer() && layer.getVisible()) {
      this.setState({
        currentBaseLayerKey: layer.getKey(),
      });
    }
  }

  renderInfoButton(layer) {
    const {
      layerSelectedForInfos,
      dispatchSetlayerSelectedForInfos,
    } = this.props;
    const isSelected = layerSelectedForInfos === layer;
    const className = `wkp-info-bt${isSelected ? ' wkp-selected' : ''}`;
    return (
      <Button
        className={className}
        onClick={() => {
          dispatchSetlayerSelectedForInfos(isSelected ? null : layer);
        }}
      >
        <FaInfoCircle focusable={false} />
      </Button>
    );
  }

  render() {
    const { t, layerService, topic, activeTopic } = this.props;
    const { isCollapsed, currentBaseLayerKey } = this.state;
    let layerTree = null;

    if (
      activeTopic.key === topic.key &&
      layerService &&
      layerService.getLayers()
    ) {
      layerTree = (
        <Collapsible isCollapsed={isCollapsed}>
          <div className="wkp-layer-tree">
            <LayerTree
              isItemHidden={l => l.getIsBaseLayer() || l.get('hideInLegend')}
              layerService={layerService}
              t={t}
              renderItemContent={(layer, layerTreeComp) => (
                <>
                  {layerTreeComp.renderItemContent(layer)}
                  {layer.get('hasInfos') && this.renderInfoButton(layer)}
                </>
              )}
            />
          </div>
        </Collapsible>
      );
    }

    const collapsed = isCollapsed || activeTopic.key !== topic.key;

    return (
      <div className="wkp-topic-menu">
        <div
          className="wkp-topic-menu-item"
          role="button"
          tabIndex={0}
          onClick={() => this.onTopicClick(topic)}
          onKeyPress={e => e.which === 13 && this.onTopicClick(topic)}
        >
          <div className="wkp-topic-title">
            <div className="wkp-topic-radio">
              {topic.key === activeTopic.key && (
                <div className="wkp-topic-radio-dot" />
              )}
            </div>
            {t(topic.name)}
          </div>
          <div
            className={`wkp-layer-toggler ${collapsed ? 'collapsed' : ''}`}
            style={{
              display: topic.key === activeTopic.key ? 'block' : 'none',
            }}
          />
        </div>
        <div className="wkp-topic-content">
          {topic.key === activeTopic.key &&
            layerService.getBaseLayers() &&
            layerService.getBaseLayers().length > 1 && (
              <Select
                options={layerService.getBaseLayers().map(l => {
                  return {
                    value: l.getKey(),
                    label: t(l.getKey()),
                    layer: l,
                  };
                })}
                value={currentBaseLayerKey}
                onChange={(evt, option) => {
                  option.layer.setVisible(true);
                  this.setState({
                    currentBaseLayerKey: option.value,
                  });
                }}
              />
            )}
          {layerTree}
        </div>
      </div>
    );
  }
}

TopicMenu.defaultProps = defaultProps;
TopicMenu.propTypes = propTypes;

const mapStateToProps = state => ({
  activeTopic: state.app.activeTopic,
  layerSelectedForInfos: state.app.layerSelectedForInfos,
});

const mapDispatchToProps = {
  dispatchSetActiveTopic: setActiveTopic,
  dispatchSetlayerSelectedForInfos: setLayerSelectedForInfos,
};

export default compose(
  withTranslation(),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(TopicMenu);
