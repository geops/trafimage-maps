import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import TopicMenu from '../TopicMenu';
import TopicsMenuHeader from '../TopicsMenuHeader';
import Collapsible from '../Collapsible';
import withResizing from '../withResizing';
import { setMenuOpen, setSearchOpen } from '../../model/app/actions';
import DrawLayerMenu from '../DrawLayerMenu';

const propTypes = {
  menuHeight: PropTypes.number,
  bodyElementRef: PropTypes.shape({
    current: PropTypes.instanceOf(Collapsible),
  }),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

const defaultProps = {
  children: null,
  menuHeight: null,
  bodyElementRef: null,
};

function TopicsMenu({ children, menuHeight, bodyElementRef }) {
  const layerService = useSelector((state) => state.app.layerService);
  const menuOpen = useSelector((state) => state.app.menuOpen);
  const topics = useSelector((state) => state.app.topics);
  const dispatch = useDispatch();

  if (!topics || !topics.length) {
    return null;
  }

  return (
    <div className="wkp-topics-menu">
      <TopicsMenuHeader
        isOpen={menuOpen}
        onToggle={() => {
          dispatch(setMenuOpen(!menuOpen));
          dispatch(setSearchOpen(false));
        }}
      />
      <Collapsible
        isCollapsed={!menuOpen}
        maxHeight={menuHeight}
        ref={bodyElementRef}
      >
        <div className="wkp-topics-menu-body">
          <DrawLayerMenu />
          {topics.map((topic) => (
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

export default React.memo(withResizing(TopicsMenu));
