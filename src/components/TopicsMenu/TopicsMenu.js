import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { unByKey } from "ol/Observable";
import getLayersAsFlatArray from "../../utils/getLayersAsFlatArray";
import TopicMenu from "../TopicMenu";
import TopicsMenuHeader from "../TopicsMenuHeader";
import Collapsible from "../Collapsible";
import withResizing from "../withResizing";
import {
  setMenuOpen,
  setSearchOpen,
  updateDrawEditLink,
} from "../../model/app/actions";
import DrawLayerMenu from "../DrawLayerMenu";
import {
  ONLY_WHEN_NOT_LOGGED_IN,
  TOPIC_MENU_ITEM_ID_PREFIX,
} from "../../utils/constants";

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

function getFocusedTopic(topicsToDisplay) {
  return topicsToDisplay.find((topic) => {
    if (document.activeElement?.id?.startsWith(TOPIC_MENU_ITEM_ID_PREFIX)) {
      return (
        document.activeElement.id ===
        `${TOPIC_MENU_ITEM_ID_PREFIX}-${topic.key}`
      );
    }
    return false;
  });
}

function getNextTopic(topicsToDisplay, focusedTopic) {
  const nextIndex =
    topicsToDisplay.findIndex((t) => t.key === focusedTopic?.key) + 1 || 0;
  return topicsToDisplay[nextIndex];
}

function getPreviousTopic(topicsToDisplay, focusedTopic) {
  const previousIndex =
    topicsToDisplay.findIndex((t) => t.key === focusedTopic?.key) - 1 || 0;
  return topicsToDisplay[previousIndex];
}

function TopicsMenu({ children, menuHeight, bodyElementRef }) {
  const permissionInfos = useSelector((state) => state.app.permissionInfos);
  const menuOpen = useSelector((state) => state.app.menuOpen);
  const layers = useSelector((state) => state.map.layers || []);
  const topics = useSelector((state) => state.app.topics);
  const activeTopic = useSelector((state) => state.app.activeTopic);
  const dispatch = useDispatch();

  useEffect(() => {
    let timeout;
    const cb = () => {
      // Update link after permalink has been updated.
      timeout = setTimeout(() => {
        dispatch(updateDrawEditLink());
      }, 50);
    };

    const keys = getLayersAsFlatArray(layers).map((layer) =>
      layer.on("change:visible", cb),
    );

    return () => {
      unByKey(keys);
      clearTimeout(timeout);
    };
  }, [layers, dispatch]);

  const topicsToDisplay = useMemo(() => {
    if (activeTopic?.only) {
      return [activeTopic];
    }
    return topics.filter((t) => {
      return (
        t.key === activeTopic?.key ||
        ((!t.hideInLayerTree ||
          (t.hideInLayerTree === ONLY_WHEN_NOT_LOGGED_IN &&
            permissionInfos?.user)) &&
          !t.only)
      );
    });
  }, [activeTopic, topics, permissionInfos]);

  useEffect(() => {
    let handleKeyUp;
    if (menuOpen) {
      handleKeyUp = (e) => {
        const focusedTopic = getFocusedTopic(topicsToDisplay);
        if (!focusedTopic) return;
        e.stopPropagation();
        e.preventDefault();
        if (e.keyCode === 38) {
          const previousTopicMenuItem = document.getElementById(
            `${TOPIC_MENU_ITEM_ID_PREFIX}-${getPreviousTopic(topicsToDisplay, focusedTopic)?.key}`,
          );
          previousTopicMenuItem?.focus();
        }
        if (e.keyCode === 40) {
          e.stopPropagation();
          e.preventDefault();
          const nextTopicMenuItem = document.getElementById(
            `${TOPIC_MENU_ITEM_ID_PREFIX}-${getNextTopic(topicsToDisplay, focusedTopic)?.key}`,
          );
          nextTopicMenuItem?.focus();
        }
      };
      document.addEventListener("keyup", handleKeyUp);
    }
    return () => {
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [menuOpen, topicsToDisplay]);

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
          {topicsToDisplay.map((topic) => (
            <TopicMenu key={topic.key} topic={topic} />
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
