import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { makeStyles, MenuItem as MuiMenuItem } from '@material-ui/core';
import { unByKey } from 'ol/Observable';
import MenuItem from '../../components/Menu/MenuItem';
import Select from '../../components/Select';
import InfosButton from '../../components/InfosButton';

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
  };
});

function GeltungsbereicheTopicMenu() {
  const layers = useSelector((state) => state.map.layers);
  const ref = useRef();
  const { t } = useTranslation();
  const classes = useStyles();
  const nonBaseLayers = useMemo(() => {
    return layers?.filter((layer) => !layer.get('isBaseLayer')).reverse() || [];
  }, [layers]);

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
          renderValue={() => <span>{t(value)}</span>}
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
                window.el = ref.current;
                console.log(ref.current.clientWidth);
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
                menuEl.style.left = '10px';
              },
            },
          }}
        >
          {nonBaseLayers.map((layer) => {
            return (
              <MuiMenuItem
                key={layer.key}
                value={layer.name}
                style={{ display: 'flex' }}
              >
                <span style={{ flex: 2 }}>{t(layer.name)}</span>
                <InfosButton selectedInfo={layer} />
              </MuiMenuItem>
            );
          })}
        </Select>
      )}
    </MenuItem>
  );
}

export default React.memo(GeltungsbereicheTopicMenu);
