import React, { useEffect, useState, useRef } from 'react';
import qs from 'query-string';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { EventConsumer } from '@geops/create-react-web-component';
import ResizeHandler from '@geops/react-ui/components/ResizeHandler';
import BaseLayerSwitcher from 'react-spatial/components/BaseLayerSwitcher';
import { setIsMobileWidth } from '../../model/app/actions';
import MainDialog from '../MainDialog';
import Map from '../Map';
import Menu from '../Menu';
import FeatureMenu from '../FeatureMenu';
import TrackerMenu from '../../menus/TrackerMenu';
import ShareMenu from '../../menus/ShareMenu';
import Permalink from '../Permalink';
import Header from '../Header';
import Footer from '../Footer';
import MapControls from '../MapControls';
import Popup from '../Popup';
import Search from '../Search';
import TopicTelephoneInfos from '../TopicTelephoneInfos';
import TopicsMenu from '../TopicsMenu';
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
  trackerMenu: false,
  featureMenu: false,
  search: false,
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
  staticFilesUrl: PropTypes.string,
};

const defaultProps = {
  history: null,
  appBaseUrl: null,
  staticFilesUrl: null,
};

const getComponents = (defaultComponents, elementsToDisplay) =>
  Object.entries(defaultComponents).map(([k, v]) =>
    elementsToDisplay[k] ? <div key={k}>{v}</div> : null,
  );

function TopicElements({ history, appBaseUrl, staticFilesUrl }) {
  const ref = useRef(null);
  const dispatch = useDispatch();
  const { activeTopic, layerService, map } = useSelector((state) => state.app);
  const [tabFocus, setTabFocus] = useState(false);
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
  const { t } = useTranslation();
  if (!activeTopic) {
    return null;
  }

  const { maxZoom } = activeTopic;

  const baseLayers = layerService
    .getLayers()
    .filter((layer) => layer.getIsBaseLayer());

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
    { shareMenu: <ShareMenu appBaseUrl={appBaseUrl} /> },
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
    header: <Header appBaseUrl={appBaseUrl} />,
    search: <Search />,
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
          closeSwitcher: t('Baselayer-Menu Schliessen'),
        }}
        closeButtonImage={<ChevronLeft />}
        t={t}
      />
    ),
    mapControls: <MapControls showGeolocation={elements.geolocationButton} />,
    footer: <Footer />,
  };

  const appElements = getComponents(appComponents, elements);

  const onResize = (entries) => {
    const [entry] = entries;
    const rect = entry.contentRect;
    const { width } = rect;
    // tm-w-s
    dispatch(setIsMobileWidth(width <= 768));
  };

  return (
    <div
      ref={ref}
      className={`tm-trafimage-maps ${elements.header ? 'header' : ''}`}
    >
      <ResizeHandler
        observe={ref.current}
        forceUpdate={elements.header}
        onResize={onResize}
      />
      <div className={`tm-barrier-free ${tabFocus ? '' : 'tm-no-focus'}`}>
        <EventConsumer>
          {(dispatcher) => (
            <Map map={map} maxZoom={maxZoom} dispatchHtmlEvent={dispatcher} />
          )}
        </EventConsumer>
        {appElements}
        <MainDialog staticFilesUrl={staticFilesUrl} />
      </div>
    </div>
  );
}

TopicElements.propTypes = propTypes;
TopicElements.defaultProps = defaultProps;

export default TopicElements;
