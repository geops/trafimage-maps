import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Button from '@geops/react-ui/components/Button';
import Dialog from '../Dialog';
import { setDialogVisible, setDrawIds } from '../../model/app/actions';

export const NAME = 'drawRemoveDialog';

function DrawRemoveDialog() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const drawLayer = useSelector((state) => state.map.drawLayer);

  const clear = useCallback(() => {
    drawLayer.olLayer.getSource().clear(true);
    dispatch(setDrawIds());
    dispatch(setDialogVisible());
  }, [drawLayer, dispatch]);

  const closeDialog = useCallback(() => {
    dispatch(setDialogVisible());
  }, [dispatch]);

  return (
    <Dialog
      isModal
      name={NAME}
      title={<span>{t('Zeichnung  löschen')}</span>}
      body={
        <div>
          <div>
            {t('Wollen Sie den Plan wirklich aus der Karte löschen?')}
            <br />
            {t(
              'Um den Plan später zu bearbeiten, speichern Sie bitte folgenden Link:',
            )}
          </div>
          <hr />
          <div className="tm-draw-remove-dialog-footer">
            <Button onClick={clear}>{t('Löschen')}</Button>
            <Button onClick={closeDialog}>{t('Abbrechen')}</Button>
          </div>
        </div>
      }
    />
  );
}

export default React.memo(DrawRemoveDialog);
