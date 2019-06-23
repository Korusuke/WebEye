const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secrets = require('../../config/secrets');
const mongoose = require('mongoose');
var keys = require('../../config/keys');

keys = process.env.SECRETORKEY || keys.secretOrKey;
//db connection
var user='synerman';
var password=process.env.PASSWORD || secrets.password;
var mongourl=`mongodb://${user}:${password}@ds261626.mlab.com:61626/webeye-aditya`;
console.log(mongourl);
mongoose.connect(mongourl, {useNewUrlParser: true});

// Load input validation
const validateLoginInput = require('./login_validation');
const validateRegisterInput = require('./register_validation');

// Load User model
const User = require('../../models/User');

// @route POST /register
router.post('/register', (req, res) => {
  // Form validation
    
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: 'Email already exists' });
    }

    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });

    // Hash password before saving in database
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser
          .save()
          .then(user => res.json(user))
          .catch(err => console.log(err));
      });
    });
  });
});

// @route POST /login
router.post('/login', (req, res) => {
  // Form validation

  const { errors, isValid } = validateLoginInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then(user => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ emailnotfound: 'Email not found' });
    }

    // Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          name: user.name
        };

        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926 // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: 'Bearer ' + token
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: 'Password incorrect' });
      }
    });
  });
});

module.exports = router;
