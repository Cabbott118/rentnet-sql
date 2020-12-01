'use strict';
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const cors = require('cors');
router.use(cors());

const {
  addTrailer,
  getTrailers,
  findTrailerByCity,
  editTrailer,
  deleteTrailer,
} = require('../controllers/trailerController');

// @route  POST api/trailers
// @desc   Create a trailer
// @access Private
router.post('/', auth, addTrailer);

// @route  GET api/trailers
// @desc   Get a list of trailers (inc. the owners)
// @access Public
router.get('/', getTrailers);

// @route  GET api/trailers/location/:city
// @desc   Get trailers in queried city
// @access Public
router.get('/location/:city', findTrailerByCity);

// @route  PATCH api/trailers/:uuid
// @desc   Update a trailer
// @access Private
router.patch('/:uuid', auth, editTrailer);

// @route  DELETE api/trailers/:uuid
// @desc   Delete a trailer
// @access Private
router.delete('/:uuid', auth, deleteTrailer);

module.exports = router;
