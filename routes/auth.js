'use strict';
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const cors = require('cors');
router.use(cors());

const {
  login,
  getAuthenticatedUser,
  editUserPhone,
  editAddress,
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
router.patch('/edit-phone/:uuid', auth, editUserPhone);

// @route  PATCH api/auth/edit-address/:uuid
// @desc   Edit a user's address
// @access Private
router.patch('/edit-address/:uuid', auth, editAddress);

module.exports = router;
