'use strict';
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');

const cors = require('cors');
router.use(cors());

const db = require('../models');

// @route  GET api/users
// @desc   Display List of Users
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
// @desc   Display One User
// @access Public
router.get('/:uuid', (req, res) => {
  try {
    db.User.findOne({ where: { uuid: req.params.uuid } }).then((user) => {
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
  // Simple form validation on the back-end
  const { first_name, last_name, email, password } = req.body;
  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ msg: 'Please complete all fields' });
  }

  // Check for existing account by email address
  db.User.findOne({ where: { email: email } }).then((user) => {
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
    }).then((newUser) => {
      // Create salt & hash
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          // Hash password
          newUser.password = hash;
          // After hash is complete, save newUser object
          newUser.save().then((user) => {
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
