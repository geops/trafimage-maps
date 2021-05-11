import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { FaDownload, FaInfoCircle } from 'react-icons/fa';
import { makeStyles } from '@material-ui/core';
import MuiMenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import MenuItem from '../../components/Menu/MenuItem';
import ExportButton from '../../components/ExportButton';
import determineMaxCanvasSize from '../../utils/canvasSize';

const LS_SIZE_KEY = 'tm.max.canvas.size';

const useStyles = makeStyles((theme) => ({
  menuContent: {
    padding: 16,
  },
  selectWrapper: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: 20,
  },
  input: {
    margin: '10px 10px 10px 20px',
    borderRadius: 0,
  },
  select: {
    padding: '10px 32px 10px 10px',
    textAlign: 'center',
    width: 100,
  },
  menuItem: {
    '&:hover': {
      color: 'red',
      backgroundColor: 'white',
    },
  },
  itemSelected: {
    color: 'red',
    backgroundColor: 'white !important',
  },
  infoWrapper: {
    display: 'flex',
    alignItems: 'start',
    margin: '20px 0',
    color: '#767676',
    fontSize: 13,
    lineHeight: '19.5px',
  },
  infoIcon: {
    marginRight: theme.spacing(1),
    flexShrink: 0,
    paddingTop: 3,
  },
}));

const sizesByFormat = {
  // https://www.din-formate.de/reihe-a-din-groessen-mm-pixel-dpi.html
  a0: [3370, 2384],
  a1: [2384, 1684],
};

const options = [
  { label: '72 dpi', value: 1 },
  { label: '150 dpi', value: 2 },
  { label: '300 dpi', value: 3 },
];

const MenuProps = {
  PaperProps: {
    square: true,
    style: {
      padding: 0,
      minWidth: 138,
    },
  },
};

const renderDropdown = (
  format,
  classes,
  getValueFct,
  handleChangeFct,
  validateOptionFct,
) => {
  return (
    <div className={classes.selectWrapper}>
      <span>{format.toUpperCase()}</span>
      <Select
        className={classes.input}
        classes={{ outlined: classes.select }}
        value={getValueFct(`${format}`)}
        onChange={(evt) => handleChangeFct(evt, `${format}`)}
        MenuProps={MenuProps}
        variant="outlined"
      >
        {options.map((opt) => {
          return (
            <MuiMenuItem
              key={`a1-${opt.value}`}
              value={opt}
              disabled={validateOptionFct(`${format}`, opt.value)}
              className={classes.menuItem}
              classes={{ selected: classes.itemSelected }}
            >
              {opt.label}
            </MuiMenuItem>
          );
        })}
      </Select>
    </div>
  );
};

const ExportMenu = () => {
  const classes = useStyles();
  const [collapsed, setCollapsed] = useState(false);
  const [maxCanvasSize, setMaxCanvasSize] = useState(
    parseFloat(localStorage.getItem(LS_SIZE_KEY)),
  );
  const permissionInfos = useSelector((state) => state.app.permissionInfos);
  const map = useSelector((state) => state.app.map);
  const [exportSelection, setExportSelection] = useState({
    format: 'a0',
    resolution: 1,
  });
  const { t } = useTranslation();
  const ref = useRef();

  useEffect(() => {
    let timeout = null;
    if (maxCanvasSize) {
      return () => {};
    }
    timeout = setTimeout(() => {
      const size = determineMaxCanvasSize();
      if (size) {
        setMaxCanvasSize(size);
        localStorage.setItem(LS_SIZE_KEY, size);
      }
    }, 10);
    return () => {
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (event, format) => {
    setExportSelection({
      format,
      resolution: event.target.value.value,
    });
  };

  const getValue = useCallback(
    (format) => {
      if (exportSelection.format !== format) {
        return { value: '' };
      }
      return options.find((opt) => opt.value === exportSelection.resolution);
    },
    [exportSelection],
  );

  const validateOption = useCallback(
    (format, exportScale) => {
      if (!map || !maxCanvasSize) {
        return true;
      }
      const exportSize = sizesByFormat[format];
      const mapSize = map.getSize();
      return (
        (maxCanvasSize &&
          ((exportSize &&
            (maxCanvasSize < exportSize[0] * exportScale ||
              maxCanvasSize < exportSize[1] * exportScale)) ||
            (!exportSize &&
              mapSize &&
              (maxCanvasSize < mapSize[0] * exportScale ||
                maxCanvasSize < mapSize[1] * exportScale)))) ||
        false
      );
    },
    [map, maxCanvasSize],
  );

  if (!permissionInfos || !permissionInfos.user || !maxCanvasSize) {
    return null;
  }

  return (
    <div ref={ref} id="wkp-export-menu">
      <MenuItem
        open
        title={t('Grossformatiges PDF exportieren')}
        icon={<FaDownload focusable={false} />}
        collapsed={collapsed}
        onCollapseToggle={(c) => setCollapsed(c)}
      >
        <div className={classes.menuContent}>
          {renderDropdown(
            'a0',
            classes,
            getValue,
            handleChange,
            validateOption,
          )}
          {renderDropdown(
            'a1',
            classes,
            getValue,
            handleChange,
            validateOption,
          )}
          <div className={classes.infoWrapper}>
            <FaInfoCircle
              focusable={false}
              fontSize="small"
              className={classes.infoIcon}
            />
            <div>
              <Typography variant="subtitle1">
                {t(
                  'Die maximal auswählbare dpi hängt von der Browser-Einstellung ab.',
                )}
              </Typography>
              <Typography variant="subtitle1">
                {t(
                  'Tipp: Verwenden Sie den Firefox-Browser für den Export hochauflösender Karten.',
                )}
              </Typography>
            </div>
          </div>
          <ExportButton
            exportScale={exportSelection.resolution}
            maxCanvasSize={maxCanvasSize}
          >
            {t('PDF exportieren')}
          </ExportButton>
        </div>
      </MenuItem>
    </div>
  );
};

export default React.memo(ExportMenu);
