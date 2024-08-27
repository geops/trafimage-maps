import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { FaTrash, FaInfoCircle } from "react-icons/fa";
import { Grid, Typography, IconButton } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useMatomo } from "@jonkoops/matomo-tracker-react";
import { setDialogVisible } from "../../model/app/actions";
import DrawButton from "../DrawButton";
import { NAME } from "../DrawRemoveDialog";
import DrawPermalinkButton from "../DrawPermalinkButton";
import { ReactComponent as PencilAdd } from "../../img/pencil_add.svg";
import { TRACK_NEW_DRAW_ACTION } from "../../utils/constants";
import { trackEvent } from "../../utils/trackingUtils";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  buttons: {
    display: "flex",
    paddingLeft: 12,
    gap: 24,

    "& .MuiButtonBase-root": {
      height: 20,
      padding: 0,
    },
  },
  caption: {
    display: "flex",
    alignItems: "start",
    gap: theme.spacing(1),
    marginTop: theme.spacing(2),
  },
  infoIcon: {
    flexShrink: 0,
    paddingTop: 3,
  },
}));

const getTrackEventOptions = (activeTopic, t, opts) => ({
  eventType: "action",
  componentName: "edit button",
  label: t("Neue Zeichnung"),
  location: t(activeTopic?.name, { lng: "de" }),
  variant: "Neue Zeichnung",
  ...opts,
});

function Draw() {
  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { trackEvent: trackMatomoEvent } = useMatomo();
  const drawIds = useSelector((state) => state.app.drawIds);
  const activeTopic = useSelector((state) => state.app.activeTopic);
  const onRemoveClick = useCallback(() => {
    dispatch(setDialogVisible(NAME));
  }, [dispatch]);

  return (
    <div className={classes.root}>
      <Grid container>
        <Grid item xs={12} className={classes.buttons}>
          <DrawButton
            disabled={!!drawIds}
            onClick={() => {
              trackMatomoEvent({
                category: activeTopic?.key,
                action: TRACK_NEW_DRAW_ACTION,
              });
              trackEvent(getTrackEventOptions(activeTopic, t));
            }}
          >
            <PencilAdd focusable={false} />
          </DrawButton>
          <DrawButton
            disabled={!drawIds}
            title={t("Zeichnung bearbeiten")}
            onClick={() => {
              trackEvent(
                getTrackEventOptions(activeTopic, t, {
                  label: t("Zeichnung bearbeiten"),
                  variant: "Zeichnung bearbeiten",
                }),
              );
            }}
          />
          <IconButton
            title={t("Zeichnung löschen")}
            onClick={onRemoveClick}
            disabled={!drawIds}
          >
            <FaTrash />
          </IconButton>
          <DrawPermalinkButton
            buttonProps={{
              title: t("Zeichnung teilen"),
              disabled: !drawIds,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1" className={classes.caption}>
            <FaInfoCircle
              focusable={false}
              fontSize="small"
              className={classes.infoIcon}
            />
            <span>
              {t(
                "Ihre Zeichnung wird ein Jahr lang gespeichert. Bitte speichernSie vor dem verlassen der Seite den Link zum Bearbeiten der Zeichnung.",
              )}
            </span>
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
}
export default React.memo(Draw);
