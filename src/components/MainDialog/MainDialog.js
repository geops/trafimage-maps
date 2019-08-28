import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import LayerInfosDialog, {
  NAME as LayerInfosDialogName,
} from '../LayerInfosDialog';
import { setDialogPosition } from '../../model/app/actions';

const MainDialog = () => {
  const dispatch = useDispatch();
  const dialogVisible = useSelector(state => state.app.dialogVisible);
  const layerSelectedForInfos = useSelector(
    state => state.app.layerSelectedForInfos,
  );

  if (layerSelectedForInfos && dialogVisible === LayerInfosDialogName) {
    return (
      <LayerInfosDialog
        layer={layerSelectedForInfos}
        onDragStop={(evt, pos) => {
          dispatch(
            setDialogPosition({
              x: pos.lastX,
              y: pos.lastY,
            }),
          );
        }}
      />
    );
  }

  return null;
};

export default MainDialog;
