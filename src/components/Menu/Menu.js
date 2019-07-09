import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { compose } from 'lodash/fp';
import PropTypes from 'prop-types';
import LayerService from 'react-spatial/LayerService';
import LayerTree from 'react-spatial/components/LayerTree';

import './Menu.scss';

const propTypes = {
  activeTopic: PropTypes.shape().isRequired,
  layerService: PropTypes.instanceOf(LayerService).isRequired,
  t: PropTypes.func.isRequired,
};

class Menu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      menuLayers: [],
      allMenuLayersVisible: false,
    };

    const { layerService } = this.props;
    layerService.on('change:visible', () => this.updateMenuLayers());
  }

  componentDidMount() {
    this.updateMenuLayers();
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
    const { activeTopic, layerService, t } = this.props;
    const { menuLayers, allMenuLayersVisible, isOpen } = this.state;
    const lNames = menuLayers.map(l => l.getName());

    return (
      <div className="wkp-menu">
        <div
          className={`wkp-menu-header ${isOpen ? 'open' : ''}`}
          role="button"
          tabIndex="0"
          onClick={() => this.setState({ isOpen: !isOpen })}
          onKeyPress={e => {
            if (e.which === 13) {
              this.setState({ isOpen: !isOpen });
            }
          }}
        >
          <div className={`wkp-menu-title ${lNames.length ? '' : 'large'}`}>
            {activeTopic.name}
          </div>

          <div className="wkp-menu-toggler">
            {isOpen ? <FaAngleUp /> : <FaAngleDown />}
          </div>

          <div className={`wkp-menu-layers ${lNames.length ? '' : 'hidden'}`}>
            {allMenuLayersVisible
              ? t('alle aktiviert')
              : menuLayers.map(l => l.getName()).join(', ')}
          </div>
        </div>

        <div className={`wkp-layer-tree ${isOpen ? '' : 'closed'}`}>
          <LayerTree
            isItemHidden={l => l.getIsBaseLayer()}
            layerService={layerService}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  activeTopic: state.app.activeTopic,
});

const mapDispatchToProps = {};

Menu.propTypes = propTypes;

export default compose(
  withTranslation(),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(Menu);
