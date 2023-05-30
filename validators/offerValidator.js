export const sendOfferSchemaValidator = {
  duration: {
    isNumeric: false,
    notEmpty: true,
    optional: false,
    errorMessage: "Offer should have duration ",
    custom: {
      options: (value) => {
        if (value < 1) {
          throw new Error("Duration Must Be more than zero");
        }
      },
    },
  },
  description: {
    isLength: { options: { min: 10 } },
    notEmpty: true,
    optional: false,
    errorMessage:
      "Description must have at leaset 10 words and should not be empty",
  },
  amount: {
    isNumeric: true,
    notEmpty: true,
    optional: false,
    isInt: { options: { gt: 9 } },
    errorMessage: "Amount Should be Grater Then 9$ and Should be integer",
  },
};
export const updateOfferSchemaValidator = {
  duration: {
    isNumeric: false,
    optional: true,
    errorMessage: "Offer should have duration ",
    custom: {
      options: (value) => {
        if (value < 1) {
          throw new Error("Duration Must Be more than zero");
        }
      },
    },
  },
  description: {
    isLength: { options: { min: 10 } },
    notEmpty: true,
    optional: true,
    errorMessage:
      "Description must have at leaset 10 words and should not be empty",
  },
  amount: {
    isNumeric: true,
    optional: true,
    isInt: { options: { gt: 9 } },
    errorMessage: "Amount Should be Grater Then 9$ and Should be integer",
  },
};
