export const projectSchema = {
  title: {
    notEmpty: true,
    optional: false,
    required: true,
    isLength: { options: { min: 10, max: 100 } },
    errorMessage: "invalid title Validation",
  },

  description: {
    notEmpty: true,
    optional: false,
    max: 100,
    isLength: { options: { min: 10, max: 100 } },
    required: true,
    errorMessage: "invalid Description Validation",
  },
  range: {
    isNumeric: true,
    required: true,
    isLength: { options: { min: 0, max: 1000000 } },
    errorMessage: "invalid Project Price Validation",
  },
  categoryId: {
    required: true,
    errorMessage: "you must select a Category",
  },
};
