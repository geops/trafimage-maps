import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { EventConsumer } from "@geops/create-react-web-component";
import BaseLayerSwitcher from "react-spatial/components/BaseLayerSwitcher";
import ResizeHandler from "../ResizeHandler";
import { setScreenDimensions } from "../../model/app/actions";
import MainDialog from "../MainDialog";
import Map from "../Map";
import Menu from "../Menu";
import FeatureMenu from "../FeatureMenu";
import TrackerMenu from "../../menus/TrackerMenu";
import ShareMenu from "../../menus/ShareMenu";
import DrawMenu from "../../menus/DrawMenu";
import ExportMenu from "../../menus/ExportMenu";
import Permalink from "../Permalink";
import Header from "../Header";
import Footer from "../Footer";
import MapControls from "../MapControls";
import Popup from "../Popup";
import Search from "../Search";
import TopicTelephoneInfos from "../TopicTelephoneInfos";
import TopicsMenu from "../TopicsMenu";
import Overlay from "../Overlay";
import { ReactComponent as ChevronLeft } from "../../img/chevronLeft.svg";
import { trackEvent } from "../../utils/trackingUtils";

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

function TopicElements({ history = null }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const activeTopic = useSelector((state) => state.app.activeTopic);
  const staticFilesUrl = useSelector((state) => state.app.staticFilesUrl);

  const loginUrl = useSelector((state) => state.app.loginUrl);
  const map = useSelector((state) => state.app.map);
  const [tabFocus, setTabFocus] = useState(false);
  const [node, setNode] = useState(null);

  useEffect(() => {
    const unfocusTab = () => setTabFocus(false);
    const focusTab = (e) => e.which === 9 && setTabFocus(true);
    document.addEventListener("mousedown", unfocusTab);
    document.addEventListener("keydown", focusTab);
    return function cleanup() {
      document.removeEventListener("mousedown", unfocusTab);
      document.removeEventListener("keydown", focusTab);
    };
  });

  const elements = useMemo(() => {
    const disabled = new URL(window.location.href).searchParams.get("disabled");
    const elts = activeTopic?.elements || defaultElements;
    if (disabled) {
      disabled.split(",").forEach((element) => {
        // Backward compatibility
        if (element === "spyLayer") {
          elts.baseLayerSwitcher = false;
        }
        // Backward compatibility
        if (element === "header") {
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
      layer.get("isBaseLayer"),
    );
  }, [activeTopic]);

  // We define the images for the base layers using staticFilesUrl because they are too big to be encoded in base64.
  // so when using in the web component (see angular example) the app is able to get them.
  // Images are stored in the gitlab project.
  const baseLayerImages = useMemo(() => {
    const imgs = {};
    baseLayers.forEach((layer) => {
      imgs[layer.key] = `${staticFilesUrl}/img/baselayer/${layer.get(
        "previewImage",
      )}.jpg`;
    });
    return imgs;
  }, [baseLayers, staticFilesUrl]);

  const topicClassName = useMemo(() => {
    let classNamee = "";
    if (activeTopic?.key) {
      classNamee = activeTopic.key.toLowerCase().replaceAll(".", "-");
    }
    return classNamee;
  }, [activeTopic]);

  const className = useMemo(() => {
    const classNames = ["tm-trafimage-maps", topicClassName];

    if (elements.header) {
      classNames.push("header");
    }

    if (elements.menu) {
      classNames.push("menu");
    }

    if (elements.mapControls) {
      classNames.push("map-controls");
    }

    return classNames.join(" ");
  }, [topicClassName, elements]);

  const barrierFreeClassName = useMemo(() => {
    const classNames = ["tm-barrier-free"];

    if (!tabFocus) {
      classNames.push("tm-no-focus");
    }
    return classNames.join(" ");
  }, [tabFocus]);

  const onResize = useCallback(
    (entries, width, height) => {
      dispatch(setScreenDimensions({ width, height }));
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
        <Permalink history={history} readOnly={!elements.permalink} />
        {elements.search && <Search />}
        {elements.header && <Header loginUrl={loginUrl} />}
        {elements.header && <TopicTelephoneInfos />}
        {elements.popup && <Popup />}
        {elements.mapControls && (
          <MapControls
            menuToggler={elements.menuToggler}
            geolocation={elements.geolocationButton}
            fitExtent={elements.fitExtent}
            floorSwitcher={elements.floorSwitcher}
          >
            {activeTopic.mapControls}
          </MapControls>
        )}
        {elements.baseLayerSwitcher && (
          <BaseLayerSwitcher
            layers={baseLayers}
            titles={{
              button: t("Baselayerwechsel"),
              openSwitcher: t("Baselayer-Menu öffnen"),
              closeSwitcher: t("Baselayer-Menu schliessen"),
            }}
            layerImages={baseLayerImages}
            closeButtonImage={<ChevronLeft />}
            t={t}
            onLayerButtonClick={(e, layer) => {
              if (layer) {
                trackEvent(
                  {
                    eventType: "action",
                    componentName: "layer switch button",
                    label: t(layer.key),
                    location: t(activeTopic.name, { lng: "de" }),
                    variant: t(layer.name || layer.key, { lng: "de" }),
                  },
                  activeTopic,
                );
              }
            }}
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
        {activeTopic?.customElements}
        <MainDialog />
      </div>
    </div>
  );
}

TopicElements.propTypes = propTypes;

export default React.memo(TopicElements);
