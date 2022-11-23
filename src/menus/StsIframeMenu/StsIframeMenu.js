import React, {
  useRef,
  useEffect,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { PropTypes } from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  withStyles,
  makeStyles,
  FormGroup,
  Switch,
  FormControlLabel,
  Divider,
} from '@material-ui/core';
import MenuItem from '../../components/Menu/MenuItem';
import Link from '../../components/Link';
import usePrevious from '../../utils/usePrevious';
import GeltungsbereichePopup from '../../popups/GeltungsbereicheGaPopup/GeltungsbereicheGaPopup';
import Overlay from '../../components/Overlay/Overlay';
import {
  otherRoutes,
  highlights,
  gttos,
  premium,
} from '../../config/ch.sbb.sts.iframe';
import { setDialogPosition, setFeatureInfo } from '../../model/app/actions';
import { parseFeaturesInfos } from '../../utils/stsParseFeatureInfo';
import { DETAILS_BASE_URL } from '../../utils/constants';

const useStyles = makeStyles(() => {
  return {
    root: {
      '&.wkp-menu-item': {
        marginTop: '0 !important',
        '&:not(:last-child)': {
          borderBottom: '1px solid gray !important',
          borderBottomWidth: '1px !important',
        },
        '&.open': {
          borderBottom: '1px solid #eee',
        },
      },
    },
    menuContent: {
      padding: 15,
    },
    featureInfos: {
      border: '1px solid gray',
    },
    featureInfoItem: {
      padding: 15,
      borderBottom: '1px solid #eee',
    },
    imageLine: {
      '& img': {
        width: '100%',
      },
    },
    mobileHandleWrapper: {
      position: 'absolute',
      width: '100%',
      height: 20,
      top: 0,
      right: 0,
    },
    mobileHandle: {
      position: 'fixed',
      backgroundColor: '#f5f5f5',
      width: 'inherit',
      height: 'inherit',
    },
  };
});

const SBBSwitch = withStyles((theme) => ({
  root: {
    width: 46,
    height: 26,
    padding: 0,
    margin: 10,
    overflow: 'visible',
  },
  switchBase: {
    padding: 2,
    color: theme.palette.grey[500],
    '&$checked': {
      transform: 'translateX(20px)',
      color: 'white',
      '& + $track': {
        opacity: 1,
        backgroundColor: '#eb0000',
      },
    },
  },
  thumb: {
    width: 22,
    height: 22,
    boxShadow:
      '0 1px 1px 0 rgb(0 0 0 / 7%), 0 0 1px 1px rgb(0 0 0 / 11%), 0 4px 2px 0 rgb(0 0 0 / 10%), 0 4px 9px 2px rgb(0 0 0 / 8%)',
  },
  track: {
    height: 24,
    borderRadius: 25,
    border: `1px solid #e5e5e5`,
    opacity: 1,
    backgroundColor: 'white',
  },
  checked: {},
}))(Switch);

function StsIframeMenu({ collapsed, onClick, active }) {
  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const layers = useSelector((state) => state.map.layers);
  const featureInfo = useSelector((state) => state.app.featureInfo);
  const screenWidth = useSelector((state) => state.app.screenWidth);
  const [tours, setTours] = useState([]);
  const switchLayers = useMemo(() => {
    return layers?.filter(
      (layer) =>
        layer.get('group') === (gttos.get('group') || premium.get('group')),
    );
  }, [layers]);
  const highlightsLayer = useMemo(() => {
    return layers?.find((layer) => layer.key === highlights.key);
  }, [layers]);
  const isMobile = useMemo(() => {
    return ['xs'].includes(screenWidth);
  }, [screenWidth]);

  const [switchValue, setSwitchValue] = useState(
    switchLayers.find((layer) => layer.visible)?.key || null,
  );
  const [infoKey, setInfoKey] = useState(undefined);
  const [highlightsVisible, setHighlightsVisible] = useState(
    highlightsLayer?.visible,
  );
  const ref = useRef();

  const mainFeatureInfos = useMemo(
    () => featureInfo.filter((info) => info.layer.key !== otherRoutes.key),
    [featureInfo],
  );
  const gbFeatureInfo = useMemo(
    () => featureInfo.find((info) => info.layer.key === otherRoutes.key),
    [featureInfo],
  );
  const mainFeatures = useMemo(() => {
    return mainFeatureInfos?.length
      ? parseFeaturesInfos(mainFeatureInfos, tours)
      : [];
  }, [mainFeatureInfos, tours]);
  const prevMainFeatures = usePrevious(mainFeatures);

  const onSwitchClick = useCallback(
    (evt, key) => {
      const clickedLayer = switchLayers.find((layer) => layer.key === key);
      const otherLayer = switchLayers.find((layer) => layer.key !== key);
      if (!clickedLayer.visible) {
        clickedLayer.visible = true;
        otherLayer.visible = false;
        setSwitchValue(clickedLayer.key);
        dispatch(setFeatureInfo([]));
        return;
      }
      clickedLayer.visible = false;
      setSwitchValue(null);
      dispatch(setFeatureInfo([]));
    },
    [switchLayers, dispatch],
  );

  const onHighlightChange = useCallback(
    (evt) => {
      highlightsLayer.visible = evt.target.checked;
      setHighlightsVisible(evt.target.checked);
      dispatch(setFeatureInfo([]));
    },
    [highlightsLayer, dispatch],
  );

  useEffect(() => {
    fetch('../data/tours.json')
      .then((response) => response.json())
      .then((data) => setTours(data));
  }, []);

  useEffect(() => {
    dispatch(setDialogPosition({ x: 390, y: 17 }));
  }, [dispatch]);

  useEffect(() => {
    if (mainFeatures !== prevMainFeatures) {
      setInfoKey();
    }
    if (mainFeatures?.length && infoKey === undefined) {
      setInfoKey(mainFeatures[0].getId() || mainFeatures[0].get('id'));
    }
  }, [mainFeatures, prevMainFeatures, infoKey]);

  const featureInfoContent = useMemo(() => {
    if (!gbFeatureInfo?.features?.length && !mainFeatures.length) {
      return null;
    }
    return (
      <>
        <br />
        {!isMobile && (
          <>
            <Divider />
            <br />
          </>
        )}
        {gbFeatureInfo?.features?.length ? (
          <GeltungsbereichePopup
            feature={gbFeatureInfo.features.filter((feat) => feat.get('mot'))}
            layer={[gbFeatureInfo.layer]}
            renderValidityFooter={false}
          />
        ) : null}
        {mainFeatures?.length ? (
          <>
            <br />
            <div className={classes.featureInfos}>
              {mainFeatures.map((feat) => {
                const id = feat.getId() || feat.get('id');
                const title =
                  feat.get('route_names_premium') ||
                  feat.get('route_names_gttos') ||
                  feat.get('title');
                const images = feat.get('images') && feat.get('images').length;
                const description = feat.get('lead_text');
                const link = id && DETAILS_BASE_URL + id;
                return (
                  <MenuItem
                    onCollapseToggle={(open) => setInfoKey(open ? null : id)}
                    className={`wkp-gb-topic-menu ${classes.root}`}
                    collapsed={infoKey !== id}
                    title={<b>{title}</b>}
                    menuHeight={400}
                  >
                    <div className={classes.featureInfoItem}>
                      {images ? (
                        <div className={classes.imageLine}>
                          <a
                            href={`${feat.get('highlight_url') || link}`}
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            <img src={feat.get('images')[0].url} alt={title} />
                          </a>
                        </div>
                      ) : null}
                      {description && <p>{description}</p>}
                      {link && <Link href={link}>Details</Link>}
                    </div>
                  </MenuItem>
                );
              })}
            </div>
          </>
        ) : null}
      </>
    );
  }, [mainFeatures, gbFeatureInfo, classes, infoKey, isMobile]);

  return (
    <>
      <MenuItem
        onCollapseToggle={onClick}
        className={`wkp-gb-topic-menu ${classes.root}`}
        collapsed={collapsed}
        ref={ref}
        title={
          active ? (
            <b>{t('Validity of Swiss Travel Pass')}</b>
          ) : (
            t('Validity of Swiss Travel Pass')
          )
        }
      >
        <div className={classes.menuContent}>
          <div className={classes.layers}>
            <FormGroup>
              {switchLayers.map((layer) => {
                const isActive = switchValue === layer.key;
                return (
                  <FormControlLabel
                    label={isActive ? <b>{t(layer.name)}</b> : t(layer.name)}
                    checked={isActive}
                    control={
                      <SBBSwitch
                        key={layer.key}
                        value={layer.key}
                        onChange={(evt) => onSwitchClick(evt, layer.key)}
                      />
                    }
                  />
                );
              })}
              <FormControlLabel
                label={
                  highlightsVisible ? (
                    <b>{t(highlightsLayer.name)}</b>
                  ) : (
                    t(highlightsLayer.name)
                  )
                }
                checked={highlightsVisible}
                control={
                  <SBBSwitch
                    key={highlightsLayer.key}
                    value={highlightsLayer.key}
                    onChange={(evt) =>
                      onHighlightChange(evt, highlightsLayer.key)
                    }
                  />
                }
              />
            </FormGroup>
          </div>
          {!isMobile && featureInfo?.length ? featureInfoContent : null}
        </div>
      </MenuItem>
      {isMobile && featureInfo?.length ? (
        <Overlay disablePortal={false}>
          {isMobile && (
            <div className={classes.mobileHandleWrapper}>
              <div className={classes.mobileHandle} />
            </div>
          )}
          <div className={classes.menuContent}>{featureInfoContent}</div>
        </Overlay>
      ) : null}
    </>
  );
}

StsIframeMenu.propTypes = {
  collapsed: PropTypes.bool,
  active: PropTypes.bool,
  onClick: PropTypes.func,
};

StsIframeMenu.defaultProps = {
  collapsed: false,
  onClick: () => {},
  active: false,
};

export default React.memo(StsIframeMenu);
