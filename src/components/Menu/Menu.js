import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { compose } from 'lodash/fp';
import PropTypes from 'prop-types';
import LayerService from 'react-spatial/LayerService';
import LayerTree from 'react-spatial/components/LayerTree';
import MenuHeader from './MenuHeader';
import TopicMenu from './TopicMenu';
import { setActiveTopic } from '../../model/app/actions';

import './Menu.scss';

const propTypes = {
  activeTopic: PropTypes.shape().isRequired,
  topics: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  layerService: PropTypes.instanceOf(LayerService).isRequired,
  t: PropTypes.func.isRequired,
  dispatchSetActiveTopic: PropTypes.func.isRequired,
};

class Menu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      openTopicKey: null,
      menuLayers: [],
      allMenuLayersVisible: false,
    };

    const { layerService } = this.props;
    layerService.on('change:visible', () => this.updateMenuLayers());
  }

  componentDidMount() {
    this.updateMenuLayers();
  }

  onTopicClick(topic) {
    const { activeTopic, dispatchSetActiveTopic } = this.props;
    const { openTopicKey } = this.state;

    if (activeTopic.key === topic.key) {
      // toggle layer tree
      this.setState({
        openTopicKey: openTopicKey === topic.key ? null : topic.key,
      });
    } else {
      // change topic
      dispatchSetActiveTopic(topic);
    }
  }

  updateMenuLayers() {
    const { layerService } = this.props;
    let topicLayers = layerService.getLayersAsFlatArray();
    topicLayers = topicLayers.filter(l => !l.getIsBaseLayer());
    const menuLayers = topicLayers.filter(l => l.getVisible());

    this.setState({
      menuLayers,
      allMenuLayersVisible: menuLayers.length === topicLayers.length,
    });
  }

  render() {
    const { activeTopic, layerService, t, topics } = this.props;
    const {
      menuLayers,
      allMenuLayersVisible,
      isOpen,
      openTopicKey,
    } = this.state;

    const info = allMenuLayersVisible
      ? t('alle aktiviert')
      : menuLayers.map(l => t(l.getName())).join(', ');

    return (
      <div className="wkp-menu">
        <MenuHeader
          title={activeTopic.key}
          info={info}
          headerLayerNames={menuLayers.map(l => l.getName())}
          isOpen={isOpen}
          onToggle={() => this.setState({ isOpen: !isOpen })}
        />

        <div className={`wkp-menu-body ${isOpen ? '' : 'closed'}`}>
          <div className="wkp-menu-body-inner">
            {topics.map(topic => (
              <div key={topic.key}>
                <TopicMenu
                  topic={topic}
                  isActive={activeTopic.key === topic.key}
                  isTopicCollapsed={openTopicKey === topic.key}
                  onClick={to => this.onTopicClick(to)}
                />

                {topic.key === activeTopic.key && (
                  <div
                    className={`wkp-layer-tree ${
                      openTopicKey === topic.key ? '' : 'closed'
                    }`}
                  >
                    <LayerTree
                      isItemHidden={l => l.getIsBaseLayer()}
                      t={name => t(name)}
                      layerService={layerService}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  activeTopic: state.app.activeTopic,
  topics: state.app.topics,
});

const mapDispatchToProps = {
  dispatchSetActiveTopic: setActiveTopic,
};

Menu.propTypes = propTypes;

export default compose(
  withTranslation(),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(Menu);
