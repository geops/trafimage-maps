import { Typography } from "@mui/material";
import React from "react";

import Search from "../Search";

class Municipalities extends Search {
  constructor() {
    super();
    this.showInPlaceholder = false;
    this.dataProjection = "EPSG:2056";
  }

  // eslint-disable-next-line class-methods-use-this
  search(value) {
    if (this.abortController) {
      this.abortController.abort();
    }
    this.abortController = new AbortController();
    const { signal } = this.abortController;

    return fetch(
      `${this.searchUrl}/search/municipalities?query=${encodeURIComponent(
        value,
      )}&utf8=%E2%9C%93`,
      {
        signal,
      },
    )
      .then((data) => data.json())
      .then((featureCollection) => {
        return featureCollection?.features || [];
      })
      .catch(() => {
        return [];
      });
  }

  render(item) {
    return (
      <div className="wkp-search-suggestion">
        <Typography>{item.properties.name}</Typography>
      </div>
    );
  }

  // eslint-disable-next-line class-methods-use-this
  value(item) {
    return item.properties.name;
  }
}

export default Municipalities;
