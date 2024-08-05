const stylelint = {
  plugins: ["stylelint-scss"],
  extends: ["stylelint-config-standard", "stylelint-config-recommended-scss"],
  rules: {
    "import-notation": "string",
    "scss/at-import-partial-extension": "always",
    "scss/load-partial-extension": null,
    "selector-pseudo-class-no-unknown": [
      true,
      {
        ignorePseudoClasses: ["export"],
      },
    ],
    "property-no-unknown": [
      true,
      {
        ignoreProperties: ["/transitiondelay/"],
      },
    ],
  },
};

module.exports = stylelint;
