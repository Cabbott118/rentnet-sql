'use strict';
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');

const cors = require('cors');
router.use(cors());

const db = require('../models');

const { validateRegister } = require('../utility/validation');

// @route  GET api/users
// @desc   Display List of Users with their trailers
// @access Public
router.get('/', (req, res) => {
  try {
    db.User.findAll({ include: 'trailers' }).then((users) => {
      res.json(users);
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Oops, something went wrong!' });
  }
});

// @route  GET api/users/:uuid
// @desc   Display One User with their trailer(s)
// @access Public
router.get('/:uuid', (req, res) => {
  try {
    db.User.findOne({
      where: { uuid: req.params.uuid },
      include: 'trailers',
    }).then((user) => {
      if (user) {
        res.json(user);
      } else {
        res.json({
          msg: 'Sorry, no user found.',
        });
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Oops, something went wrong!' });
  }
});

// @route  POST api/users
// @desc   Register New User
// @access Public
router.post('/', (req, res) => {
  const newUser = {
    first_name: req.body.first_name.trim(),
    last_name: req.body.last_name.trim(),
    email: req.body.email.trim(),
    password: req.body.password,
    confirm_password: req.body.confirm_password,
  };

  const { valid, errors } = validateRegister(newUser);
  if (!valid) return res.status(400).json(errors);
  const { first_name, last_name, email, password } = newUser;
  // Check for existing account by email address
  db.User.findOne({ where: { email } }).then((user) => {
    if (user)
      return res
        .status(400)
        .json({ msg: `Account already exists for ${email}` });
    // Continue if email address is available
    db.User.create({
      first_name,
      last_name,
      email,
      password,
    }).then((newUserData) => {
      // Create salt & hash
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUserData.password, salt, (err, hash) => {
          if (err) throw err;
          // Hash password
          newUserData.password = hash;
          // After hash is complete, save newUserData object
          newUserData.save().then((user) => {
            // Pass in token and assign it to user id
            jwt.sign(
              { id: user.id },
              config.get('jwtSecret'),
              { expiresIn: 3600 },
              (err, token) => {
                if (err) throw err;
                res.json({
                  token,
                  user: {
                    id: user.id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                  },
                });
              }
            );
          });
        });
      });
    });
  });
});

module.exports = router;
