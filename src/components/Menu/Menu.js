import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { compose } from 'lodash/fp';
import PropTypes from 'prop-types';
import Map from 'ol/Map';
import LayerService from 'react-spatial/LayerService';
import TopicMenu from './TopicMenu';
import MenuHeader from './MenuHeader';
import Collapsible from '../Collapsible';
import { setMenuOpen } from '../../model/app/actions';

import './Menu.scss';

const propTypes = {
  activeTopic: PropTypes.shape().isRequired,
  topics: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  menuComponents: PropTypes.arrayOf(PropTypes.string).isRequired,
  layerService: PropTypes.instanceOf(LayerService).isRequired,
  map: PropTypes.instanceOf(Map).isRequired,
  menuOpen: PropTypes.bool.isRequired,

  dispatchSetMenuOpen: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

class Menu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      menuLayers: [],
      allMenuLayersVisible: false,
      loadedMenuComponents: [],
    };

    const { layerService } = this.props;
    layerService.on('change:visible', () => this.updateMenuLayers());
  }

  componentDidMount() {
    this.loadMenuComponents();
    this.updateMenuLayers();
  }

  componentDidUpdate(prevProps) {
    const { menuComponents } = this.props;

    // Array.every returns always true if array is empty.
    if (
      !(prevProps.menuComponents.length === 0 && menuComponents.length === 0) &&
      prevProps.menuComponents.every(
        comp => menuComponents.includes(comp) === false,
      )
    ) {
      this.loadMenuComponents();
    }
  }

  loadMenuComponents() {
    const { menuComponents } = this.props;
    const components = [];

    for (let i = 0; i < menuComponents.length; i += 1) {
      // Styleguidist try to load every file in the folder if we don't put index.js
      const Comp = React.lazy(() =>
        import(`../../menus/${menuComponents[i]}/index.js`),
      );
      components.push(Comp);
    }

    this.setState({ loadedMenuComponents: components });
  }

  updateMenuLayers() {
    const { layerService } = this.props;
    const topicLayers = layerService
      .getLayersAsFlatArray()
      .reverse()
      .filter(
        l =>
          !l.getIsBaseLayer() &&
          !l.get('hideInLegend') &&
          !layerService.getParent(l),
      );
    const menuLayers = topicLayers.filter(l => l.getVisible());

    this.setState({
      menuLayers,
      allMenuLayersVisible: menuLayers.length === topicLayers.length,
    });
  }

  render() {
    const {
      activeTopic,
      layerService,
      topics,
      map,
      menuOpen,
      dispatchSetMenuOpen,
      t,
    } = this.props;

    const {
      menuLayers,
      loadedMenuComponents,
      allMenuLayersVisible,
    } = this.state;

    const info = allMenuLayersVisible
      ? t('alle aktiviert')
      : menuLayers.map(l => t(l.getName())).join(', ');

    /* eslint-disable react/no-array-index-key */
    return (
      <div className="wkp-menu-wrapper">
        <MenuHeader
          title={activeTopic.name}
          info={info}
          headerLayerNames={menuLayers.map(l => l.getName())}
          isOpen={menuOpen}
          onToggle={() => dispatchSetMenuOpen(!menuOpen)}
        />

        <div className={`wkp-menu wkp-topics ${menuOpen ? '' : 'closed'}`}>
          <Collapsible isCollapsed={!menuOpen}>
            <div className="wkp-menu-body">
              {topics.map(topic => (
                <div key={topic.key}>
                  <TopicMenu layerService={layerService} topic={topic} />
                </div>
              ))}
            </div>
          </Collapsible>
        </div>

        {loadedMenuComponents.map((Comp, index) => (
          <React.Suspense fallback="Loading menu..." key={index}>
            <Comp layerService={layerService} map={map} />
          </React.Suspense>
        ))}
      </div>
    );
    /* eslint-enable */
  }
}

const mapStateToProps = state => ({
  activeTopic: state.app.activeTopic,
  topics: state.app.topics,
  menuOpen: state.app.menuOpen,
});

const mapDispatchToProps = {
  dispatchSetMenuOpen: setMenuOpen,
};

Menu.propTypes = propTypes;

export default compose(
  withTranslation(),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(Menu);
