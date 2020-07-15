const mongoose = require('mongoose');
var DBCONFIG = require('./env.json')['DBCONFIG'];

var url = `mongodb://${DBCONFIG.user}:${DBCONFIG.password}@${DBCONFIG.host}:${DBCONFIG.port}/${DBCONFIG.database}`;

console.log(url);

mongoose.connect(url, async function(err, db) {
  if (err) throw err;
  console.log('MongoDB connected succesfully');
  db.close();
});