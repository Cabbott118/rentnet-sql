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
  const { brand, type, city } = req.body;
  if (!brand || !type || !city) {
    return res.status(400).json({ msg: 'Please complete all fields' });
  }

  try {
    db.User.findOne({ where: { id: req.user.id } })
      .then((user) => {
        db.Trailer.create({
          brand,
          type,
          city,
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
  db.Trailer.findAll({ include: 'user' }).then((trailer) => {
    res.json(trailer);
  });
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
// @desc   Delete a trailer
// @access Private
router.patch('/:uuid', auth, (req, res) => {
  try {
    db.Trailer.findOne({ where: { uuid: req.params.uuid } }).then((trailer) => {
      if (trailer) {
        // If trailer is found, destructure fields
        let { brand, type, city } = req.body;
        {
          // Check if any fields are sent back undefined
          // if so, reassign them their old value
          brand === undefined ? trailer.dataValues.brand : brand;
          type === undefined ? trailer.dataValues.type : type;
          city === undefined ? trailer.dataValues.city : city;
        }
        db.Trailer.update(
          // Update all fields with new assignments
          // existing fields that came back undefined are now reassigned
          { brand, type, city },
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
