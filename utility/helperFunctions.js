const db = require('../models');

const updateValues = (newValue, oldValue) => {
  return newValue !== oldValue;
};

exports.editTrailerHelper = (trailer, req) => {
  let newObj = {};

  if (updateValues(req.body.brand, trailer.dataValues.brand))
    newObj.brand = req.body.brand;

  if (updateValues(req.body.type, trailer.dataValues.type))
    newObj.type = req.body.type;

  if (updateValues(req.body.address, trailer.dataValues.address))
    newObj.address = req.body.address;

  if (updateValues(req.body.city, trailer.dataValues.city))
    newObj.city = req.body.city;

  if (updateValues(req.body.state, trailer.dataValues.state))
    newObj.state = req.body.state;

  if (updateValues(req.body.zip, trailer.dataValues.zip))
    newObj.zip = req.body.zip;

  if (updateValues(req.body.rate, trailer.dataValues.rate))
    newObj.rate = req.body.rate;

  if (updateValues(req.body.max_payload, trailer.dataValues.max_payload))
    newObj.max_payload = req.body.max_payload;

  if (updateValues(req.body.width, trailer.dataValues.width))
    newObj.width = req.body.width;

  if (updateValues(req.body.length, trailer.dataValues.length))
    newObj.length = req.body.length;

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
  } = newObj;

  db.Trailer.update(
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
};

exports.editUserAddress = (user, req) => {
  let newObj = {};

  if (updateValues(req.body.address, user.dataValues.address))
    newObj.address = req.body.address;

  if (updateValues(req.body.city, user.dataValues.city))
    newObj.city = req.body.city;

  if (updateValues(req.body.state, user.dataValues.state))
    newObj.state = req.body.state;

  if (updateValues(req.body.zip, user.dataValues.zip))
    newObj.zip = req.body.zip;

  const { address, city, state, zip } = newObj;

  db.User.update(
    {
      address,
      city,
      state,
      zip,
    },
    { where: { uuid: req.params.uuid } }
  );
};
