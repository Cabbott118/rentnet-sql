'use strict';
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const cors = require('cors');
router.use(cors());

const db = require('../models');

// @route  POST api/trailers
// @desc   Create a trailer
// @access Private
router.post('/', auth, (req, res) => {
  const {
    brand,
    type,
    address,
    city,
    state,
    zip,
    rate,
    max_payload,
    width,
    length,
  } = req.body;
  if (
    !brand ||
    !type ||
    !address ||
    !city ||
    !state ||
    !zip ||
    !rate ||
    !max_payload ||
    !width ||
    !length
  ) {
    return res.status(400).json({ msg: 'Please complete all fields' });
  }

  try {
    db.User.findOne({ where: { id: req.user.id } })
      .then((user) => {
        db.Trailer.create({
          brand,
          type,
          address,
          city,
          state,
          zip,
          rate,
          max_payload,
          width,
          length,
          user_id: user.id,
        });
      })
      .then(() => {
        return res.status(200).json({ msg: 'Trailer added successfully!' });
      });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Oops, something went wrong!' });
  }
});

// @route  GET api/trailers
// @desc   Get a list of trailers (inc. the owners)
// @access Public
router.get('/', (req, res) => {
  try {
    db.Trailer.findAll({ include: 'user' }).then((trailers) => {
      if (trailers.length > 0) {
        res.json(trailers);
      } else {
        res.json({
          msg: 'Sorry, no results to display at this time.',
        });
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Oops, something went wrong!' });
  }
});

// @route  GET api/trailers/:city
// @desc   Get trailers in queried city
// @access Public
router.get('/:city', (req, res) => {
  try {
    db.Trailer.findAll({ where: { city: req.params.city } }).then(
      (trailers) => {
        if (trailers.length > 0) {
          res.json(trailers);
        } else {
          res.json({
            msg: `Sorry, no results to display for ${req.params.city}`,
          });
        }
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Oops, something went wrong!' });
  }
});

// @route  PATCH api/trailers/:uuid
// @desc   Update a trailer
// @access Private
router.patch('/:uuid', auth, (req, res) => {
  try {
    db.Trailer.findOne({ where: { uuid: req.params.uuid } }).then((trailer) => {
      if (trailer) {
        // If trailer is found, destructure fields
        let {
          brand,
          type,
          address,
          city,
          state,
          zip,
          rate,
          max_payload,
          width,
          length,
        } = req.body;
        {
          // Check if any fields are sent back undefined
          // if so, reassign them their old value
          brand === undefined ? trailer.dataValues.brand : brand;
          type === undefined ? trailer.dataValues.type : type;
          address === undefined ? trailer.dataValues.address : address;
          city === undefined ? trailer.dataValues.city : city;
          state === undefined ? trailer.dataValues.state : state;
          zip === undefined ? trailer.dataValues.zip : zip;
          rate === undefined ? trailer.dataValues.rate : rate;
          max_payload === undefined
            ? trailer.dataValues.max_payload
            : max_payload;
          width === undefined ? trailer.dataValues.width : width;
          length === undefined ? trailer.dataValues.length : length;
        }
        db.Trailer.update(
          // Update all fields with new assignments
          // existing fields that came back undefined are now reassigned
          {
            brand,
            type,
            address,
            city,
            state,
            zip,
            rate,
            max_payload,
            width,
            length,
          },
          { where: { uuid: req.params.uuid } }
        );
        res.status(200).json({ msg: 'Trailer successfully updated.' });
      } else {
        res.json({
          msg: 'Sorry, no trailer found!',
        });
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Oops, something went wrong!' });
  }
});

// @route  DELETE api/trailers/:uuid
// @desc   Delete a trailer
// @access Private
router.delete('/:uuid', auth, (req, res) => {
  try {
    db.Trailer.destroy({ where: { uuid: req.params.uuid } }).then((trailer) => {
      if (trailer) {
        res.status(200).json({ msg: 'Trailer successfully deleted.' });
      } else {
        res.json({
          msg: 'Sorry, no trailer found!',
        });
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Oops, something went wrong!' });
  }
});

module.exports = router;
