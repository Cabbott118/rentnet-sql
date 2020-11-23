// Connection to AWS-RentNet
let mysql = require('mysql');

let connection = mysql.createConnection({
  host: 'rentnet-db.czox1pg6eibm.us-east-2.rds.amazonaws.com',
  user: 'admin',
  password: 'mu045650',
  port: 3306,
});

connection.connect(function (err) {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to database.');
});

module.exports = connection;
