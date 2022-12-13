import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { FaInfo } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import LayerInfosDialog, {
  NAME as LayerInfosDialogName,
} from '../LayerInfosDialog';
import DrawRemoveDialog, {
  NAME as DrawRemoveDialogName,
} from '../DrawRemoveDialog';
import Dialog from '../Dialog';
import LegalLines from '../LegalLines';

function MainDialog() {
  const { t } = useTranslation();
  const dialogVisible = useSelector((state) => state.app.dialogVisible);
  const language = useSelector((state) => state.app.language);
  const screenWidth = useSelector((state) => state.app.screenWidth);
  const isMobileWidth = useMemo(() => {
    return ['xs', 's'].includes(screenWidth);
  }, [screenWidth]);
  const selectedForInfos = useSelector((state) => state.app.selectedForInfos);

  if (selectedForInfos && dialogVisible === LayerInfosDialogName) {
    return (
      <LayerInfosDialog
        selectedForInfos={selectedForInfos}
        isDraggable={!isMobileWidth}
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

  if (dialogVisible === DrawRemoveDialogName) {
    return <DrawRemoveDialog />;
  }

  return null;
}

export default MainDialog;
