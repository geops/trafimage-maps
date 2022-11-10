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
import { setDialogPosition } from '../../model/app/actions';

const useStyles = makeStyles(() => {
  return {
    root: {
      background: 'transparent !important',
      border: 'none !important',
      '& .MuiSelect-root': {
        background: 'white',
      },
      '& .MuiSelect-selectMenu, & .MuiMenuItem-root ': {
        textOverflow: 'unset',
        whiteSpace: 'unset',
        boxSizing: 'border-box',
      },
      ' & .MuiMenu-paper': {
        boxSizing: 'border-box',
      },
    },
    menuItem: {
      textOverflow: 'unset',
      whiteSpace: 'unset',
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
      setValue(opt.target.value);

      nonBaseLayers.forEach((layer) => {
        // eslint-disable-next-line no-param-reassign
        layer.visible = layer.name === opt.target.value;
      });
    },
    [nonBaseLayers],
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
            <span style={{ display: 'flex' }}>
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
                menuEl.style.minWidth = `${ref.current.clientWidth}px`;
                menuEl.style.width = `${ref.current.clientWidth}px`;
              },
              onEntered: (el) => {
                /**
                 * Dynamic width calculation por dropdown.
                 * The MUI width calculation fails because of the border.
                 * The element is always 2 x borderWidth too wide.
                 * With this hack I reduce the width to make it fit.
                 * @ignore
                 */
                const menuEl = el;
                menuEl.style.left = `${Math.floor(menuEl.style.left) - 2}px`;
              },
            },
          }}
        >
          {nonBaseLayers.map((layer) => {
            if (layer.name === value) {
              return null;
            }

            return (
              <MuiMenuItem
                key={layer.key}
                value={layer.name}
                style={{ display: 'flex' }}
              >
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
