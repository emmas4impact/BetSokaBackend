const express = require("express");
const listEndpoints = require("express-list-endpoints");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");

const {
    join
} = require("path");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const resultRoute = require("./matchResults/index");
const userRoute = require("./users/index");




const {
    notFoundHandler,
    forbiddenHandler,
    badRequestHandler,
    genericErrorHandler,
    conflictedHandler
} = require("./errorHandlers/index");
const server = express();
const whitelist = ["http://localhost:3000", "http://localhost:3001"]
const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error("Not allowed by CORS"))
        }
    },
    credentials: true,
}

server.use(cors(corsOptions));
server.use(cookieParser());
server.use(helmet());
const staticFolderPath = join(__dirname, "../public");
console.log(staticFolderPath);
server.use(express.static(staticFolderPath));


server.use(passport.initialize());

server.use(express.json());

server.use("/users", userRoute);
server.use('/accounts', require('./accounts/account'))

server.use("/match-results", resultRoute);

server.use(badRequestHandler);
server.use(forbiddenHandler);
server.use(notFoundHandler);
server.use(conflictedHandler);
server.use(genericErrorHandler);

console.log(listEndpoints(server));
mongoose
    .connect(process.env.MONGO_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Mongo Db connected"))
    .catch((err) => console.log(err));

module.exports = server;