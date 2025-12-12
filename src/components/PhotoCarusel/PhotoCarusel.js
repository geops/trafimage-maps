import React, { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import makeStyles from "@mui/styles/makeStyles";
import { ZoomIn } from "@mui/icons-material";
import useTranslation from "../../utils/useTranslation";
import useHasScreenSize from "../../utils/useHasScreenSize";
import Pagination from "../Pagination";
import Loading from "../Loading";
import { ReactComponent as Loader } from "../../img/loader.svg";

const useStylesPhoto = makeStyles((theme) => ({
  wrapper: {
    ...theme.styles.flexCenter,
    justifyContent: "center",
    maxWidth: "100%",
    width: "100%",
  },
}));

function Photo({ src = "" }) {
  const { t } = useTranslation();
  const classes = useStylesPhoto();
  const [loading, setLoading] = useState(true);
  useEffect(() => setLoading(true), [src]);
  return (
    <div className={classes.wrapper}>
      {loading && (
        <Loading icon={<Loader />} label={`${t("Wird geladen")}...`} />
      )}
      <img
        src={src}
        alt={src}
        onLoad={() => setLoading(false)}
        style={{
          maxWidth: "100%",
          maxHeight: "80vh",
          display: loading ? "none" : "block",
        }}
        data-testid="carousel-photo"
      />
    </div>
  );
}

Photo.propTypes = {
  src: PropTypes.string,
};

const useStyles = makeStyles((theme) => ({
  wrapper: {
    maxWidth: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
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
  photoNavigation: {
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
  },
}));

function PhotoCarusel({
  photos,
  initialPhotoIndex = 0,
  onImageClick = null,
  onIncrement = null,
  onDecrement = null,
}) {
  const { t } = useTranslation();
  const isSmallScreen = useHasScreenSize(["xs", "s"]);
  const [imageHover, setImageHover] = useState(false);
  const classes = useStyles({ imageHover });
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(initialPhotoIndex);
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

  if (!photos || photos?.length === 0) {
    return null;
  }

  return (
    <div className={classes.wrapper}>
      {onImageClick && !isSmallScreen ? (
        // eslint-disable-next-line jsx-a11y/control-has-associated-label
        <button
          className={classes.imageButton}
          onClick={onImageClick}
          type="button"
          onMouseEnter={() => setImageHover(true)}
          onMouseLeave={() => setImageHover(false)}
          data-testid="carousel-photo-button"
          title={t("Foto vergrössern")}
          tabIndex={0}
        >
          <Photo src={photos[currentPhotoIndex]} />
          <div className={classes.imageOverlay}>
            <div className={classes.zoomInIcon}>
              <ZoomIn />
            </div>
          </div>
        </button>
      ) : (
        <Photo src={photos[currentPhotoIndex]} />
      )}
      {photos.length > 1 && (
        <>
          <br />
          <Pagination
            onNext={incrementPhotoIndex}
            onPrevious={decrementPhotoIndex}
            index={currentPhotoIndex}
            count={photos.length}
          />
        </>
      )}
    </div>
  );
}

PhotoCarusel.propTypes = {
  photos: PropTypes.arrayOf(PropTypes.string),
  initialPhotoIndex: PropTypes.number,
  onImageClick: PropTypes.func,
  onIncrement: PropTypes.func,
  onDecrement: PropTypes.func,
};

export default PhotoCarusel;
