var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

//KNEX MYSQL HANDLER
var knex = require("knex")({
  client: "mysql2",
  connection: {
    host: "localhost",
    port: "3306",
    user: "root",
    password: "M1nty_beats1",
    database: "volcanoes",
  },
});

var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};

var countriesRouter = require("./routes/countries");
var volcanoesRouter = require("./routes/volcanoes");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/user");
var meRouter = require("./routes/me");
var volcanoRouter = require("./routes/volcano");

var app = express();

app.options("*", cors(corsOptions));
app.use(cors(corsOptions));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use((req, res, next) => {
  req.db = knex;
  next();
});

app.use("/", indexRouter);
app.use("/user", usersRouter);
app.use("/countries", countriesRouter);
app.use("/volcanoes", volcanoesRouter);
app.use("/me", meRouter);
app.use("/volcano", volcanoRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
