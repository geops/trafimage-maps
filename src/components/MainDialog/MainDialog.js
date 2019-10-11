import React, { forwardRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaInfo } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import LayerInfosDialog, {
  NAME as LayerInfosDialogName,
} from '../LayerInfosDialog';
import Dialog from '../Dialog';
import LegalLines from '../LegalLines';
import { setDialogPosition } from '../../model/app/actions';

const MainDialog = forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const dialogVisible = useSelector(state => state.app.dialogVisible);
  const language = useSelector(state => state.app.language);
  const selectedForInfos = useSelector(state => state.app.selectedForInfos);

  if (selectedForInfos && dialogVisible === LayerInfosDialogName) {
    return (
      <LayerInfosDialog
        ref={ref}
        selectedForInfos={selectedForInfos}
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

  if (/(Kontakt|Impressum|Rechtliches)/.test(dialogVisible)) {
    return (
      <Dialog
        isModal
        ref={ref}
        name="legallines"
        title={
          <span>
            <FaInfo /> {t(dialogVisible)}
          </span>
        }
        body={
          <LegalLines doc={dialogVisible.toLowerCase()} language={language} />
        }
      />
    );
  }

  return null;
});

export default MainDialog;
