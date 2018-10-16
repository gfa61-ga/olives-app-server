var express = require('express');
var cors = require('cors');
//var bodyParser = require('body-parser')
var app = express();
var suppliers = require('./routes/suppliers');

app.use(cors());

/*
  If you are using valid JSON and are POSTing it with Content-Type: application/json,
  then you can use the bodyParser middleware to parse the request body
  (request body is just an HTTP request of course, not the actual JSON)
  and place the result in request.body of your route.

  Starting with release 4.16.0, a new express.json() middleware is available.
*/

app.use(express.json()); // app.use(bodyParser.json());

app.use('/suppliers',  suppliers); //app.use('/suppliers',  suppliers);


app.get('/pickups', function(req, res) {
  var db = {};
  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect(
    'mongodb://127.0.0.1',
    {useNewUrlParser: true},
    function(err, client) {
      db.collection = client.db('olives').collection('pickups');
      db.collection.find({}).toArray(function (err, doc) {
        if (err) {
            console.log(err);
        } else {
           //console.log(doc);
          res.status(200).json(doc);
        }
      });
    }
  );
});

/*
app.patch(...); // Update an item
app.delete(...); // Delete an item
*/

app.listen(3500);
/*
var http = require('http');

var server = http.createServer(function(req, res) {
  res.writeHead(200);
  res.end('Hello World');
});
server.listen(8080);
*/

/*************   to RUN the server:
// npm run dev   ** Whenever we make a change in the code and save,
//                * if nodemon is running, it'll restart the Node server with the new code
//               **

/*************   This works in windows porwershell:

$response = Invoke-RestMethod 'http://localhost:3500/suppliers/getall' -Method Get

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
