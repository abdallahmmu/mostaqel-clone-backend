export const projectSchema = {
  title: {
    notEmpty: true,
    optional: false,
    isLength: { options: { min: 10, max: 100 } },
    errorMessage: "invalid title Validation",
  },

  description: {
    notEmpty: true,
    optional: false,
    isLength: { options: { min: 10, max: 100 } },
    errorMessage: "invalid Description Validation",
  },
  range: {
    isNumeric: true,
    optional: false,
    isLength: { options: { min: 0, max: 1000000 } },
    errorMessage: "invalid Project Price Validation",
  },
  categoryId: {
    optional: false,
    errorMessage: "you must select a Category",
  },
};
