const User = require("../models/users");
const router = require("express").Router();
const uid = "5e87a4aeec5ce0255c8c4b98";
const mongoose = require("mongoose");

router.get("/id", (req, res) => {
  User.find({ _id: mongoose.Types.ObjectId(uid) })
    .exec((err, docs) => {
      if (err) {
        console.log("error", err);
      }
      return res.status(200).json(docs);
    });
});
router.post("/", (req, res) => {
  console.log(req.body);
  const { email, password, username } = req.body;
  let user = new User({
    email: email,
    password: password,
    username: username,
    favorites: [],
  });
  User.findOne({ email: req.body.email }, function (err, existingUser) {
    if (err) {
      console.log("ERROR", err);
      return res.status(400).json({ errors: { form: err } });
    }
    if (existingUser) {
      console.log("User already exists", existingUser);
      return res.status(400).json({ errors: { form: "Email already in use" } });
    }
    user.save(function (err) {
      if (err) {
        console.log("ERROR", err);
        return res.status(400).json({ errors: { form: err } });
      }
      console.log("SECCESS", "User created successfully");
      res.status(200).json({
        success: true,
      });
    });
  });
});

router.post("/favorite", (req, res) => {
  let id = uid;
  let recipe = req.body;
  console.log(req.body);
  User.findOneAndUpdate(
    { _id: id },
    { $push: { favorites: recipe } },
    { new: true },
    (err, doc) => {
      if (err) {
        console.log("Error", err);
        return res.json({ success: false, err });
      }
      console.log("recipe added to user favorites");
      res.status(200).json({
        success: true,
      });
    }
  );
});
module.exports = router;
