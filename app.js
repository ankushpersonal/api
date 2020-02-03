const express = require("express");
const app = express();
const path = require("path");
const logger = require("./middleware/logger");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const PORT = 3000;
const env = require("./app_config/config");
const csv = require("fast-csv");
var multer = require("multer");
var upload = multer({ dest: "uploads/" });
const fs = require("fs");

// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// init middleware
// app.use(logger);

// connect to mongodb
mongoose.connect("mongodb://localhost/test", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  console.log("connected to mongodb");
});

//static page
app.use(express.static(path.join(__dirname, "public")));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  if (req.method.toLowerCase() === "options") {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.post("/login", (req, res) => {
  var token = jwt.sign(req.body, env.jwt.secret_key, {
    algorithm: env.jwt.algorithm,
    expiresIn: env.jwt.expiryTime
  });
  res.json({ result: "success", token: token }).status(200);
});

app.use("/customer", require("./routes/customermodule"));
app.use("/order", require("./routes/ordersmodule"));

app.get("/name", (req, res, next) => {
  res.send("My name is Modulo app");
});

var type = upload.single("file_upload");

var csvSchema = new mongoose.Schema({
  Transaction_date: String,
  Product: String,
  Price: String,
  Payment_Type: String,
  Name: String,
  City: String,
  State: String,
  Country: String
});

var tableName = mongoose.model("tableName", csvSchema);

app.post("/uploadcsv", type, (req, res, next) => {
  console.log(req.file, "upload file req");
  var temp_path = req.file.path;
  var target_path = "uploads/" + req.file.originalname;
  var src = fs.createReadStream(temp_path);
  var dest = fs.createWriteStream(target_path);
  src.pipe(dest);
  src.on("end", function() {
    return res.sendStatus(200);
  });
  src.on("error", function(err) {
    return res.sendStatus(500);
  });
  csv
    .parseFile(req.file.path)
    .on("error", error => console.error(error))
    .on("data", row => {
      saveFile(row);
    })
    .on("end", rowCount => console.log(`Parsed ${rowCount} rows`));
});

var saveFile = function(data) {
  console.log(data, "sss");
  var object = {
    Transaction_date: new Date(data[0]),
    Product: data[1],
    Price: parseInt(data[2]),
    Payment_Type: data[3],
    Name: data[4],
    City: data[5],
    State: data[6],
    Country: data[7]
  };
  var file_data = new tableName(object);
  file_data.save((err, success) => {
    if (err) throw err;
    console.log("saved");
  });
};

// const stream = csv.parse();
// stream
//   .on("error", error => console.error(error))
//   .on("data", row => console.log(row))
//   .on("end", rowCount => console.log(`Parsed ${rowCount} rows`));

// 404 handling
app.use(function(req, res, next) {
  res.status(404).send("Sorry can't find that!");
  next();
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  next(err); // NEXT ERROR HANDLING FUNCTION
});

// app.use(errorHandler);

// function errorHandler(err, req, res, next) {
//   res.status(500);
//   res.render('error', {error: err});
// }

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
