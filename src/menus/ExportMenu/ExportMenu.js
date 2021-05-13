import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { FaDownload, FaInfoCircle } from 'react-icons/fa';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
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
  input: {
    borderRadius: 2,
    width: 140,
  },
  select: {
    padding: '15px !important',
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
    margin: '10px 0',
  },
  infoIcon: {
    marginRight: theme.spacing(1),
    flexShrink: 0,
    paddingTop: 3,
    color: '#767676',
  },
}));

const sizesByFormat = {
  // https://www.din-formate.de/reihe-a-din-groessen-mm-pixel-dpi.html
  a0: [3370, 2384],
  a1: [2384, 1684],
};

const options = [
  { label: 'A0 (72 dpi)', resolution: 1, format: 'a0', weight: 2 },
  { label: 'A0 (150 dpi)', resolution: 2, format: 'a0', weight: 4 },
  { label: 'A0 300 dpi', resolution: 3, format: 'a0', weight: 6 },
  { label: 'A1 (72 dpi)', resolution: 1, format: 'a1', weight: 1 },
  { label: 'A1 (150 dpi)', resolution: 2, format: 'a1', weight: 3 },
  { label: 'A1 300 dpi', resolution: 3, format: 'a1', weight: 5 },
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
      minWidth: 136,
      border: '2px solid #888',
      borderTop: '1px solid rgba(0, 0, 0, 0.30)',
      borderRadius: '0 0 2px 2px',
      marginTop: -3,
    },
  },
};

const validateOption = (format, exportScale, maxCanvasSize, map) => {
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
};

const getHighestPossibleRes = (maxCanvasSize, map) => {
  const highestRes = options.reduce((final, option) => {
    let newFinal = { ...final };
    if (
      !validateOption(option.format, option.resolution, maxCanvasSize, map) &&
      option.weight > (final.weight || 0)
    ) {
      newFinal = option;
    }
    return newFinal;
  });
  return { format: highestRes.format, resolution: highestRes.resolution };
};

const ExportMenu = () => {
  const classes = useStyles();
  const activeTopic = useSelector((state) => state.app.activeTopic);
  const menuOpen = useSelector((state) => state.app.menuOpen);
  const collapsedOnLoad = useMemo(() => {
    return activeTopic.elements.exportMenu?.collapsedOnLoad || false;
  }, [activeTopic]);
  const [collapsed, setCollapsed] = useState(collapsedOnLoad);
  const [maxCanvasSize, setMaxCanvasSize] = useState(
    parseFloat(localStorage.getItem(LS_SIZE_KEY)),
  );
  const map = useSelector((state) => state.app.map);
  const [exportSelection, setExportSelection] = useState(
    getHighestPossibleRes(maxCanvasSize, map),
  );
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

  useEffect(() => {
    // Open menu item when loading/switching topic
    if (menuOpen) {
      setCollapsed(collapsedOnLoad);
    }
  }, [menuOpen, collapsedOnLoad]);

  const handleChange = (event) => {
    setExportSelection({
      format: event.target.value.format,
      resolution: event.target.value.resolution,
    });
  };

  const getValue = useCallback(() => {
    return options.find(
      (opt) =>
        opt.resolution === exportSelection.resolution &&
        opt.format === exportSelection.format,
    );
  }, [exportSelection]);

  return (
    <div ref={ref} id="wkp-export-menu">
      <MenuItem
        open
        title={t('Grossformatiges PDF exportieren')}
        icon={<FaDownload focusable={false} />}
        collapsed={collapsed}
        onCollapseToggle={(c) => setCollapsed(c)}
        fixedHeight={200}
      >
        <div className={classes.menuContent}>
          <div className={classes.selectWrapper}>
            <FormControl className={classes.formControl}>
              <InputLabel
                className={classes.label}
                id="pdf-format-select-label"
              >
                {t('Format')}
              </InputLabel>
              <Select
                labelId="pdf-format-select-label"
                id="pdf-format-select-label"
                IconComponent={ExpandMoreIcon}
                className={classes.input}
                classes={{ outlined: classes.select }}
                value={getValue()}
                onChange={(evt) => handleChange(evt)}
                MenuProps={MenuProps}
                variant="outlined"
              >
                {options.map((opt) => {
                  return (
                    <MuiMenuItem
                      key={`${opt.format}-${opt.resolution}`}
                      value={opt}
                      disabled={validateOption(
                        `${opt.format}`,
                        opt.resolution,
                        maxCanvasSize,
                        map,
                      )}
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
              exportFormat={exportSelection.format}
              exportScale={exportSelection.resolution}
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
