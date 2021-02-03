const {
    model,
    Schema
  } = require("mongoose");

  
  const matchResultSchema = new Schema({
    fixtureId:{
        type: Number,
        required: true,
        unique:true
        
    },
  homeGoals:{
      type: Number,
      required: true
  },
  awayGoals:{
    type: Number,
    required: true
  },
  score:{
      type: String
  },
  homeTeam:{
      type: String,
      required: true
  },
  awayTeam:{
      type: String,
      required: true
  },
  gameDate:{
      type: Date,
      required:true,
      unique: true
      
  }
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