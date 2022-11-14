import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { makeStyles, MenuItem as MuiMenuItem } from '@material-ui/core';
import { unByKey } from 'ol/Observable';
import MenuItem from '../../components/Menu/MenuItem';
import Select from '../../components/Select';
import InfosButton from '../../components/InfosButton';
import {
  setDialogPosition,
  setSelectedForInfos,
  setFeatureInfo,
} from '../../model/app/actions';

const useStyles = makeStyles((theme) => {
  return {
    root: {
      // Hide the MenuItem css, display only the select box.
      border: 'none !important',
      boxShadow: '7px 7px 10px -6px rgb(0 0 0 / 40%)',

      '& .MuiInputBase-root': {
        // color: theme.palette.text.secondary,
      },
      '& .MuiPaper-root[style]': {
        overflow: 'auto',
        // We hardcode left because the menu is too close from the window's border, mui calculate a bad left value.
        left: '10px !important',
        boxShadow: '7px 7px 10px -6px rgb(0 0 0 / 40%)',
      },
      '& .MuiSelect-iconOpen + div + fieldset': {
        // borderBottom: 'none',
      },
      '& fieldset': {
        borderRadius: 0,
      },
      '& .MuiSelect-selectMenu, & .MuiMenuItem-root ': {
        textOverflow: 'unset',
        whiteSpace: 'unset',
      },
      '& li:first-child': {
        paddingTop: '6px',
      },
      '& li': {
        paddingTop: '14px',
        paddingBottom: '14px',
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
      },
      '& li:last-child': {
        borderBottom: 'none',
        paddingBottom: '6px',
      },
      [theme.breakpoints.down('sm')]: {
        '& .MuiSelect-root': {
          maxHeight: 69,
        },
      },
    },
    currentValue: {
      display: 'flex',

      [theme.breakpoints.down('sm')]: {
        height: '100%',

        '& > span:first-child': {
          height: '100%',
          overflow: 'hidden',
          // Multiline overflow ellipsis
          display: '-webkit-box',
          '-webkitLineClamp': 3,
          '-webkitBoxOrient': 'vertical',
        },
      },
    },
    infoButton: {
      position: 'absolute',
      right: 33,
      margin: 'auto',
      bottom: 0,
      padding: 0,
      width: 18,
      top: 0,
      height: 18,
      paddingTop: 5, // needed because the MenuItem has an 5px margin top
      // color: theme.palette.text.secondary,
    },
  };
});

function GeltungsbereicheTopicMenu() {
  const dispatch = useDispatch();
  const layers = useSelector((state) => state.map.layers);
  const drawLayer = useSelector((state) => state.map.drawLayer);
  const ref = useRef();
  const { t } = useTranslation();
  const classes = useStyles();

  useEffect(() => {
    dispatch(setDialogPosition({ x: 390, y: 17 }));
  }, [dispatch]);

  const nonBaseLayers = useMemo(() => {
    return (
      layers
        ?.filter((layer) => layer !== drawLayer && !layer.get('isBaseLayer'))
        .reverse() || []
    );
  }, [drawLayer, layers]);

  const [value, setValue] = useState(
    (nonBaseLayers?.find((layer) => layer.visible) || {}).name,
  );

  useEffect(() => {
    const val = (nonBaseLayers?.find((layer) => layer.visible) || {}).name;
    if (!value && val) {
      setValue(val);
    }

    // In case visiblity is changed by another component
    const olKeys = nonBaseLayers.map((layer) => {
      return layer.on('change:visible', () => {
        if (layer.visible) {
          setValue(layer.name);
        }
      });
    });
    return () => {
      unByKey(olKeys);
    };
  }, [value, nonBaseLayers]);

  const onChange = useCallback(
    (opt) => {
      dispatch(setFeatureInfo());
      dispatch(setSelectedForInfos());
      setValue(opt.target.value);
      nonBaseLayers.forEach((layer) => {
        // eslint-disable-next-line no-param-reassign
        layer.visible = layer.name === opt.target.value;
      });
    },
    [dispatch, nonBaseLayers],
  );

  return (
    <MenuItem
      open
      className={`wkp-gb-topic-menu ${classes.root}`}
      collapsed={false}
      ref={ref}
    >
      {value && (
        <Select
          fullWidth
          data-cy="gb-select"
          value={value}
          renderValue={() => (
            <span className={classes.currentValue}>
              <span style={{ flex: 2 }}>{t(value)}</span>
              <span style={{ width: 20 }} />
            </span>
          )}
          onChange={onChange}
          MenuProps={{
            disablePortal: true,
            PaperProps: {
              style: {
                marginTop: 'unset',
                marginRight: 'unset',
              },
            },
            TransitionProps: {
              onEnter: (el) => {
                /**
                 * Dynamic width calculation por dropdown.
                 * The MUI width calculation fails because of the border.
                 * The element is always 2 x borderWidth too wide.
                 * With this hack I reduce the width to make it fit.
                 * @ignore
                 */
                const menuEl = el;
                menuEl.style.maxWidth = window.getComputedStyle(
                  ref.current.parentElement,
                ).maxWidth;
                menuEl.style.right = window.getComputedStyle(
                  ref.current.parentElement,
                ).right;
              },
            },
          }}
        >
          {nonBaseLayers.map((layer) => {
            if (layer.name === value) {
              return null;
            }

            return (
              <MuiMenuItem key={layer.key} value={layer.name}>
                {t(layer.name)}
              </MuiMenuItem>
            );
          })}
        </Select>
      )}
      <InfosButton
        className={`wkp-info-bt ${classes.infoButton}`}
        selectedInfo={layers.find((l) => l.name === value)}
      />
    </MenuItem>
  );
}

export default React.memo(GeltungsbereicheTopicMenu);
