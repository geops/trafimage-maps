const getTrafimageFilter = (stylelayer) => {
  return stylelayer?.metadata && stylelayer.metadata['trafimage.filter'];
};

export default getTrafimageFilter;
