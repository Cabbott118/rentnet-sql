const express = require('express');
const app = express();
app.use(express.json());

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/trailers', require('./routes/trailers'));

const { sequelize } = require('./models');

const port = process.env.PORT || 5000;

app.listen(port, async () => {
  console.log(
    // Start green text
    '\x1b[32m%s',
    `Listening on port: ${port}     :: http://localhost:${port}`,
    `\nList of Registered Users    :: http://localhost:${port}/api/users`,
    '\x1b[0m'
    // End green text
  );
  await sequelize.authenticate();
  console.log('Database Connected!');
});

module.exports = app;
