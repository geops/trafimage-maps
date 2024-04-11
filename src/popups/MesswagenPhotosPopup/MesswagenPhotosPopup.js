import React, { useMemo, useCallback, useState, useEffect } from "react";
import PropTypes from "prop-types";
import makeStyles from "@mui/styles/makeStyles";
import { useTranslation } from "react-i18next";
import Typography from "@mui/material/Typography";
import Feature from "ol/Feature";
import Dialog from "../../components/Dialog";
import PhotoCarusel from "../../components/PhotoCarusel";

const useStylesDialog = makeStyles(() => ({
  dialogRoot: {
    position: "fixed !important",
  },
  dialogContainer: {
    maxWidth: "clamp(300px, 80vw, 1100px)",
    maxHeight: "100%",
  },
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 25,
    maxWidth: "100%",
  },
}));

function MesswagenPhotosPopup({ feature }) {
  const classesDialog = useStylesDialog();
  const { t } = useTranslation();
  const [fullSize, setFullSize] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const properties = feature.getProperties();
  const photos = useMemo(
    () =>
      Array.from(Array(7).keys()).reduce((allPhotos, key) => {
        const featProps = feature.getProperties();
        const photo = featProps[`foto_${key + 1}`];
        if (photo) {
          allPhotos.push(photo);
        }
        return allPhotos;
      }, []),
    [feature],
  );
  const getCurrentPhotoIndex = useCallback(
    (index) => setCurrentPhotoIndex(index),
    [],
  );

  useEffect(() => {
    setCurrentPhotoIndex(0);
  }, [feature]);

  return (
    <>
      <div>
        {properties.description && (
          <Typography paragraph>{properties.description}</Typography>
        )}
        {photos && (
          <PhotoCarusel
            photos={photos}
            onIncrement={getCurrentPhotoIndex}
            onDecrement={getCurrentPhotoIndex}
            onImageClick={() => setFullSize(true)}
          />
        )}
      </div>
      {fullSize && (
        <Dialog
          isModal
          name="messwagen-photos-dialog"
          title={<span>{`${properties.bezeichnung} - ${t("Fotos")}`}</span>}
          className="tm-dialog-container"
          classes={{
            root: classesDialog.dialogRoot,
            paper: classesDialog.dialogContainer,
          }}
          onClose={() => setFullSize(false)}
          body={
            <div className={classesDialog.container}>
              <PhotoCarusel
                photos={photos}
                initialPhotoIndex={currentPhotoIndex}
              />
            </div>
          }
        />
      )}
    </>
  );
}

MesswagenPhotosPopup.propTypes = {
  feature: PropTypes.instanceOf(Feature),
};
MesswagenPhotosPopup.defaultProps = {
  feature: null,
};
MesswagenPhotosPopup.renderTitle = (feature) =>
  feature.get("bezeichnung") || "";
export default MesswagenPhotosPopup;
