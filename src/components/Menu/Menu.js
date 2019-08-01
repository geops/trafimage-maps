import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { compose } from 'lodash/fp';
import PropTypes from 'prop-types';
import Map from 'ol/Map';
import LayerService from 'react-spatial/LayerService';
import TopicMenu from './TopicMenu';
import MenuHeader from './MenuHeader';

import './Menu.scss';

const propTypes = {
  activeTopic: PropTypes.shape().isRequired,
  topics: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  menuComponents: PropTypes.arrayOf(PropTypes.string).isRequired,
  layerService: PropTypes.instanceOf(LayerService).isRequired,
  map: PropTypes.instanceOf(Map).isRequired,
  t: PropTypes.func.isRequired,
};

class Menu extends Component {
  constructor(props) {
    super(props);
    const { layerService } = this.props;

    this.state = {
      isOpen: false,
      menuLayers: [],
      allMenuLayersVisible: false,
      loadedMenuComponents: [],
    };

    layerService.on('change:visible', () => this.updateMenuLayers());
    this.loadMenuComponents();
  }

  componentDidMount() {
    this.updateMenuLayers();
  }

  componentDidUpdate(prevProps) {
    const { menuComponents } = this.props;

    if (prevProps.menuComponents !== menuComponents) {
      this.loadMenuComponents();
    }
  }

  loadMenuComponents() {
    const { menuComponents } = this.props;
    const components = [];

    for (let i = 0; i < menuComponents.length; i += 1) {
      const Comp = React.lazy(() => import(`../../menus/${menuComponents[i]}`));
      components.push(Comp);
    }

    this.setState({ loadedMenuComponents: components });
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
    const { activeTopic, layerService, t, topics, map } = this.props;

    const {
      menuLayers,
      loadedMenuComponents,
      allMenuLayersVisible,
      isOpen,
    } = this.state;

    const info = allMenuLayersVisible
      ? t('alle aktiviert')
      : menuLayers.map(l => l.getName()).join(', ');

    return (
      <div className="wkp-menu-wrapper">
        <MenuHeader
          title={activeTopic.name}
          info={info}
          headerLayerNames={menuLayers.map(l => l.getName())}
          isOpen={isOpen}
          onToggle={() => this.setState({ isOpen: !isOpen })}
        />

        <div className={`wkp-menu wkp-topics ${isOpen ? '' : 'closed'}`}>
          <div className="wkp-menu-body">
            {topics.map(topic => (
              <div key={topic.key}>
                <TopicMenu layerService={layerService} topic={topic} />
              </div>
            ))}
          </div>
        </div>

        {loadedMenuComponents.map(Comp => (
          <React.Suspense fallback="Loading menu...">
            <Comp layerService={layerService} map={map} closed={!isOpen} />
          </React.Suspense>
        ))}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  activeTopic: state.app.activeTopic,
  topics: state.app.topics,
});

Menu.propTypes = propTypes;

export default compose(
  withTranslation(),
  connect(mapStateToProps),
)(Menu);
