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
};
