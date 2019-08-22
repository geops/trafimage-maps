import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { compose } from 'lodash/fp';
import PropTypes from 'prop-types';
import LayerTree from 'react-spatial/components/LayerTree';
import LayerService from 'react-spatial/LayerService';
import { setActiveTopic } from '../../model/app/actions';

import './TopicMenu.scss';

const propTypes = {
  activeTopic: PropTypes.shape().isRequired,
  topic: PropTypes.shape().isRequired,
  layerService: PropTypes.instanceOf(LayerService).isRequired,
  dispatchSetActiveTopic: PropTypes.func.isRequired,

  t: PropTypes.func.isRequired,
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

  render() {
    const { t, layerService, topic, activeTopic } = this.props;
    const { isCollapsed } = this.state;
    let layerTree = null;

    if (activeTopic.key === topic.key) {
      layerTree = (
        <LayerTree
          isItemHidden={l => l.getIsBaseLayer()}
          layerService={layerService}
          t={t}
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

TopicMenu.propTypes = propTypes;

const mapStateToProps = state => ({
  activeTopic: state.app.activeTopic,
});

const mapDispatchToProps = {
  dispatchSetActiveTopic: setActiveTopic,
};

export default compose(
  withTranslation(),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(TopicMenu);
