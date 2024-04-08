import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { IconButton, Typography } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { ChevronLeft, ChevronRight, ZoomIn } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import useIsMobile from "../../utils/useIsMobile";

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

function Photo({ src, alt, maxWidth }) {
  const { t } = useTranslation();
  const classes = useStylesPhoto();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
  }, [src]);
  return (
    <div className={classes.wrapper}>
      {loading && <div>{t("Wird geladen")}...</div>}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoading(false)}
        style={{ maxWidth, display: loading ? "none" : "block" }}
      />
    </div>
  );
}

Photo.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  maxWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Photo.defaultProps = {
  src: "",
  alt: "",
  maxWidth: "100%",
};

function PhotoCarusel({
  photos,
  currentPhotoIndex,
  onImageClick,
  onIncrement,
  onDecrement,
  altText,
}) {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [imageHover, setImageHover] = useState(false);
  const classes = useStyles({ imageHover });

  if (!photos || photos.length === 0) {
    return null;
  }

  return (
    <>
      {onImageClick && !isMobile ? (
        <button
          className={classes.imageButton}
          onClick={onImageClick}
          type="button"
          onMouseEnter={() => setImageHover(true)}
          onMouseLeave={() => setImageHover(false)}
        >
          <Photo src={photos[currentPhotoIndex]} alt={altText} />
          <div className={classes.imageOverlay}>
            <div className={classes.zoomInIcon}>
              <ZoomIn />
            </div>
          </div>
        </button>
      ) : (
        <Photo
          src={photos[currentPhotoIndex]}
          alt={altText}
          maxWidth={isMobile ? "100%" : "80%"}
        />
      )}
      {photos.length > 1 && (
        <div className={classes.photoNavigation}>
          <IconButton
            title={t("zurück")}
            disabled={currentPhotoIndex === 0}
            onClick={onDecrement}
          >
            <ChevronLeft />
          </IconButton>
          <Typography>
            {currentPhotoIndex + 1} {t("von")} {photos.length}
          </Typography>
          <IconButton
            title={t("weiter")}
            disabled={currentPhotoIndex === photos.length - 1}
            onClick={onIncrement}
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
  currentPhotoIndex: PropTypes.number,
  onImageClick: PropTypes.func,
  onIncrement: PropTypes.func,
  onDecrement: PropTypes.func,
  altText: PropTypes.string,
};

PhotoCarusel.defaultProps = {
  photos: [],
  currentPhotoIndex: 0,
  onImageClick: null,
  onIncrement: null,
  onDecrement: null,
  altText: "",
};

export default PhotoCarusel;
