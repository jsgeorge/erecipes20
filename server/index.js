const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

//Route
const users = require("./routes/users");
const auth = require("./routes/auth");

const app = express();
require("dotenv").config();

//mongo DB
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/react/api/erecipes20"
);

app.use(bodyParser.json());

//Routes middleware
app.use("/users", users);
app.use("/users/id", users);
// app.use("/api/users/auth", users);
app.use("/auth", auth);
app.use("/users/addfavorite", users);
app.use("/users/delfavorite", users);

if (process.env.NODE_ENV === "production") {
  //Exprees will serve up production assets
  // app.use(express.static("client/build"));

  //Express serve up index.html file if it doesn't recognize route
  // const path = require("path");
  // app.get("*", (req, res) => {
  //   res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  // });
  // app.get("*", function (_, res) {
  //   res.sendFile(path.join(__dirname, "../client/build/index.html"), function (
  //     err
  //   ) {
  //     if (err) {
  //       res.status(500).send(err);
  //     }
  //   });
  // });
  app.get("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
  });
}
const port = process.env.PORT || 3002;

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
