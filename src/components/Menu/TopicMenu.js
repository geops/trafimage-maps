import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { compose } from 'lodash/fp';
import PropTypes from 'prop-types';
import { FaInfoCircle } from 'react-icons/fa';
import LayerTree from 'react-spatial/components/LayerTree';
import LayerService from 'react-spatial/LayerService';
import Button from 'react-spatial/components/Button';
import Layer from 'react-spatial/layers/Layer';
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
  layerInfosOpen: PropTypes.instanceOf(Layer),

  // mapDispatchToProps
  dispatchSetActiveTopic: PropTypes.func.isRequired,
  dispatchSetLayerInfosOpen: PropTypes.func.isRequired,

  t: PropTypes.func.isRequired,
};

const defaultProps = {
  layerInfosOpen: null,
};

class TopicMenu extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isCollapsed: false,
    };
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

  renderInfoButton(layer) {
    const { layerInfosOpen, dispatchSetLayerInfosOpen } = this.props;
    const isSelected = layerInfosOpen === layer;
    const className = `wkp-info-bt${isSelected ? ' wkp-selected' : ''}`;
    return (
      <Button
        className={className}
        onClick={() => {
          dispatchSetLayerInfosOpen(isSelected ? null : layer);
        }}
      >
        <FaInfoCircle focusable={false} />
      </Button>
    );
  }

  render() {
    const { t, layerService, topic, activeTopic } = this.props;
    const { isCollapsed } = this.state;
    let layerTree = null;

    if (activeTopic.key === topic.key) {
      layerTree = (
        <LayerTree
          isItemHidden={l => l.getIsBaseLayer() || l.get('hideInLegend')}
          layerService={layerService}
          t={t}
          renderItemContent={(layer, layerTreeComp) => {
            return (
              <>
                {layerTreeComp.renderItemContent(layer)}
                {layer.get('hasInfos') && this.renderInfoButton(layer)}
              </>
            );
          }}
        />
      );
    }

    const collapsed = isCollapsed || activeTopic.key !== topic.key;

    return (
      <div className={`wkp-topic-menu ${collapsed ? 'collapsed' : ''}`}>
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
        <div className="wkp-layer-tree">{layerTree}</div>
      </div>
    );
  }
}

TopicMenu.defaultProps = defaultProps;
TopicMenu.propTypes = propTypes;

const mapStateToProps = state => ({
  activeTopic: state.app.activeTopic,
  layerInfosOpen: state.app.layerInfosOpen,
});

const mapDispatchToProps = {
  dispatchSetActiveTopic: setActiveTopic,
  dispatchSetLayerInfosOpen: setLayerSelectedForInfos,
};

export default compose(
  withTranslation(),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(TopicMenu);
