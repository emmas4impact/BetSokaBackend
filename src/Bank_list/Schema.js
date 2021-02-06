const { model, Schema } = require("mongoose");

const BankSchema = new Schema(
  {
    bankName: {
      type: String,
      required: true,
    },

    bankCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

BankSchema.post("validate", function (error, doc, next) {
  if (error) {
    error.httpStatusCode = 400;
    next(error);
  } else {
    next();
  }
});

BankSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoError" && error.code === 11000) {
    error.httpStatusCode = 400;
    next(error);
  } else {
    next();
  }
});

BankSchema.post("validate", function (error, doc, next) {
  if (error) {
    error.httpStatusCode = 400;
    next(error);
  } else {
    next();
  }
});
BankSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoError" && error.code === 11000) {
    error.httpStatusCode = 400;
    next(error);
  } else {
    next();
  }
});
const BankModel = model("bank_list", BankSchema);

module.exports = BankModel;
