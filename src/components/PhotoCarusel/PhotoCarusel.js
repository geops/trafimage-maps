import React, { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { IconButton, Typography } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { ChevronLeft, ChevronRight, ZoomIn } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import useIsSmallScreen from "../../utils/useHasScreenSize";

const useStyles = makeStyles((theme) => ({
  imageButton: {
    backgroundColor: "transparent",
    border: "none",
    padding: 0,
    cursor: "pointer",
    position: "relative",
    width: "100%",
    height: "fit-content",
    display: "flex",
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: (props) =>
      props.imageHover ? "rgba(0, 0, 0, 0.2)" : "rgba(0, 0, 0, 0)",
    zIndex: 99,
    transition: "background-color 0.3s",
    ...theme.styles.flexCenter,
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.2)",
    },
  },
  zoomInIcon: {
    borderRadius: "50%",
    backgroundColor: "white",
    width: 40,
    height: 40,
    ...theme.styles.flexCenter,
    opacity: (props) => (props.imageHover ? 1 : 0),
    transition: "opacity 0.3s",
  },
  photo: {
    maxWidth: "100%",
  },
  photoNavigation: {
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
  },
}));

const useStylesPhoto = makeStyles((theme) => ({
  wrapper: {
    ...theme.styles.flexCenter,
  },
}));

function Photo({ src, maxWidth }) {
  const { t } = useTranslation();
  const classes = useStylesPhoto();
  const [loading, setLoading] = useState(true);
  useEffect(() => setLoading(true), [src]);
  return (
    <div className={classes.wrapper}>
      {loading && <div>{t("Wird geladen")}...</div>}
      <img
        src={src}
        alt={src}
        onLoad={() => setLoading(false)}
        style={{ maxWidth, display: loading ? "none" : "block" }}
        data-testid="fmw-photo"
      />
    </div>
  );
}

Photo.propTypes = {
  src: PropTypes.string,
  maxWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Photo.defaultProps = {
  src: "",
  maxWidth: "100%",
};

function PhotoCarusel({
  photos,
  initialPhotoIndex,
  onImageClick,
  onIncrement,
  onDecrement,
}) {
  const { t } = useTranslation();
  const isSmallScreen = useIsSmallScreen(["xs", "s"]);
  const [imageHover, setImageHover] = useState(false);
  const classes = useStyles({ imageHover });
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(
    initialPhotoIndex || 0,
  );
  const incrementPhotoIndex = useCallback(() => {
    setCurrentPhotoIndex(currentPhotoIndex + 1);
    if (onIncrement) {
      onIncrement(currentPhotoIndex + 1);
    }
  }, [currentPhotoIndex, onIncrement]);
  const decrementPhotoIndex = useCallback(() => {
    setCurrentPhotoIndex(currentPhotoIndex - 1);
    if (onDecrement) {
      onDecrement(currentPhotoIndex - 1);
    }
  }, [onDecrement, currentPhotoIndex]);
  useEffect(() => {
    setCurrentPhotoIndex(initialPhotoIndex || 0);
  }, [photos, initialPhotoIndex]);

  if (!photos || photos.length === 0) {
    return null;
  }

  return (
    <>
      {onImageClick && !isSmallScreen ? (
        // eslint-disable-next-line jsx-a11y/control-has-associated-label
        <button
          className={classes.imageButton}
          onClick={onImageClick}
          type="button"
          onMouseEnter={() => setImageHover(true)}
          onMouseLeave={() => setImageHover(false)}
          data-testid="fmw-photo-button"
        >
          <Photo src={photos[currentPhotoIndex]} />
          <div className={classes.imageOverlay}>
            <div className={classes.zoomInIcon}>
              <ZoomIn />
            </div>
          </div>
        </button>
      ) : (
        <Photo
          src={photos[currentPhotoIndex]}
          maxWidth={isSmallScreen ? "100%" : "80%"}
        />
      )}
      {photos.length > 1 && (
        <div className={classes.photoNavigation}>
          <IconButton
            title={t("zurück")}
            disabled={currentPhotoIndex === 0}
            onClick={decrementPhotoIndex}
            data-testid="fmw-photo-decrement-button"
          >
            <ChevronLeft />
          </IconButton>
          <Typography>
            {currentPhotoIndex + 1} {t("von")} {photos.length}
          </Typography>
          <IconButton
            title={t("weiter")}
            disabled={currentPhotoIndex === photos.length - 1}
            onClick={incrementPhotoIndex}
            data-testid="fmw-photo-increment-button"
          >
            <ChevronRight />
          </IconButton>
        </div>
      )}
    </>
  );
}

PhotoCarusel.propTypes = {
  photos: PropTypes.arrayOf(PropTypes.string),
  initialPhotoIndex: PropTypes.number,
  onImageClick: PropTypes.func,
  onIncrement: PropTypes.func,
  onDecrement: PropTypes.func,
};

PhotoCarusel.defaultProps = {
  photos: [],
  initialPhotoIndex: null,
  onImageClick: null,
  onIncrement: null,
  onDecrement: null,
};

export default PhotoCarusel;
