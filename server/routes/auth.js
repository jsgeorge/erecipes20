const User = require("../models/users");
const router = require("express").Router();
router.post("/", (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email: email }, (err, user) => {
    if (!user)
      return res.status(401).json({
        errors: { form: "Login failed, email not found" },
      });
    user.comparePassword(password, (err, isMatch) => {
      console.log(err, isMatch);
      if (err)
        return res.status(402).json({
          errors: { form: err },
        });
      if (!isMatch)
        return res.status(403).json({
          errors: { form: "Login failed, Wrong password" },
        });

      // res.status(200).json({
      //   token: tokenForUser(user)
      // });
      //   user.generateToken((err, user) => {
      //     if (err) {
      //       return res.status(404).json({ errors: { form: err } });
      //     }
      //     console.log("Login successfull");
      //     res.status(200).json({
      //       loginSuccess: true,
      //       token: user.token,
      //     });
      // .cookie("w_auth", user.token)
      res.status(200).json({
        loginSuccess: true,
      });
      //});
    });
  });
});

module.exports = router;
