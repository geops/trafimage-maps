import React, { useMemo, useCallback, useState, useEffect } from "react";
import PropTypes from "prop-types";
import makeStyles from "@mui/styles/makeStyles";
import { useTranslation } from "react-i18next";
import Typography from "@mui/material/Typography";
import Feature from "ol/Feature";
import Dialog from "../../components/Dialog";
import PhotoCarusel from "../../components/PhotoCarusel";

import fakePhotos from "./testFotos";

const useStylesDialog = makeStyles(() => ({
  dialogRoot: {
    position: "fixed !important",
  },
  dialogContainer: {
    maxWidth: 1200,
    maxHeight: "100%",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: 25,
  },
  photo: {
    maxWidth: "100%",
  },
}));

const usePhotos = (properties, feature) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const photos = useMemo(
    () =>
      Array.from(Array(7).keys()).reduce((allPhotos, key) => {
        const photo = properties[`foto_${key}`];
        if (photo) {
          allPhotos.push(photo);
        }
        return allPhotos;
      }, []),
    [properties],
  );
  useEffect(() => {
    setCurrentPhotoIndex(0);
  }, [feature]);
  const incrementPhotoIndex = useCallback(() => {
    setCurrentPhotoIndex((current) => current + 1);
  }, []);
  const decrementPhotoIndex = useCallback(() => {
    setCurrentPhotoIndex((current) => current - 1);
  }, []);
  return [photos, currentPhotoIndex, incrementPhotoIndex, decrementPhotoIndex];
};

function MesswagenPhotosPopup({ feature }) {
  const classesDialog = useStylesDialog();
  const { t } = useTranslation();
  const [fullSize, setFullSize] = useState(false);
  const properties = feature.getProperties();
  const [photos, currentPhotoIndex, incrementPhotoIndex, decrementPhotoIndex] =
    usePhotos(
      {
        ...properties,
        ...fakePhotos,
      },
      feature,
    );

  return (
    <>
      <div>
        {properties.description && (
          <Typography paragraph>{properties.description}</Typography>
        )}
        {photos && (
          <PhotoCarusel
            photos={photos}
            currentPhotoIndex={currentPhotoIndex}
            onIncrement={incrementPhotoIndex}
            onDecrement={decrementPhotoIndex}
            altText={`${properties.bezeichnung}-foto-${currentPhotoIndex}`}
            onImageClick={() => setFullSize(!fullSize)}
          />
        )}
      </div>
      {fullSize && (
        <Dialog
          isModal
          name="ga-export-menu"
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
                currentPhotoIndex={currentPhotoIndex}
                onIncrement={incrementPhotoIndex}
                onDecrement={decrementPhotoIndex}
                altText={`${properties.bezeichnung}-foto-${currentPhotoIndex}`}
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
