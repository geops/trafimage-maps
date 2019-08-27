import React from 'react';
import { useSelector } from 'react-redux';
import LayerInfosDialog, {
  NAME as LayerInfosDialogName,
} from '../LayerInfosDialog';

const MainDialog = () => {
  const dialogVisible = useSelector(state => state.app.dialogVisible);
  const layerInfosOpen = useSelector(state => state.app.layerInfosOpen);

  if (layerInfosOpen && dialogVisible === LayerInfosDialogName) {
    return <LayerInfosDialog layer={layerInfosOpen} />;
  }

  return null;
};

export default MainDialog;
