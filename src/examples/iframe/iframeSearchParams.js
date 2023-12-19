import React from "react";
import topics from "../../config/topics";

const defaultPermalinkParams = [
  {
    name: "topic",
    type: "string",
    comp: "select",
    pathname: true,
    defaultValue: "ch.sbb.netzkarte",
    values: topics.wkp.map((t) => t.key),
    description: () => {
      return <span>Topic to display</span>;
    },
  },
  {
    name: "baselayers",
    type: "string",
    comp: "select",
    defaultValue: "",
    values: [],
    description: () => {
      return (
        <span>
          Base layer to display, values available are depending on the topic
          selected.
        </span>
      );
    },
  },
  {
    name: "layers",
    type: "array<string>",
    comp: "select",
    defaultValue: "",
    values: [],
    description: () => {
      return (
        <span>
          Layers to display, values available are depending on the topic
          selected.
        </span>
      );
    },
  },
  {
    name: "disabled",
    type: "array<string>",
    defaultValue: "",
    comp: "select",
    values: [
      "baseLayerSwitcher",
      "drawMenu",
      "exportMenu",
      "footer",
      "geolocationButton",
      "header",
      "mapControls",
      "menu",
      "overlay",
      "permalink",
      "shareMenu",
      "search",
      "trackerMenu",
    ],
    description: () => {
      return (
        <span>
          <div>UI elements to hide:</div>
          <br />
          <li>baseLayerSwitcher</li>
          <li>drawMenu</li>
          <li>exportMenu</li>
          <li>footer</li>
          <li>geolocationButtonn</li>
          <li>header</li>
          <li>mapControls</li>
          <li>menu</li>
          <li>overlay </li>
          <li>permalink</li>
          <li>shareMenu</li>
          <li>search</li>
          <li>trackerMenu</li>
          <br />
          <div>Functionalities to deactivate:</div>
          <br />
          <li>permalink - deactivates auto update of the window url</li>
        </span>
      );
    },
  },
  {
    name: "lang",
    type: "string",
    comp: "select",
    defaultValue: "de",
    values: ["de", "fr", "it", "en"],
    description: () => {
      return <span>Language of the application.</span>;
    },
    props: { type: "text" },
  },
  {
    name: "x",
    type: "number",
    comp: "input",
    defaultValue: 925472,
    description: () => {
      return (
        // eslint-disable-next-line react/no-unescaped-entities
        <span>x coordinate of the map's center in Mercator projection.</span>
      );
    },
    props: { type: "number" },
  },
  {
    name: "y",
    type: "number",
    comp: "input",
    defaultValue: 5920000,
    description: () => {
      return (
        // eslint-disable-next-line react/no-unescaped-entities
        <span>y coordinate of the map's center in Mercator projection.</span>
      );
    },
    props: { type: "number" },
  },
  {
    name: "z",
    type: "number",
    comp: "input",
    defaultValue: 9,
    description: () => {
      return <span>Zoom level.</span>;
    },
    props: {
      type: "number",
      inputProps: {
        min: 0,
        max: 20,
      },
    },
  },
  {
    name: "embedded",
    type: "boolean",
    comp: "checkbox",
    defaultValue: false,
    description: () => {
      return (
        <span>
          If true, it improves mouse/touch interactions to avoid conflict with
          parent page.
        </span>
      );
    },
    props: {
      type: "checkbox",
    },
  },
];

export default defaultPermalinkParams;
