import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@mui/styles";
import { Button } from "@mui/material";
import PermalinkInput from "../PermalinkInput";
import Dialog from "../Dialog";
import { setDialogVisible, setDrawIds } from "../../model/app/actions";

export const NAME = "drawRemoveDialog";

const useStyles = makeStyles((theme) => ({
  dialogContainer: {
    minWidth: "400px !important",
  },
  link: {
    marginTop: theme.spacing(2),
  },
  footer: {
    marginTop: theme.spacing(2),
    paddingTop: theme.spacing(2),
    display: "flex",
    justifyContent: "flex-end",
    width: "100%",

    "& > button": {
      marginLeft: theme.spacing(2),
    },
  },
}));

function DrawRemoveDialog() {
  const classes = useStyles();
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
      title={<span>{t("Zeichnung löschen")}</span>}
      className={`tm-dialog-container ${classes.dialogContainer}`}
      body={
        <div>
          <div>
            {t("Wollen Sie den Plan wirklich aus der Karte löschen?")}
            <br />
            {t(
              "Um den Plan später zu bearbeiten, speichern Sie bitte folgenden Link",
            )}
            :
          </div>
          <div className={classes.link}>
            <PermalinkInput value={window.location.href} />
          </div>
          <div className={classes.footer}>
            <Button onClick={clear}>{t("Löschen")}</Button>
            <Button onClick={closeDialog} color="secondary">
              {t("Abbrechen")}
            </Button>
          </div>
        </div>
      }
    />
  );
}

export default React.memo(DrawRemoveDialog);
