const panCenterFeature = (
  map,
  layers,
  coordinate,
  menuOpen,
  isMobile,
  useOverlay,
  overlayWidthDesktop = 400,
  overlayHeightMobile = 250,
  menuWidthDesktop = 381,
  redCircleWidth = 25,
  forcePan,
) => {
  const [width, height] = map.getSize();
  const [pixelX, pixelY] = map.getPixelFromCoordinate(coordinate);
  const isUsingOverlay =
    useOverlay || !!layers.find((l) => l.get('useOverlay'));
  const isHiddenByOverlayOnDesktop =
    isUsingOverlay && pixelX >= width - overlayWidthDesktop - redCircleWidth;
  const isHiddenByOverlayOnMobile =
    isUsingOverlay && pixelY >= height - overlayHeightMobile - redCircleWidth;
  const isHiddenByMenuOnDesktop =
    menuOpen && pixelX <= menuWidthDesktop + redCircleWidth;

  let padding = null;

  if (isMobile && (isHiddenByOverlayOnMobile || forcePan)) {
    padding = [0, 0, overlayHeightMobile, 0];
  } else if (
    !isMobile &&
    (isHiddenByOverlayOnDesktop || isHiddenByMenuOnDesktop || forcePan)
  ) {
    padding = [
      0,
      isUsingOverlay ? overlayWidthDesktop : 0,
      0,
      menuOpen ? menuWidthDesktop : 0,
    ];
  }

  if (padding) {
    map.getView().cancelAnimations();
    map.getView().fit([...coordinate, ...coordinate], {
      padding,
      maxZoom: map.getView().getZoom(), // only pan
      duration: 500,
    });
  }
};

export default panCenterFeature;
