'use strict';
const express = require('express');
const router = express.Router();
const cors = require('cors');
router.use(cors());

const {
  register,
  getAllUsers,
  getUserById,
} = require('../controllers/userController');

// @route  GET api/users
// @desc   Display List of Users with their trailers
// @access Public
router.get('/', getAllUsers);

// @route  GET api/users/:uuid
// @desc   Display One User with their trailer(s)
// @access Public
router.get('/:uuid', getUserById);

// @route  POST api/users
// @desc   Register New User
// @access Public
router.post('/', register);

module.exports = router;
