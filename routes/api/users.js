const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

// Load Input Validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

//Load User mode
const User = require("../../models/User");

// @router  GET api/users/test
// @desc    Tests users route
// @access  Public
router.get("/test", (req, res) =>
  res.json({
    msg: "Users Works"
  })
);

// @router  GET api/users/register
// @desc    Register a user
// @access  Public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  // check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({
    email: req.body.email
  })
    .then(user => {
      if (user) {
        errors.email = "Email already exists";
        return res.status(400).json(errors);
      } else {
        const avatar = gravatar.url(req.body.email, {
          s: "200", //Size
          r: "pg", // Rating
          d: "mm" // Default
        });

        // Create an instance of the model to save to db
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          avatar,
          password: req.body.password
        });

        // hash the password before sending to db
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) {
              console.log(err);
            }
            newUser.password = hash; // save encrypt pass to model
            // Save the model to db
            newUser
              .save()
              .then(user => res.json(user))
              .catch(err => console.log(err));
          });
        });
      } // creating user
    })
    .catch(err => console.log(err));
});

// @router  GET api/users/login
// @desc    Login User / Returning JWT Token
// @access  Public
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  // check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  //Find User by email
  User.findOne({
    email
  }).then(user => {
    //Check for user
    console.log(user);
    if (!user) {
      errors.email = "User not found";
      return res.status(404).json(errors);
    }

    //Check Password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // if the passwords match
        // User is Matched
        // Create JWT Payload
        const payload = { id: user.id, name: user.name, avatar: user.avatar };

        //Sign Token
        jwt.sign(
          payload,
          keys.secretKey,
          { expiresIn: 3600 }, // expires 1hr
          (err, token) => {
            res.json({
              sucesss: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        errors.password = "Pass incorrect";
        return res.status(400).json(errors);
      }
    });
  });
});

// @router  GET api/users/current
// @desc    Return current user, depending on the logged in user
// @access  Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);

module.exports = router;
