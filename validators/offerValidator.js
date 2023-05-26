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
};
