import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { FaDownload } from 'react-icons/fa';
import { makeStyles } from '@material-ui/core';
import MenuItem from '../../components/Menu/MenuItem';
import ExportButton from '../../components/ExportButton';
import determineMaxCanvasSize from '../../utils/canvasSize';

const LS_SIZE_KEY = 'tm.max.canvas.size';

const useStyles = makeStyles(() => ({
  menuContent: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
}));

const ExportMenu = () => {
  const classes = useStyles();
  const [collapsed, setCollapsed] = useState(false);
  const [maxCanvasSize, setMaxCanvasSize] = useState(
    localStorage.getItem(LS_SIZE_KEY),
  );
  const permissionInfos = useSelector((state) => state.app.permissionInfos);
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

  if (!permissionInfos || !permissionInfos.user || !maxCanvasSize) {
    return null;
  }

  return (
    <div ref={ref} id="test">
      <MenuItem
        open
        title={t('Grossformatiges PDF exportieren')}
        icon={<FaDownload focusable={false} />}
        collapsed={collapsed}
        onCollapseToggle={(c) => setCollapsed(c)}
      >
        <div className={classes.menuContent}>
          <ExportButton maxCanvasSize={maxCanvasSize}>A0 (72dpi)</ExportButton>
          <ExportButton exportScale={2} maxCanvasSize={maxCanvasSize}>
            A0 (150dpi)
          </ExportButton>
          <ExportButton exportScale={3} maxCanvasSize={maxCanvasSize}>
            A0 (300dpi)
          </ExportButton>
          <ExportButton exportFormat="a1" maxCanvasSize={maxCanvasSize}>
            A1 (72dpi)
          </ExportButton>
          <ExportButton
            exportFormat="a1"
            exportScale={2}
            maxCanvasSize={maxCanvasSize}
          >
            A1 (150dpi)
          </ExportButton>
          <ExportButton
            exportFormat="a1"
            exportScale={3}
            maxCanvasSize={maxCanvasSize}
          >
            A1 (300dpi)
          </ExportButton>
        </div>
      </MenuItem>
    </div>
  );
};

export default React.memo(ExportMenu);
