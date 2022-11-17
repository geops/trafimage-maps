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
  makeStyles,
  RadioGroup,
  Radio,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core';
import MenuItem from '../../components/Menu/MenuItem';
// import GeltungsbereichePopup from '../../popups/GeltungsbereicheGaPopup/GeltungsbereicheGaPopup';
import { setDialogPosition } from '../../model/app/actions';

const useStyles = makeStyles(() => {
  return {
    root: {
      '&.wkp-menu-item': {
        marginTop: '0 !important',
      },
    },
    menuContent: {
      padding: '5px 10px 15px 15px',
    },
    featureInfos: {
      border: '1px solid gray',
    },
  };
});

function StsIframeMenu({ collapsed, onClick }) {
  const dispatch = useDispatch();
  const layers = useSelector((state) => state.map.layers);
  // const featureInfo = useSelector((state) => state.app.featureInfo);
  const ref = useRef();
  //   const [node, setNode] = useState();
  const { t } = useTranslation();
  const classes = useStyles();
  const radioLayers = useMemo(() => {
    return layers?.filter(
      (layer) => layer.get('group') === 'ch.sbb.sts.sts.group',
    );
  }, [layers]);
  const highlightsLayer = useMemo(() => {
    return layers?.find((layer) => layer.key === 'ch.sbb.sts.sts.highlights');
  }, [layers]);
  const [radioValue, setRadioValue] = useState(radioLayers[0].key);
  const [highlightsVisible, setHighlightsVisible] = useState(
    highlightsLayer.visible,
  );

  const onRadioClick = useCallback(
    (evt, key) => {
      const clickedLayer = radioLayers.find((layer) => layer.key === key);
      const otherLayer = radioLayers.find((layer) => layer.key !== key);
      if (!clickedLayer.visible) {
        clickedLayer.visible = true;
        otherLayer.visible = false;
        setRadioValue(clickedLayer.key);
      }
    },
    [radioLayers],
  );

  const onHighlightChange = useCallback(
    (evt) => {
      highlightsLayer.visible = evt.target.checked;
      setHighlightsVisible(evt.target.checked);
    },
    [highlightsLayer],
  );

  useEffect(() => {
    dispatch(setDialogPosition({ x: 390, y: 17 }));
  }, [dispatch]);

  return (
    <MenuItem
      onCollapseToggle={onClick}
      className={`wkp-gb-topic-menu ${classes.root}`}
      collapsed={collapsed}
      ref={ref}
      title={t('Validity of Swiss Travel Pass')}
    >
      <div className={classes.menuContent}>
        <div className={classes.layers}>
          <RadioGroup
            aria-label="quiz"
            name="quiz"
            value={radioValue}
            onChange={onRadioClick}
          >
            {radioLayers.map((layer) => {
              return (
                <FormControlLabel
                  key={layer.key}
                  value={layer.key}
                  control={<Radio />}
                  label={t(layer.name)}
                />
              );
            })}
          </RadioGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={highlightsVisible}
                onChange={onHighlightChange}
              />
            }
            label={t(highlightsLayer.name)}
          />
        </div>
        {/* <GeltungsbereichePopup feature={features} layer={layers} /> */}
        <div className={classes.featureInfos}>
          <MenuItem
            // onCollapseToggle={onClick}
            className={`wkp-gb-topic-menu ${classes.root}`}
            collapsed={collapsed}
            ref={ref}
            title={t('Validity of Swiss Travel Pass')}
          >
            Wank
          </MenuItem>
        </div>
      </div>
    </MenuItem>
  );
}

StsIframeMenu.propTypes = {
  collapsed: PropTypes.bool,
  onClick: PropTypes.func,
};

StsIframeMenu.defaultProps = {
  collapsed: false,
  onClick: () => {},
};

export default React.memo(StsIframeMenu);
