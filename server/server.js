require('dotenv').config()

var express = require('express');
var router = require('./routes/routes.js');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();
var mongoose = require('mongoose');

var cookieParser = require('cookie-parser');
var compress = require('compression');



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../client'));
app.use(express.static(path.join(__dirname, '../client')));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: false}));

mongoose.connect(process.env.DB, {useNewUrlParser: true});
// mongoose.connect('mongodb://User:Password@custername-shard-00-00-code.mongodb.net:27017,alpha01-shard-00-01-ptoaf.mongodb.net:27017,alpha01-shard-00-02-ptoaf.mongodb.net:27017/Website?ssl=true&replicaSet=Alpha01-shard-0&authSource=admin', {useNewUrlParser: true});
let db = mongoose.connection;

db.on('open', () => {
  console.log('Connected to the database.');
});

db.on('error', (err) => {
  console.log(`Database error: ${err}`);
});



app.use('/', router);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());

app.use((err, req, res, next) => {
  switch (err.message) {
    case 'NoCodeProvided':
      return res.status(400).send({
        status: 'ERROR',
        error: err.message,
      });
    default:
      return res.status(500).send({
        status: 'ERROR',
        error: err.message,
      });
  }
});

module.exports=app;
