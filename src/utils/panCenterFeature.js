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
  overlaySide = 'right',
) => {
  const [width, height] = map.getSize();
  const [pixelX, pixelY] = map.getPixelFromCoordinate(coordinate);
  const isUsingOverlay =
    useOverlay || !!layers.find((l) => l.get('useOverlay'));
  const isHiddenByOverlayOnDesktop =
    isUsingOverlay &&
    (overlaySide === 'right'
      ? pixelX >= width - overlayWidthDesktop - redCircleWidth
      : pixelX <= overlayWidthDesktop + redCircleWidth);
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
    let paddingLeft = menuOpen ? menuWidthDesktop : 0;
    // In some iframe topics we render the overlay on the left
    if (isUsingOverlay && overlaySide === 'left') {
      paddingLeft = overlayWidthDesktop;
    }
    padding = [
      0,
      isUsingOverlay && overlaySide === 'right' ? overlayWidthDesktop : 0,
      0,
      paddingLeft,
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
