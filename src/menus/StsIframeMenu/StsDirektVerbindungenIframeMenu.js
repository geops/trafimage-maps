import React, { useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core';
import MenuItem from '../../components/Menu/MenuItem';
import { setDialogPosition } from '../../model/app/actions';

const useStyles = makeStyles(() => {
  return {
    root: {
      '&.wkp-menu-item': {
        marginTop: '0 !important',
      },
    },
  };
});

function StsDirektVerbindungenIframeMenu({ collapsed, onClick }) {
  const dispatch = useDispatch();
  // const layers = useSelector((state) => state.map.layers);
  // const drawLayer = useSelector((state) => state.map.drawLayer);
  const ref = useRef();
  //   const [node, setNode] = useState();
  const { t } = useTranslation();
  const classes = useStyles();

  useEffect(() => {
    dispatch(setDialogPosition({ x: 390, y: 17 }));
  }, [dispatch]);

  // const nonBaseLayers = useMemo(() => {
  //   return (
  //     layers
  //       ?.filter((layer) => layer !== drawLayer && !layer.get('isBaseLayer'))
  //       .reverse() || []
  //   );
  // }, [drawLayer, layers]);

  // console.log(nonBaseLayers);

  return (
    <MenuItem
      onCollapseToggle={(isOpen) => onClick(isOpen)}
      className={`wkp-gb-topic-menu ${classes.root}`}
      collapsed={collapsed}
      ref={ref}
      title={t('Direct trains to Switzerland')}
    >
      Wank
    </MenuItem>
  );
}

export default React.memo(StsDirektVerbindungenIframeMenu);
