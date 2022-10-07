import React, { useEffect, useState } from 'react';
import qs from 'query-string';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { EventConsumer } from '@geops/create-react-web-component';
import BaseLayerSwitcher from 'react-spatial/components/BaseLayerSwitcher';
import ResizeHandler from '../ResizeHandler';
import { setScreenWidth } from '../../model/app/actions';

import MainDialog from '../MainDialog';
import Map from '../Map';
import Menu from '../Menu';
import FeatureMenu from '../FeatureMenu';
import TrackerMenu from '../../menus/TrackerMenu';
import ShareMenu from '../../menus/ShareMenu';
import DrawMenu from '../../menus/DrawMenu';
import ExportMenu from '../../menus/ExportMenu';
import Permalink from '../Permalink';
import Header from '../Header';
import Footer from '../Footer';
import MapControls from '../MapControls';
import Popup from '../Popup';
import Search from '../Search';
import TopicTelephoneInfos from '../TopicTelephoneInfos';
import TopicsMenu from '../TopicsMenu';
import Overlay from '../Overlay';
import { ReactComponent as ChevronLeft } from '../../img/chevronLeft.svg';

const defaultElements = {
  header: false,
  footer: false,
  menu: false,
  permalink: false,
  popup: false,
  mapControls: false,
  geolocationButton: true,
  baseLayerSwitcher: false,
  shareMenu: false,
  drawMenu: true,
  trackerMenu: false,
  featureMenu: false,
  exportMenu: false,
  search: false,
  overlay: false,
};

const propTypes = {
  /**
   * History object from react-router
   * @private
   */
  history: PropTypes.shape({
    push: PropTypes.func,
    replace: PropTypes.func,
  }),
  appBaseUrl: PropTypes.string,
  loginUrl: PropTypes.string,
  staticFilesUrl: PropTypes.string,
};

const defaultProps = {
  history: null,
  appBaseUrl: null,
  loginUrl: null,
  staticFilesUrl: null,
};

const getComponents = (defaultComponents, elementsToDisplay) =>
  Object.entries(defaultComponents).map(([k, v]) =>
    elementsToDisplay[k] ? <div key={k}>{v}</div> : null,
  );

function TopicElements({ history, appBaseUrl, loginUrl, staticFilesUrl }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const activeTopic = useSelector((state) => state.app.activeTopic);
  const map = useSelector((state) => state.app.map);
  const [tabFocus, setTabFocus] = useState(false);
  const [node, setNode] = useState(null);

  useEffect(() => {
    const unfocusTab = () => setTabFocus(false);
    const focusTab = (e) => e.which === 9 && setTabFocus(true);
    document.addEventListener('mousedown', unfocusTab);
    document.addEventListener('keydown', focusTab);
    return function cleanup() {
      document.removeEventListener('mousedown', unfocusTab);
      document.removeEventListener('keydown', focusTab);
    };
  });

  if (!activeTopic) {
    return null;
  }

  const { maxZoom, layers } = activeTopic;

  const baseLayers = (layers || []).filter((layer) => layer.get('isBaseLayer'));

  // Disabled elements from permalink
  const { disabled } = qs.parse((history || window).location.search);
  if (disabled) {
    disabled.split(',').forEach((element) => {
      // Backward compatibility
      if (element === 'spyLayer') {
        activeTopic.elements.baseLayerSwitcher = false;
      }
      // Backward compatibility
      if (element === 'header') {
        activeTopic.elements.search = false;
      }
      activeTopic.elements[element] = false;
    });
  }

  const elements = activeTopic.elements || defaultElements;
  elements.telephoneInfos =
    !disabled || !disabled.split(',').find((el) => el === 'header');

  // Define which component to display as child of TopicsMenu.
  const appTopicsMenuChildren = getComponents(
    {
      exportMenu: <ExportMenu />,
      drawMenu: <DrawMenu />,
      shareMenu: <ShareMenu appBaseUrl={appBaseUrl} />,
    },
    elements,
  );

  // Define which component to display as child of Menu.
  const appMenuChildren = getComponents(
    {
      featureMenu: (
        <FeatureMenu appBaseUrl={appBaseUrl} staticFilesUrl={staticFilesUrl} />
      ),
      trackerMenu: <TrackerMenu />,
    },
    elements,
  );

  // Define which components to display.
  const appComponents = {
    header: <Header appBaseUrl={appBaseUrl} loginUrl={loginUrl} />,
    search: <Search />,
    map: (
      <EventConsumer>
        {(dispatcher) => (
          <Map map={map} maxZoom={maxZoom} dispatchHtmlEvent={dispatcher} />
        )}
      </EventConsumer>
    ),
    telephoneInfos: <TopicTelephoneInfos />,
    popup: <Popup appBaseUrl={appBaseUrl} staticFilesUrl={staticFilesUrl} />,
    permalink: <Permalink history={history} appBaseUrl={appBaseUrl} />,
    menu: (
      <Menu>
        <TopicsMenu>{appTopicsMenuChildren}</TopicsMenu>
        {appMenuChildren}
      </Menu>
    ),
    baseLayerSwitcher: (
      <BaseLayerSwitcher
        layers={baseLayers}
        titles={{
          button: t('Baselayerwechsel'),
          openSwitcher: t('Baselayer-Menu öffnen'),
          closeSwitcher: t('Baselayer-Menu schliessen'),
        }}
        closeButtonImage={<ChevronLeft />}
        t={t}
      />
    ),
    mapControls: (
      <MapControls
        geolocation={elements.geolocationButton}
        fitExtent={elements.fitExtent}
        zoomSlider={elements.zoomSlider}
      />
    ),
    footer: <Footer />,
    overlay: (
      <Overlay
        appBaseUrl={appBaseUrl}
        staticFilesUrl={staticFilesUrl}
        elements={elements}
      />
    ),
  };

  elements.map = true; // make sure we always have a map element!
  const appElements = getComponents(appComponents, elements);

  const onResize = (entries, widthBreakpoint) => {
    dispatch(setScreenWidth(widthBreakpoint));
  };

  return (
    <div
      // Using useRef it breaks the doc. ref.current is always null.
      ref={(elt) => {
        if (node !== elt) {
          setNode(elt);
        }
      }}
      className={`tm-trafimage-maps ${elements.header ? 'header' : ''}`}
    >
      {node && (
        <ResizeHandler
          observe={node}
          forceUpdate={elements.header}
          onResize={onResize}
        />
      )}
      <div className={`tm-barrier-free ${tabFocus ? '' : 'tm-no-focus'}`}>
        {appElements}
        <MainDialog staticFilesUrl={staticFilesUrl} />
      </div>
    </div>
  );
}

TopicElements.propTypes = propTypes;
TopicElements.defaultProps = defaultProps;

export default TopicElements;
