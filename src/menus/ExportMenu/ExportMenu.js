import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { FaDownload } from 'react-icons/fa';
import { makeStyles } from '@material-ui/core';
import MenuItem from '../../components/Menu/MenuItem';
import ExportButton from '../../components/ExportButton';

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
  const permissionInfos = useSelector((state) => state.app.permissionInfos);
  const { t } = useTranslation();
  const ref = useRef();

  if (!permissionInfos?.user) {
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
          <ExportButton>A0 (72dpi)</ExportButton>
          <ExportButton exportScale={2}>A0 (150dpi)</ExportButton>
          <ExportButton exportScale={3}>A0 (300dpi)</ExportButton>
          <ExportButton exportFormat="a1">A1 (72dpi)</ExportButton>
          <ExportButton exportFormat="a1" exportScale={2}>
            A1 (150dpi)
          </ExportButton>
          <ExportButton exportFormat="a1" exportScale={3}>
            A1 (300dpi)
          </ExportButton>
        </div>
      </MenuItem>
    </div>
  );
};

export default React.memo(ExportMenu);
