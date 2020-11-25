'use strict';
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

const cors = require('cors');
router.use(cors());

const db = require('../models');

const { validateLogin } = require('../utility/validation');

// @route  POST api/auth
// @desc   Authenticate (Login) User
// @access Public
router.post('/', (req, res) => {
  const userData = {
    email: req.body.email,
    password: req.body.password,
  };

  const { valid, errors } = validateLogin(userData);
  if (!valid) return res.status(400).json(errors);
  const { email, password } = userData;
  // Check for existing user
  db.User.findOne({ where: { email: email } }).then((user) => {
    if (!user)
      return res
        .status(400)
        .json({ msg: `Account does not exist for ${email}` });

    // Validate password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (!isMatch)
        return res.status(400).json({ msg: 'Invalid email or password' });

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
            msg: 'Successfully logged in',
          });
        }
      );
    });
  });
});

// @route  GET api/auth/user
// @desc   Get User's Data
// @access Private
router.get('/', auth, (req, res) => {
  db.User.findOne({ where: { id: req.user.id } }).then((user) =>
    res.json(user)
  );
});

// @route  PATCH api/auth/:uuid
// @desc   Edit a user
// @access Private
router.patch('/:uuid', auth, (req, res) => {
  try {
    db.User.findOne({ where: { uuid: req.params.uuid } }).then((user) => {
      if (user) {
        // If user is found, destructure fields
        let {
          first_name,
          last_name,
          email,
          address,
          city,
          state,
          zip,
          phone_number,
        } = req.body;
        {
          // Check if any fields are sent back undefined
          // if so, reassign them their old value
          first_name === undefined ? user.dataValues.first_name : first_name;
          last_name === undefined ? user.dataValues.last_name : last_name;
          email === undefined ? user.dataValues.email : email;
          address === undefined ? user.dataValues.address : address;
          city === undefined ? user.dataValues.city : city;
          state === undefined ? user.dataValues.state : state;
          zip === undefined ? user.dataValues.zip : zip;
          phone_number === undefined
            ? user.dataValues.phone_number
            : phone_number;
        }
        db.User.update(
          // Update all fields with new assignments
          // existing fields that came back undefined are now reassigned
          {
            first_name,
            last_name,
            email,
            address,
            city,
            state,
            zip,
            phone_number,
          },
          { where: { uuid: req.params.uuid } }
        );
        res.status(200).json({ msg: 'User successfully updated.' });
      } else {
        res.json({
          msg: 'Sorry, no user found!',
        });
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Oops, something went wrong!' });
  }
});

module.exports = router;
