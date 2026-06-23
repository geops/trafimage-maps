import { MapsTrafimageFilter } from "./constants";

const getTrafimageFilter = (
  stylelayer,
  filterAttribute = MapsTrafimageFilter,
) => {
  return stylelayer?.metadata && stylelayer.metadata[filterAttribute];
};

export default getTrafimageFilter;
