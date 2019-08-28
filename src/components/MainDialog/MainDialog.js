import React from 'react';
import { useSelector } from 'react-redux';
import LayerInfosDialog, {
  NAME as LayerInfosDialogName,
} from '../LayerInfosDialog';

const MainDialog = () => {
  const dialogVisible = useSelector(state => state.app.dialogVisible);
  const layerSelectedForInfos = useSelector(
    state => state.app.layerSelectedForInfos,
  );

  if (layerSelectedForInfos && dialogVisible === LayerInfosDialogName) {
    return <LayerInfosDialog layer={layerSelectedForInfos} />;
  }

  return null;
};

export default MainDialog;
