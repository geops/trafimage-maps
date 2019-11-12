import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import BaseLayerToggler from 'react-spatial/components/BaseLayerToggler';
import ResizeHandler from 'react-spatial/components/ResizeHandler';

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
import TopicsMenu from '../TopicsMenu';

const defaultElements = {
  header: false,
  footer: false,
  menu: false,
  permalink: false,
  popup: false,
  mapControls: false,
  baseLayerToggler: false,
  shareMenu: false,
  trackerMenu: false,
  featureMenu: false,
  search: false,
};

const getComponents = (defaultComponents, elementsToDisplay) =>
  Object.entries(defaultComponents).map(([k, v]) =>
    elementsToDisplay[k] ? <div key={k}>{v}</div> : null,
  );

function TopicElements() {
  const { activeTopic, layerService, map } = useSelector(state => state.app);
  const [tabFocus, setTabFocus] = useState(false);
  useEffect(() => {
    const unfocusTab = () => setTabFocus(false);
    const focusTab = e => e.which === 9 && setTabFocus(true);
    document.addEventListener('click', unfocusTab);
    document.addEventListener('keydown', focusTab);
    return function cleanup() {
      document.removeEventListener('click', unfocusTab);
      document.removeEventListener('keydown', focusTab);
    };
  });
  const { t } = useTranslation();
  if (!activeTopic) {
    return null;
  }
  const elements = activeTopic.elements || defaultElements;
  // Define which component to display as child of TopicsMenu.
  const appTopicsMenuChildren = getComponents(
    { shareMenu: <ShareMenu /> },
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
    header: <Header />,
    search: <Search />,
    popup: <Popup />,
    permalink: <Permalink />,
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
        titleButton={t('Baselayerwechsel')}
        titleButtonNext={t('Nächste Baselayer')}
        titleButtonPrevious={t('Vorherige Baselayer')}
        fallbackImgDir="/img/baselayer/"
        validExtent={[656409.5, 5740863.4, 1200512.3, 6077033.16]}
      />
    ),
    mapControls: <MapControls />,
    footer: <Footer />,
  };

  const appElements = getComponents(appComponents, elements);
  return (
    <div className={`tm-trafimage-maps ${elements.header ? 'header' : ''}`}>
      <div className={`tm-barrier-free ${tabFocus ? '' : 'tm-no-focus'}`}>
        <ResizeHandler observe=".tm-trafimage-maps" />
        <Map
          map={map}
          initialCenter={[925472, 5920000]}
          initialZoom={9}
          projection="EPSG:3857"
        />
        {appElements}
        <MainDialog />
      </div>
    </div>
  );
}

export default TopicElements;
