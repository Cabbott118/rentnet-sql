const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const db = require('../models');
const { validateLogin } = require('../utility/validation');
const { editUserAddress } = require('../utility/helperFunctions');

exports.login = (req, res) => {
  const userData = {
    email: req.body.email,
    password: req.body.password,
  };

  const { valid, errors } = validateLogin(userData);
  if (!valid) return res.status(400).json(errors);
  const { email, password } = userData;
  // Check for existing user
  db.User.findOne({ where: { email: email } }).then((user) => {
    if (!user)
      return res
        .status(400)
        .json({ msg: `Account does not exist for ${email}` });

    // Validate password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (!isMatch)
        return res.status(400).json({ msg: 'Invalid email or password' });

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
};

exports.getAuthenticatedUser = (req, res) => {
  db.User.findOne({
    where: { id: req.user.id },
    include: 'trailers',
  }).then((user) => res.json(user));
};

exports.editUserPhone = (req, res) => {
  try {
    db.User.findOne({ where: { uuid: req.params.uuid } }).then((user) => {
      if (user) {
        let { phone_number } = req.body;
        db.User.update(
          {
            phone_number,
          },
          { where: { uuid: req.params.uuid } }
        );
        res.status(200).json({ msg: 'Phone number successfully updated.' });
      } else {
        res.json({
          msg: 'Sorry, no user found!',
        });
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Oops, something went wrong!' });
  }
};

exports.editAddress = (req, res) => {
  try {
    db.User.findOne({ where: { uuid: req.params.uuid } }).then((user) => {
      if (user) {
        editUserAddress(user, req);
        res.status(200).json({ msg: 'Address updated.' });
      } else {
        res.json({
          msg: 'Sorry, no user found!',
        });
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Oops, something went wrong!' });
  }
};
