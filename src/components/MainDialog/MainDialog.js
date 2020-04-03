import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaInfo } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import LayerInfosDialog, {
  NAME as LayerInfosDialogName,
} from '../LayerInfosDialog';
import Dialog from '../Dialog';
import LegalLines from '../LegalLines';
import { setDialogPosition } from '../../model/app/actions';

const MainDialog = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const dialogVisible = useSelector(state => state.app.dialogVisible);
  const language = useSelector(state => state.app.language);
  const isMobileWidth = useSelector(state => state.app.isMobileWidth);
  const selectedForInfos = useSelector(state => state.app.selectedForInfos);

  if (selectedForInfos && dialogVisible === LayerInfosDialogName) {
    return (
      <LayerInfosDialog
        selectedForInfos={selectedForInfos}
        style={{
          top: 'unset',
          bottom: isMobileWidth ? '0px' : 'unset',
          padding: '10px',
          zIndex: '1',
        }}
        width="calc(100% - 20px)"
        height="auto"
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
};

export default MainDialog;
