/****** uncomment line 13 or line 16 *******/

var express = require('express');
const ObjectId = require('mongodb').ObjectID;

var { io } = require('../server');

var router = express.Router();


// We use environment variable to store the url (containing username and password):
// heroku config:set MONGOLAB_URI=mongodb://databaseUsername:databasePassword5@ds249503.mlab.com:49503/olives
var mongodbUrl = process.env.MONGOLAB_URI; // 'mongodb://databaseUsername:databasePassword5@ds249503.mlab.com:49503/olives'

// To use mondodb service in localhost:
// var mongodbUrl = 'mongodb://127.0.0.1/';


router.get('/', function(req, res) { //router.get('/getall', function(req, res) {
  var db = {};
  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect(
    mongodbUrl,
    {useNewUrlParser: true},
    function(err, client) {
      db.collection = client.db('olives').collection('suppliers'); //db.collection = client.db('olives').collection('suppliers');
      db.collection.find({}).toArray(function (err, doc) {
          if (err) {
              console.log(err); // LogError ????
          } else {
             //console.log(doc);
            res.json(doc);
          }
      });
    }
  );
});

router.put('/update/:id', function(req, res) {
  var id = req.params.id;  //parseInt(req.params.id);  *** when _id is an integer
  var db = {};
  var {_id, ...updatedSupplier } = req.body;
  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect(
    mongodbUrl,
    {useNewUrlParser: true},
    function(err, client) {
      db.collection = client.db('olives').collection('suppliers');
      db.collection.findOneAndUpdate(
        {_id: ObjectId(id)},
        {$set: {...updatedSupplier}},
        {returnOriginal: false},
        function (err, doc) {
          if (err) {
              console.log(err);
          } else {
             //console.log(doc);
            if (doc['lastErrorObject']['n'] === 1) {
              io.emit('updateSupplier', {
                updatedSupplier: doc['value'],
                type: 'updateSupplier'
              }); //console.log(io)
            }
            res.status(200).json({
              "n": doc["lastErrorObject"]["n"],
              "ok": doc["ok"],
              "updatedExisting": doc["lastErrorObject"]["updatedExisting"]
            });  //res.status(200).json(doc);
          }
        }
      );
    }
  );
});

router.post('/add', function(req, res) {
  var db = {};
  var MongoClient = require('mongodb').MongoClient;

  MongoClient.connect(
    mongodbUrl,
    {useNewUrlParser: true},
    function(err, client) {
      db.collection = client.db('olives').collection('suppliers');
      db.collection.insertOne(req.body, function (err, doc) {
        if (err) {
            console.log(err);
        } else {
           //console.log(doc);
          if (doc['result']['n'] === 1) {
            io.emit('addSupplier', {
              newSupplier: req.body, // new _id is automatically added to req.body..!!!
              _id: doc['ops'][0]['_id'],
              type: 'addSupplier'
            }); //console.log(io)
          }

          res.status(200).json({
            "n": doc["result"]["n"],
            "ok": doc["result"]["ok"],
            "_id": doc["ops"][0]["_id"]
          });
        }
      });  //res.status(200).json(req.body)
    }
  );
});

module.exports = router;