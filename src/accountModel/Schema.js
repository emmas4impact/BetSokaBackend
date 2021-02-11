const { model, Schema } = require("mongoose");

const AccountSchema = new Schema(
  {
    accountName: {
      type: String,
      required: true,
    },
    Bank: {
      type: String,
      required: true,
    },

    accountNumber: {
      type: Number,
      required: true,
    },
   
  },
  {
    timestamps: true,
  }
);

AccountSchema.post("validate", function (error, doc, next) {
  if (error) {
    error.httpStatusCode = 400;
    next(error);
  } else {
    next();
  }
});

AccountSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoError" && error.code === 11000) {
    error.httpStatusCode = 400;
    next(error);
  } else {
    next();
  }
});

AccountSchema.post("validate", function (error, doc, next) {
  if (error) {
    error.httpStatusCode = 400;
    next(error);
  } else {
    next();
  }
});
AccountSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoError" && error.code === 11000) {
    error.httpStatusCode = 400;
    next(error);
  } else {
    next();
  }
});

AccountSchema.static("UserAccount", async function(id){
  const accounts = await AccountModel.find({_id: id}).populate("users");
  return accounts;
})  

const AccountModel = model("bank_acount", AccountSchema);


module.exports = AccountModel;
