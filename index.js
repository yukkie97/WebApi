var express = require('express');
var app = express();
var api = require('./api/api.route');
var port = require('./env.json')['PORT'];
const cors = require('cors');
const mongodb = require('./mongo_db');

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());

app.use('/api', api);

app.listen(port, function () {
  console.log(`Sample app listening on port ${port}!`);
});
