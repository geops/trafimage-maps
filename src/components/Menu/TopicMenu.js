import React from 'react';
import PropTypes from 'prop-types';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';

import './TopicMenu.scss';

const propTypes = {
  onClick: PropTypes.func.isRequired,
  isActive: PropTypes.bool.isRequired,
  isTopicCollapsed: PropTypes.bool.isRequired,
  topic: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired,
};

const TopicMenu = ({ topic, isActive, isTopicCollapsed, onClick }) => (
  <div
    className="wkp-topic-menu"
    role="button"
    tabIndex={0}
    onClick={() => onClick(topic)}
    onKeyPress={e => e.which === 13 && onClick(topic)}
  >
    <div className="wkp-topic-title">
      <div className="wkp-topic-radio">
        {isActive && <div className="wkp-topic-radio-dot" />}
      </div>
      {topic.name}
    </div>
    <div
      className="wkp-layer-toggler"
      style={{ display: isActive ? 'block' : 'none' }}
    >
      {isTopicCollapsed ? <FaAngleUp /> : <FaAngleDown />}
    </div>
  </div>
);

TopicMenu.propTypes = propTypes;

export default TopicMenu;
