const User = require("../models/users");
const router = require("express").Router();
const mongoose = require("mongoose");

router.post("/id", (req, res) => {
  const uid = req.body.id; //"5e87a4aeec5ce0255c8c4b98";
  if (uid) {
    User.findOne({ _id: mongoose.Types.ObjectId(uid) }).exec((err, user) => {
      if (err) {
        console.log("error", err);
      }
      if (!user) {
        console.log("error", "no user found");
      }
      let currentUser = {
        _id: user._id,
        email: user.email,
        username: user.username,
        favorites: user.favorites,
      };
      res.status(200).json({ user: currentUser });
    });
  } else {
    return res.status(301).json({ errors: { form: "zUser is undefined" } });
  }
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

router.post("/addfavorite", (req, res) => {
 let recipe = {
    id: req.body.id,
    label: req.body.label,
    source: req.body.source,
    imgURL: req.body.imgURL,
  };
  
  User.findOneAndUpdate(
    { _id: req.body.uid },
    { $push: { favorites: recipe } },
    { new: true },
    (err, doc) => {
      if (err) {
        console.log("Error", err);
        return res.json({ success: false, err });
      }
      res.status(200).json({
        success: true,
      });
    }
  );
});
router.post("/delfavorite", (req, res) => {
  const { uid, id } = req.body;
  User.findOneAndUpdate(
    { _id: uid },
    { $pull: { favorites: { id: id } } },
    { multi: true },
    (err, doc) => {
      if (err) {
        console.log("Error", err);
        return res.json({ success: false, err });
      }
      res.status(200).json({
        success: true,
      });
    }
  );
});
module.exports = router;
