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
import filters from '../../filters';
import {
  setActiveTopic,
  setSelectedForInfos,
  setFeatureInfo,
} from '../../model/app/actions';

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
  dispatchSetFeatureInfo: PropTypes.func.isRequired,

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
      layerService && layerService.getBaseLayers().find((l) => l.visible);
    if (visibleBaseLayer) {
      this.setState({
        currentBaseLayerKey: visibleBaseLayer.key,
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
    const {
      activeTopic,
      dispatchSetActiveTopic,
      dispatchSetFeatureInfo,
    } = this.props;
    const { isCollapsed } = this.state;

    if (topic.key === activeTopic.key) {
      this.setState({ isCollapsed: !isCollapsed });
    } else {
      dispatchSetActiveTopic(topic);
      dispatchSetFeatureInfo([]);
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
    if (layer.isBaseLayer && layer.visible) {
      this.setState({
        currentBaseLayerKey: layer.key,
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

  renderLockIcon(topic, isInfo) {
    const { activeTopic, t } = this.props;

    const className = `wkp-lock-icon${isInfo ? ' wkp-lock-left' : ''}${
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
    const TopicMenuBottom = topic.topicMenuBottom;

    if (
      activeTopic.key === topic.key &&
      layerService &&
      layerService.getLayers()
    ) {
      layerTree = (
        <div className="wkp-layer-tree">
          <LayerTree
            isItemHidden={(l) => l.isBaseLayer || l.get('hideInLegend')}
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
                {layer.renderItemContent
                  ? layer.renderItemContent(layerTreeComp)
                  : layerTreeComp.renderItemContent(layer)}
                {layer.get('hasInfos') && this.renderInfoButton(layer)}
              </>
            )}
            renderAfterItem={(layer, level) => {
              const component = layer.get('filtersComponent');
              if (component) {
                const FiltersComponent = filters[component];
                return (
                  <div
                    style={{
                      display: 'flex',
                      paddingLeft: `${30 * (level + 1)}px`,
                    }}
                  >
                    <FiltersComponent layer={layer} />
                  </div>
                );
              }
              return null;
            }}
          />
        </div>
      );
    }

    const collapsed = isCollapsed || activeTopic.key !== topic.key;
    const { key } = activeTopic.key;

    const isMenuVisibleLayers = (topic.layers || []).find((l) => {
      return !l.get('hideInLegend');
    });
    return (
      <div className="wkp-topic-menu">
        <div className="wkp-topic-menu-item-wrapper">
          <div
            className="wkp-topic-menu-item"
            role="button"
            tabIndex={0}
            aria-expanded={!isCollapsed}
            onClick={() => this.onTopicClick(topic)}
            onKeyPress={(e) => e.which === 13 && this.onTopicClick(topic)}
          >
            <div
              className={`wkp-topic-title${
                key === topic.key ? ' wkp-active' : ''
              }`}
            >
              <div className="wkp-topic-radio">
                {topic.key === key && <div className="wkp-topic-radio-dot" />}
              </div>
              {t(topic.name)}
            </div>
            {isMenuVisibleLayers && (
              <div
                className={`wkp-layer-toggler ${collapsed ? 'collapsed' : ''}`}
                style={{
                  display: topic.key === key ? 'block' : 'none',
                }}
              />
            )}
          </div>
          <div className="wkp-topic-icons">
            {topic &&
              topic.permission &&
              this.renderLockIcon(
                topic,
                topic.description || topic.layerInfoComponent,
              )}
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
                  options={layerService.getBaseLayers().map((l) => {
                    return {
                      value: l.name || l.key,
                      label: t(l.name || l.key),
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
            {topic.key === activeTopic.key && TopicMenuBottom ? (
              <TopicMenuBottom topic={topic} />
            ) : null}
          </Collapsible>
        </div>
      </div>
    );
  }
}

TopicMenu.defaultProps = defaultProps;
TopicMenu.propTypes = propTypes;

const mapStateToProps = (state) => ({
  menuOpen: state.app.menuOpen,
  map: state.app.map,
  activeTopic: state.app.activeTopic,
  selectedForInfos: state.app.selectedForInfos,
});

const mapDispatchToProps = {
  dispatchSetActiveTopic: setActiveTopic,
  dispatchSetSelectedForInfos: setSelectedForInfos,
  dispatchSetFeatureInfo: setFeatureInfo,
};

export default compose(
  withTranslation(),
  connect(mapStateToProps, mapDispatchToProps),
)(TopicMenu);
