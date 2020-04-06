import React, { useEffect, useState, useRef } from 'react';
import qs from 'query-string';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { EventConsumer } from '@geops/create-react-web-component';
import ResizeHandler from '@geops/react-ui/components/ResizeHandler';
import BaseLayerToggler from 'react-spatial/components/BaseLayerToggler';
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

const defaultElements = {
  header: false,
  footer: false,
  menu: false,
  permalink: false,
  popup: false,
  mapControls: false,
  geolocationButton: true,
  baseLayerToggler: false,
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
};

const defaultProps = {
  history: null,
  appBaseUrl: null,
};

const getComponents = (defaultComponents, elementsToDisplay) =>
  Object.entries(defaultComponents).map(([k, v]) =>
    elementsToDisplay[k] ? <div key={k}>{v}</div> : null,
  );

function TopicElements({ history, appBaseUrl }) {
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

  // Disabled elements from permalink
  const { disabled } = qs.parse((history || window).location.search);
  if (disabled) {
    disabled.split(',').forEach((element) => {
      // Backward compatibility
      if (element === 'spyLayer') {
        activeTopic.elements.baseLayerToggler = false;
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
      featureMenu: <FeatureMenu />,
      trackerMenu: <TrackerMenu />,
    },
    elements,
  );

  // Define which components to display.
  const appComponents = {
    header: <Header appBaseUrl={appBaseUrl} />,
    search: <Search />,
    telephoneInfos: <TopicTelephoneInfos />,
    popup: <Popup />,
    permalink: <Permalink history={history} appBaseUrl={appBaseUrl} />,
    menu: (
      <Menu>
        <TopicsMenu>{appTopicsMenuChildren}</TopicsMenu>
        {appMenuChildren}
      </Menu>
    ),
    baseLayerToggler: (
      <BaseLayerToggler
        layerService={layerService}
        map={map}
        mapTabIndex={-1} // No accessible via Tab nav.
        titles={{
          button: t('Baselayerwechsel'),
          prevButton: t('Nächste Baselayer'),
          nextButton: t('Vorherige Baselayer'),
        }}
        fallbackImgDir={`${process.env.REACT_APP_STATIC_FILES_URL}/img/baselayer/`}
        validExtent={[656409.5, 5740863.4, 1200512.3, 6077033.16]}
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
    // tm-h-xs and tm-w-s
    dispatch(setIsMobileWidth(width < 768));
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
        <MainDialog />
      </div>
    </div>
  );
}

TopicElements.propTypes = propTypes;
TopicElements.defaultProps = defaultProps;

export default TopicElements;
