const {
    model,
    Schema
  } = require("mongoose");

  
  const matchResultSchema = new Schema({
    gameDate: {
      type: Date,
      required: true
    },
    resultDetails: [{
        fixturesID: {
            type: Array,
        },
        results:{
            type: String
        },
        
    }],

},
  
    {
      timestamps: true
    }
  );
  
  matchResultSchema.post("validate", function (error, doc, next) {
    if (error) {
      error.httpStatusCode = 400;
      next(error);
    } else {
      next();
    }
  });
  
  matchResultSchema.post("save", function (error, doc, next) {
    if (error.name === "MongoError" && error.code === 11000) {
      error.httpStatusCode = 400;
      next(error);
    } else {
      next();
    }
  });
  

  matchResultSchema.post("validate", function (error, doc, next) {
    if (error) {
      error.httpStatusCode = 400
      next(error)
    } else {
      next()
    }
  })
  matchResultSchema.post("save", function (error, doc, next) {
    if (error.name === "MongoError" && error.code === 11000) {
      error.httpStatusCode = 400
      next(error)
    } else {
      next()
    }
  })
  const ResultModel = model("match_result", matchResultSchema);
  
  module.exports = ResultModel;