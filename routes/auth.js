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

// @route  POST api/auth
// @desc   Authenticate (Login) User
// @access Public
router.post('/', (req, res) => {
  const { email, password } = req.body;
  // Simple Validation
  if (!email || !password) {
    return res.status(400).json({ msg: 'Please complete all fields' });
  }

  // Check for existing user
  db.User.findOne({ where: { email: email } }).then((user) => {
    if (!user)
      return res
        .status(400)
        .json({ msg: `Account does not exist for ${email}` });

    // Validate password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (!isMatch)
        return res.status(400).json({ msg: 'Incorrect email or password' });

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

module.exports = router;
