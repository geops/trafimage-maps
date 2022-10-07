import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { FaLock } from 'react-icons/fa';
import LayerTree from 'react-spatial/components/LayerTree';
import { withStyles, MenuItem } from '@material-ui/core';
import LayerService from '../../utils/LayerService';
import Collapsible from '../Collapsible';
import filters from '../../filters';
import {
  setActiveTopic,
  setFeatureInfo,
  updateDrawEditLink,
} from '../../model/app/actions';
import Select from '../Select/Select';
import InfosButton from '../InfosButton';
import TopicInfosButton from '../TopicInfosButton';

const styles = (theme) => ({
  baselayerSelect: {
    margin: '4px 20px 5px 23px',
    height: 30,
    width: 'calc(100% - 42px)',
    [theme.breakpoints.up('lg')]: {
      display: 'none',
    },
  },
});

const propTypes = {
  topic: PropTypes.shape().isRequired,

  // mapStateToProps
  menuOpen: PropTypes.bool.isRequired,
  activeTopic: PropTypes.shape().isRequired,
  layerService: PropTypes.instanceOf(LayerService).isRequired,

  // mapDispatchToProps
  dispatchSetActiveTopic: PropTypes.func.isRequired,
  dispatchSetFeatureInfo: PropTypes.func.isRequired,

  // Mui
  classes: PropTypes.object.isRequired,

  t: PropTypes.func.isRequired,
};

class TopicMenu extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isCollapsed: false,
      currentBaseLayerKey: null,
    };
  }

  onTopicClick(topic) {
    const { activeTopic, dispatchSetActiveTopic, dispatchSetFeatureInfo } =
      this.props;
    const { isCollapsed } = this.state;

    if (topic.key === activeTopic.key) {
      this.setState({ isCollapsed: !isCollapsed });
    } else {
      dispatchSetActiveTopic(topic);
      dispatchSetFeatureInfo();
    }
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
    const { t, layerService, topic, activeTopic, menuOpen, classes } =
      this.props;
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
            isItemHidden={(l) => l.get('isBaseLayer') || l.get('hideInLegend')}
            layers={layerService.getLayers()}
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
                {layer.get('hasInfos') && <InfosButton selectedInfo={layer} />}
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
    const isActiveTopic = topic.key === activeTopic.key;
    const isMenuVisibleLayers = (topic.layers || []).find((l) => {
      return !l.get('hideInLegend');
    });
    const baseLayers = layerService.getBaseLayers();
    const currentBaseLayer = baseLayers.find((l) => l.visible);

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
              className={`wkp-topic-title${isActiveTopic ? ' wkp-active' : ''}`}
            >
              <div className="wkp-topic-radio">
                {isActiveTopic && <div className="wkp-topic-radio-dot" />}
              </div>
              {t(topic.name)}
            </div>
            {isMenuVisibleLayers && (
              <div
                className={`wkp-layer-toggler ${collapsed ? 'collapsed' : ''}`}
                style={{
                  display: isActiveTopic ? 'block' : 'none',
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
              (topic.description || topic.layerInfoComponent) && (
                <TopicInfosButton topic={topic} />
              )}
          </div>
        </div>
        <div className="wkp-topic-content">
          <Collapsible isCollapsed={isCollapsed}>
            {topic.key === activeTopic.key && baseLayers.length > 1 && (
              <Select
                className={classes.baselayerSelect}
                value={
                  currentBaseLayerKey ||
                  currentBaseLayer.name ||
                  currentBaseLayer.key
                }
                onChange={(evt) => {
                  const { value } = evt.target;
                  const baseLayer = baseLayers.find(({ name, key }) => {
                    const val = name || key;
                    return val === value || val === value;
                  });
                  // baseLayer.setVisible(true);
                  baseLayer.visible = true;
                  this.setState({
                    currentBaseLayerKey: baseLayer.name || baseLayer.key,
                  });
                }}
                MenuProps={{
                  PaperProps: {
                    style: {
                      padding: 0,
                      marginTop: -10,
                    },
                  },
                }}
                data-cy="baselayer-select"
              >
                {baseLayers.map(({ name, key }) => {
                  const value = name || key;
                  return (
                    <MenuItem key={value} value={value}>
                      {t(value)}
                    </MenuItem>
                  );
                })}
              </Select>
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

TopicMenu.propTypes = propTypes;

const mapStateToProps = (state) => ({
  menuOpen: state.app.menuOpen,
  map: state.app.map,
  activeTopic: state.app.activeTopic,
  layerService: state.app.layerService,
});

const mapDispatchToProps = {
  dispatchSetActiveTopic: setActiveTopic,
  dispatchSetFeatureInfo: setFeatureInfo,
  dispatchUpdateDrawEditLink: updateDrawEditLink,
};

export default compose(
  withTranslation(),
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles, { withTheme: true }),
)(TopicMenu);
