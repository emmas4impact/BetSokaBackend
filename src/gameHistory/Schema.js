const { model, Schema } = require("mongoose");

const GameHistorySchema = new Schema(
  {
    datePlayed: {
      type: Date,
      required: true,
    },
    dateResolved: {
      type: Date,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },
    fixtureAndResults: [
      {
        fixtureId: {
          type: Number,
          required: true,
        },
        homeTeam: {
          type: String,
          required: true,
        },
        awayTeam: {
          type: String,
          required: true,
        },
        score: {
          type: String,
          required: true,
        },
        homeSelection: {
          type: Boolean,
          required: true,
        },
        drawSelection: {
          type: Boolean,
          required: true,
        },
        awaySelection: {
          type: Boolean,
          required: true,
        },
      },
    ],
    correctRows: {
      type: Number,
      required: true,
    },
    amountWon: {
      type: Number,
      required: true,
    },
    gameId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

GameHistorySchema.post("validate", function (error, doc, next) {
  if (error) {
    error.httpStatusCode = 400;
    next(error);
  } else {
    next();
  }
});

GameHistorySchema.post("save", function (error, doc, next) {
  if (error.name === "MongoError" && error.code === 11000) {
    error.httpStatusCode = 400;
    next(error);
  } else {
    next();
  }
});

GameHistorySchema.post("validate", function (error, doc, next) {
  if (error) {
    error.httpStatusCode = 400;
    next(error);
  } else {
    next();
  }
});
GameHistorySchema.post("save", function (error, doc, next) {
  if (error.name === "MongoError" && error.code === 11000) {
    error.httpStatusCode = 400;
    next(error);
  } else {
    next();
  }
});

const GameHistorytModel = model("game", GameHistorySchema);

module.exports = GameHistorytModel;
