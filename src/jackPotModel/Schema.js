const { model, Schema } = require("mongoose");

const JackPotSchema = new Schema(
  {
    NumberofCorrectScore: {
      type: Number,
      required: true,
    },
    NumberOfWinnersPerScore: {
      type: Number,
      required: true,
    },

    TotalAmountAcruedFromGame: {
      type: Number,
      required: true,
    },
    AmountsAvailableForJackPot: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

JackPotSchema.post("validate", function (error, doc, next) {
  if (error) {
    error.httpStatusCode = 400;
    next(error);
  } else {
    next();
  }
});

JackPotSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoError" && error.code === 11000) {
    error.httpStatusCode = 400;
    next(error);
  } else {
    next();
  }
});

JackPotSchema.post("validate", function (error, doc, next) {
  if (error) {
    error.httpStatusCode = 400;
    next(error);
  } else {
    next();
  }
});
JackPotSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoError" && error.code === 11000) {
    error.httpStatusCode = 400;
    next(error);
  } else {
    next();
  }
});

JackPotSchema.static("UserAccount", async function (id) {
  const accounts = await AccountModel.find({ _id: id }).populate("users");
  return accounts;
});

const JackPotModel = model("bank_acount", JackPotSchema);

module.exports = JackPotModel;
