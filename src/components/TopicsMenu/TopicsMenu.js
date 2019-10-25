import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import TopicMenu from '../TopicMenu';
import TopicsMenuHeader from '../TopicsMenuHeader';
import Collapsible from '../Collapsible';
import { setMenuOpen } from '../../model/app/actions';
import './TopicsMenu.scss';

const propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

const defaultProps = {
  children: null,
};

function TopicsMenu({ children }) {
  const layerService = useSelector(state => state.app.layerService);
  const menuOpen = useSelector(state => state.app.menuOpen);
  const topics = useSelector(state => state.app.topics);
  const dispatch = useDispatch();

  return (
    <div className="wkp-menu">
      <TopicsMenuHeader
        isOpen={menuOpen}
        onToggle={() => dispatch(setMenuOpen(!menuOpen))}
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
        {children}
      </Collapsible>
    </div>
  );
}

TopicsMenu.propTypes = propTypes;
TopicsMenu.defaultProps = defaultProps;

export default React.memo(TopicsMenu);
