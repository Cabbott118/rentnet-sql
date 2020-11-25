'use strict';
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const cors = require('cors');
router.use(cors());

const {
  login,
  getAuthenticatedUser,
  editUser,
} = require('../controllers/authController');

// @route  POST api/auth
// @desc   Authenticate (Login) User
// @access Public
router.post('/', login);

// @route  GET api/auth
// @desc   Get User's Data
// @access Private
router.get('/', auth, getAuthenticatedUser);

// @route  PATCH api/auth/:uuid
// @desc   Edit a user
// @access Private
router.patch('/:uuid', auth, editUser);

module.exports = router;
