'use strict';
const express = require('express');
const router = express.Router();
const cors = require('cors');
router.use(cors());

const db = require('../models');

const { register } = require('../controllers/userController');

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
router.post('/', register);

module.exports = router;
