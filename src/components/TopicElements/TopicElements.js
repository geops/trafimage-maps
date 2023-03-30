import React, { useEffect, useState, useMemo, useCallback } from 'react';
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
  geolocationButton: false,
  baseLayerSwitcher: false,
  shareMenu: false,
  drawMenu: false,
  trackerMenu: false,
  featureMenu: false,
  exportMenu: false,
  search: false,
  overlay: false,
  menuToggler: false,
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
};

const defaultProps = {
  history: null,
};

function TopicElements({ history }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const activeTopic = useSelector((state) => state.app.activeTopic);
  const loginUrl = useSelector((state) => state.app.loginUrl);
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

  const elements = useMemo(() => {
    const disabled = new URL(window.location.href).searchParams.get('disabled');
    const elts = activeTopic?.elements || defaultElements;
    if (disabled) {
      disabled.split(',').forEach((element) => {
        // Backward compatibility
        if (element === 'spyLayer') {
          elts.baseLayerSwitcher = false;
        }
        // Backward compatibility
        if (element === 'header') {
          elts.search = false;
          elts.telephoneInfos = false;
        }
        elts[element] = false;
      });
    }

    return elts;
  }, [activeTopic]);

  const baseLayers = useMemo(() => {
    return (activeTopic?.layers || []).filter((layer) =>
      layer.get('isBaseLayer'),
    );
  }, [activeTopic]);

  const topicClassName = useMemo(() => {
    let classNamee = '';
    if (activeTopic?.key) {
      classNamee = activeTopic.key.toLowerCase().replaceAll('.', '-');
    }
    return classNamee;
  }, [activeTopic]);

  const className = useMemo(() => {
    const classNames = ['tm-trafimage-maps', topicClassName];

    if (elements.header) {
      classNames.push('header');
    }

    if (elements.menu) {
      classNames.push('menu');
    }

    if (elements.mapControls) {
      classNames.push('map-controls');
    }

    return classNames.join(' ');
  }, [topicClassName, elements]);

  const barrierFreeClassName = useMemo(() => {
    const classNames = ['tm-barrier-free'];

    if (!tabFocus) {
      classNames.push('tm-no-focus');
    }
    return classNames.join(' ');
  }, [tabFocus]);

  const onResize = useCallback(
    (entries, widthBreakpoint) => {
      dispatch(setScreenWidth(widthBreakpoint));
    },
    [dispatch],
  );

  if (!activeTopic) {
    return null;
  }

  return (
    <div
      className={className}
      // Using useRef, it breaks the doc. ref.current is always null.
      ref={(elt) => {
        if (node !== elt) {
          setNode(elt);
        }
      }}
    >
      {node && (
        <ResizeHandler
          observe={node}
          forceUpdate={elements.header}
          onResize={onResize}
        />
      )}
      <div className={barrierFreeClassName}>
        <EventConsumer>
          {(dispatcher) => (
            <Map
              map={map}
              maxZoom={activeTopic.maxZoom}
              dispatchHtmlEvent={dispatcher}
            />
          )}
        </EventConsumer>
        {elements.permalink && <Permalink history={history} />}
        {elements.header && <Header loginUrl={loginUrl} />}
        {elements.search && <Search />}
        {elements.header && <TopicTelephoneInfos />}
        {elements.popup && <Popup />}
        {elements.mapControls && (
          <MapControls
            menuToggler={elements.menuToggler}
            customMapButton={elements.customMapButton}
            geolocation={elements.geolocationButton}
            fitExtent={elements.fitExtent}
            zoomSlider={elements.zoomSlider}
          />
        )}
        {elements.baseLayerSwitcher && (
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
        )}
        <Menu>
          {elements.menu && (
            <TopicsMenu>
              {elements.exportMenu && <ExportMenu />}
              {elements.drawMenu && <DrawMenu />}
              {elements.shareMenu && <ShareMenu />}
            </TopicsMenu>
          )}
          {elements.featureMenu && <FeatureMenu />}
          {elements.trackerMenu && <TrackerMenu />}
          {activeTopic?.menu}
        </Menu>
        {elements.footer && <Footer />}
        {elements.overlay && <Overlay elements={elements} />}
        <MainDialog />
      </div>
    </div>
  );
}

TopicElements.propTypes = propTypes;
TopicElements.defaultProps = defaultProps;

export default React.memo(TopicElements);
