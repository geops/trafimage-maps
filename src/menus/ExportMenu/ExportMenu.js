import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { FaDownload, FaInfoCircle } from 'react-icons/fa';
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/core';
import MuiMenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
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
    justifyContent: 'space-between',
    marginLeft: 20,
  },
  label: {
    top: -18,
  },
  select: {
    padding: '15px !important',
    width: 150,
  },
  arrow: {
    width: 25,
    height: 25,
  },
  menuItem: {
    paddingLeft: 12,
    '&:hover': {
      color: '#eb0000',
      backgroundColor: 'white',
    },
  },
  itemSelected: {
    color: '#eb0000',
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
  { label: 'A0 (72 dpi)', value: 1, format: 'a0' },
  { label: 'A0 (150 dpi)', value: 2, format: 'a0' },
  { label: 'A0 300 dpi', value: 3, format: 'a0' },
  { label: 'A1 (72 dpi)', value: 1, format: 'a1' },
  { label: 'A1 (150 dpi)', value: 2, format: 'a1' },
  { label: 'A1 300 dpi', value: 3, format: 'a1' },
];

const MenuProps = {
  getContentAnchorEl: null,
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'left',
  },
  PaperProps: {
    style: {
      padding: 0,
      minWidth: 165,
      border: '2px solid black',
      borderTop: '1px solid rgba(0, 0, 0, 0.30)',
      borderRadius: '0 0 4px 4px',
      marginTop: -3,
    },
  },
};

const ExportMenu = () => {
  const classes = useStyles();
  const [collapsed, setCollapsed] = useState(false);
  const [maxCanvasSize, setMaxCanvasSize] = useState(
    parseFloat(localStorage.getItem(LS_SIZE_KEY)),
  );
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

  const handleChange = (event) => {
    setExportSelection({
      format: event.target.value.format,
      resolution: event.target.value.value,
    });
  };

  const getValue = useCallback(() => {
    return options.find(
      (opt) =>
        opt.value === exportSelection.resolution &&
        opt.format === exportSelection.format,
    );
  }, [exportSelection]);

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
          <div className={classes.selectWrapper}>
            <FormControl className={classes.formControl}>
              <InputLabel
                className={classes.label}
                id="pdf-format-select-label"
              >
                Aulösung
              </InputLabel>
              <Select
                labelId="pdf-format-select-label"
                id="pdf-format-select-label"
                // IconComponent={() => <ExpandMoreIcon className="MuiSelect-iconOutlined"/>}
                className={classes.input}
                classes={{
                  outlined: classes.select,
                  iconOutlined: classes.arrow,
                }}
                value={getValue()}
                onChange={(evt) => handleChange(evt)}
                MenuProps={MenuProps}
                variant="outlined"
              >
                {options.map((opt) => {
                  return (
                    <MuiMenuItem
                      key={`${opt.format}-${opt.value}`}
                      value={opt}
                      disabled={validateOption(`${opt.format}`, opt.value)}
                      className={classes.menuItem}
                      classes={{ selected: classes.itemSelected }}
                    >
                      {opt.label}
                    </MuiMenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <ExportButton
              exportScale={exportSelection.resolution}
              maxCanvasSize={maxCanvasSize}
            >
              {t('PDF exportieren')}
            </ExportButton>
          </div>
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
        </div>
      </MenuItem>
    </div>
  );
};

export default React.memo(ExportMenu);
