const sortOrderSmacss = require("stylelint-config-property-sort-order-smacss/generate");

module.exports = {
  root: true,
  extends: "stylelint-config-recommended",
  plugins: ["stylelint-order", "stylelint-scss"],
  rules: {
    "order/properties-order": [sortOrderSmacss()],
    "no-descending-specificity": null,
    "at-rule-no-unknown": null,
    "scss/at-rule-no-unknown": true,
    "font-family-no-missing-generic-family-keyword": null,
  },
};
