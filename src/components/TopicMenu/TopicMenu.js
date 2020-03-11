import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { compose } from 'lodash/fp';
import PropTypes from 'prop-types';
import { FaInfoCircle, FaLock } from 'react-icons/fa';
import LayerTree from 'react-spatial/components/LayerTree';
import Select from '@geops/react-ui/components/Select';
import LayerService from 'react-spatial/LayerService';
import Button from '@geops/react-ui/components/Button';
import Collapsible from '../Collapsible';
import { setActiveTopic, setSelectedForInfos } from '../../model/app/actions';

const propTypes = {
  topic: PropTypes.shape().isRequired,
  layerService: PropTypes.instanceOf(LayerService).isRequired,

  // mapStateToProps
  menuOpen: PropTypes.bool.isRequired,
  activeTopic: PropTypes.shape().isRequired,
  selectedForInfos: PropTypes.object,

  // mapDispatchToProps
  dispatchSetActiveTopic: PropTypes.func.isRequired,
  dispatchSetSelectedForInfos: PropTypes.func.isRequired,

  t: PropTypes.func.isRequired,
};

const defaultProps = {
  selectedForInfos: null,
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
    const visibleBaseLayer =
      layerService && layerService.getBaseLayers().find(l => l.getVisible());
    if (visibleBaseLayer) {
      this.setState({
        currentBaseLayerKey: visibleBaseLayer.getKey(),
      });
    }
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

  renderInfoButton(selectedInfo) {
    const {
      t,
      activeTopic,
      selectedForInfos,
      dispatchSetSelectedForInfos,
    } = this.props;
    const isLayerButton = selectedInfo.isReactSpatialLayer;
    const isSelected = selectedForInfos === selectedInfo;

    let className;
    if (isLayerButton) {
      className = `wkp-info-layer-bt${isSelected ? ' wkp-selected' : ''}`;
    } else {
      className = `wkp-info-topic-bt${
        activeTopic.key === selectedInfo.key ? ' wkp-active' : ''
      }${isSelected ? ' wkp-selected' : ''}`;
    }

    return (
      <Button
        className={className}
        title={t('Layerinformationen anzeigen', { layer: t(selectedInfo.key) })}
        onClick={() => {
          dispatchSetSelectedForInfos(isSelected ? null : selectedInfo);
        }}
      >
        <FaInfoCircle focusable={false} />
      </Button>
    );
  }

  renderLockIcon(topic) {
    const { activeTopic, t } = this.props;

    const className = `wkp-lock-icon${
      activeTopic.key === topic.key ? ' wkp-active' : ''
    }`;

    return (
      <div className={className}>
        <FaLock
          focusable={false}
          title={t('Vertraulich/ Nur SBB-intern verfügbar')}
        />
      </div>
    );
  }

  render() {
    const { t, layerService, topic, activeTopic, menuOpen } = this.props;
    const { isCollapsed, currentBaseLayerKey } = this.state;
    let layerTree = null;

    if (
      activeTopic.key === topic.key &&
      layerService &&
      layerService.getLayers()
    ) {
      layerTree = (
        <div className="wkp-layer-tree">
          <LayerTree
            isItemHidden={l => l.getIsBaseLayer() || l.get('hideInLegend')}
            layerService={layerService}
            t={t}
            titles={{
              layerShow: t('Layer anzeigen'),
              layerHide: t('Layer verbergen'),
              subLayerShow: t('Unterlayer anzeigen'),
              subLayerHide: t('Unterlayer verbergen'),
            }}
            renderItemContent={(layer, layerTreeComp) => (
              <>
                {layerTreeComp.renderItemContent(layer)}
                {layer.get('hasInfos') && this.renderInfoButton(layer)}
              </>
            )}
          />
        </div>
      );
    }

    const collapsed = isCollapsed || activeTopic.key !== topic.key;

    return (
      <div className="wkp-topic-menu">
        <div className="wkp-topic-menu-item-wrapper">
          <div
            className="wkp-topic-menu-item"
            role="button"
            tabIndex={0}
            aria-expanded={!isCollapsed}
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
          <div className="wkp-topic-icons">
            {topic && topic.permission && this.renderLockIcon(topic)}
            {menuOpen &&
              topic &&
              (topic.description || topic.layerInfoComponent) &&
              this.renderInfoButton(topic)}
          </div>
        </div>
        <div className="wkp-topic-content">
          <Collapsible isCollapsed={isCollapsed}>
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
          </Collapsible>
        </div>
      </div>
    );
  }
}

TopicMenu.defaultProps = defaultProps;
TopicMenu.propTypes = propTypes;

const mapStateToProps = state => ({
  menuOpen: state.app.menuOpen,
  map: state.app.map,
  activeTopic: state.app.activeTopic,
  selectedForInfos: state.app.selectedForInfos,
});

const mapDispatchToProps = {
  dispatchSetActiveTopic: setActiveTopic,
  dispatchSetSelectedForInfos: setSelectedForInfos,
};

export default compose(
  withTranslation(),
  connect(mapStateToProps, mapDispatchToProps),
)(TopicMenu);
