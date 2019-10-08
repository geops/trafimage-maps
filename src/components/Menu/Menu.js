import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { compose } from 'lodash/fp';
import PropTypes from 'prop-types';
import { AppContext } from '../TrafimageMaps/TrafimageMaps';
import TopicMenu from './TopicMenu';
import MenuHeader from './MenuHeader';
import Collapsible from '../Collapsible';
import { setMenuOpen } from '../../model/app/actions';

import './Menu.scss';

const propTypes = {
  activeTopic: PropTypes.shape().isRequired,
  topics: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  subMenus: PropTypes.element,
  children: PropTypes.element,
  menuOpen: PropTypes.bool.isRequired,
  dispatchSetMenuOpen: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

const defaultProps = {
  subMenus: null,
  children: null,
};

class Menu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      menuLayers: [],
      allMenuLayersVisible: false,
    };
  }

  componentDidMount() {
    const { layerService } = this.context;
    layerService.on('change:visible', () => this.updateMenuLayers());
    this.updateMenuLayers();
  }

  updateMenuLayers() {
    const { layerService } = this.context;
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
      topics,
      subMenus,
      children,
      menuOpen,
      dispatchSetMenuOpen,
      t,
    } = this.props;

    const { menuLayers, allMenuLayersVisible } = this.state;
    const { layerService } = this.context;

    const info = allMenuLayersVisible
      ? t('alle aktiviert')
      : menuLayers.map(l => t(l.getName())).join(', ');

    /* eslint-disable react/no-array-index-key */
    return (
      <div className="wkp-menu-wrapper">
        <div className="wkp-menu">
          <MenuHeader
            title={t(activeTopic.name)}
            info={info}
            headerLayerNames={menuLayers.map(l => l.getName())}
            isOpen={menuOpen}
            onToggle={() => dispatchSetMenuOpen(!menuOpen)}
          />
          <Collapsible isCollapsed={!menuOpen}>
            <div className="wkp-menu-body">
              {topics.map(topic => (
                <TopicMenu
                  key={topic.key}
                  layerService={layerService}
                  topic={topic}
                />
              ))}
            </div>
            {subMenus}
          </Collapsible>
        </div>

        {children}
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

Menu.contextType = AppContext;
Menu.propTypes = propTypes;
Menu.defaultProps = defaultProps;

export default compose(
  withTranslation(),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(Menu);
