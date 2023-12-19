const getTrafimageFilter = (
  stylelayer,
  filterAttribute = "trafimage.filter",
) => {
  return stylelayer?.metadata && stylelayer.metadata[filterAttribute];
};

export default getTrafimageFilter;
