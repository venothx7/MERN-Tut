const express = require("express");
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//Load User mode
const User = require('../../models/User');

// @router  GET api/users/test
// @desc    Tests users route
// @access  Public
router.get("/test", (req, res) => res.json({
    msg: "Users Works"
}));

// @router  GET api/users/register
// @desc    Register a user
// @access  Public
router.post("/register", (req, res) => {
    User.findOne({
            email: req.body.email
        }).then(user => {
            if (user) {
                return res.status(400).json({
                    email: 'Email alreay exists'
                });
            } else {
                const avatar = gravatar.url(req.body.email, {
                    s: '200', //Size
                    r: 'pg', // Rating
                    d: 'mm' // Default
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
                        if (err) throw err;
                        newUser.password = hash; // save encrypt pass to model
                        // Save the model to db
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err));
                    })
                })
            }
        })
        .catch(err => console.log(err));
});

// @router  GET api/users/login
// @desc    Login User / Returning JWT Token
// @access  Public
router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    //Find User by email
    User.findOne({
            email
        })
        .then(user => {
            //Check for user
            console.log(user);
            if (!user) {
                return res.status(404).json({
                    email: "User email not found"
                });
            }

            //Check Password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) { // if the passwords match
                        res.json({
                            msg: 'Success'
                        });
                    } else {
                        return res.status(400).json({
                            password: "Password inccorect"
                        });
                    }
                })

        });
});



module.exports = router;