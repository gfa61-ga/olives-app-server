var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser')
var app = express();

app.use(cors());
app.use(bodyParser.json());  //app.use(bodyParser());
/*app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});
*/
app.get('/suppliers', function(req, res) {
    var db = {};
    var MongoClient = require('mongodb').MongoClient;
    MongoClient.connect('mongodb://127.0.0.1', { useNewUrlParser: true }, function(err, client) {
        db.collection = client.db('olives').collection('suppliers');
        db.collection.find({}).toArray(function (err, doc) {
            if (err) {
                console.log(err); // LogError ????
            } else {
               //console.log(doc);
              res.json(doc);
            }
        });
    });
});


app.put('/suppliers/update/:id', function(req, res) {
    var id = req.params.id;  //parseInt(req.params.id);  *** when _id is an integer
    var db = {};
    var MongoClient = require('mongodb').MongoClient;
    MongoClient.connect('mongodb://127.0.0.1', { useNewUrlParser: true }, function(err, client) {
        db.collection = client.db('olives').collection('suppliers');
        db.collection.findOneAndUpdate(
          {_id: id},
          {$set: {...req.body}},
          { returnOriginal: false }, function (err, doc) {
            if (err) {
                console.log(err);
            } else {
               //console.log(doc);
              res.status(200).json({"n": doc["lastErrorObject"]["n"], "updatedExisting": doc["lastErrorObject"]["updatedExisting"], "ok": doc["ok"]} ); //res.status(200).json(doc);
            }
        });
    });
});

app.post('/suppliers/add', function(req, res) {
    var db = {};
    var MongoClient = require('mongodb').MongoClient;
//    res.status(200).json(req.body)

    MongoClient.connect('mongodb://127.0.0.1', { useNewUrlParser: true }, function(err, client) {
        db.collection = client.db('olives').collection('suppliers');
        console.log("Add:", req.body);
        db.collection.insertOne(req.body, function (err, doc) {
            if (err) {
                console.log(err);
            } else {
               //console.log(doc);
              res.status(200).json({"_id": doc["ops"][0]["_id"], "n": doc["result"]["n"], "ok": doc["result"]["ok"]});
            }
        });
    });
});

app.get('/pickups', function(req, res) {
    var db = {};
    var MongoClient = require('mongodb').MongoClient;
    MongoClient.connect('mongodb://127.0.0.1', { useNewUrlParser: true }, function(err, client) {
        db.collection = client.db('olives').collection('pickups');
        db.collection.find({}).toArray(function (err, doc) {
            if (err) {
                console.LogError(err);
            } else {
               //console.log(doc);
              res.status(200).json(doc);
            }
        });
    });
});

/*
app.get(path, callback); // Read item(s)
app.post(...); // Create a new item
app.put(...); // Replace an item
app.patch(...); // Update an item
app.delete(...); // Delete an item
*/

app.listen(3500);

// npm run dev   ** Whenever we make a change in the code and save,
//                * if nodemon is running, it'll restart the Node server with the new code
//               **


// curl -i -X POST -H 'Content-Type: application/json' -d '{_id: 100}' localhost:3500/suppliers/add
/*curl -i -X POST -H "Content-Type:application/json" -d "{\"_id\": 100}"
curl -v -X POST -d 'payload={"text": "Hello, this is some text\nThis is more text. :tada:"}' http://localhost:3500/suppliers/add


*************   This works in windows porwershell:

$person = @{
    _id='123'
    lastName='doe'
  }

$json = $person | ConvertTo-Json

$response = Invoke-RestMethod 'http://localhost:3500/suppliers/add' -Method Post -Body $json -ContentType 'application/json'

$response
  123

$updperson = @{
    _id='123'
    lastName='doe'
    age=65
    city='mes'
    phone=12, 23, 34
  }

$json = $updperson | ConvertTo-Json

$response = Invoke-RestMethod 'http://localhost:3500/suppliers/update/123' -Method Put -Body $json -ContentType 'application/json'

$response
  lastErrorObject              value                                      ok
  ---------------              -----                                      --
  @{n=1; updatedExisting=True} @{_id=123; lastName=doe; age=65; city=mes}  1

*/
