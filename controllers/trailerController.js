const db = require('../models');
const { validateTrailer } = require('../utility/validation');
const { editTrailerHelper } = require('../utility/helperFunctions');

exports.addTrailer = (req, res) => {
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
};

exports.getTrailers = (req, res) => {
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
};

exports.findTrailerByCity = (req, res) => {
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
};

exports.editTrailer = (req, res) => {
  try {
    db.Trailer.findOne({ where: { uuid: req.params.uuid } }).then((trailer) => {
      if (trailer) {
        editTrailerHelper(trailer, req);
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
};

exports.deleteTrailer = (req, res) => {
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
};
