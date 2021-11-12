const sortOrderSmacss = require("stylelint-config-property-sort-order-smacss/generate");

module.exports = {
  root: true,
  extends: "stylelint-config-standard",
  plugins: ["stylelint-order", "stylelint-scss"],
  rules: {
    "order/properties-order": [sortOrderSmacss()],
  },
};
