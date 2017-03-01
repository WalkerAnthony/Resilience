// loading necessary modules
var express = require('express');
var httpModule = require('http');
const MongoClient = require('mongodb').MongoClient;

// create an express app
var app = express();

var http = httpModule.Server(app);

// Tells app that pictures, etc are located in folder 'assets'
app.use(express.static('assets'));

function responder(req, res) {
  // Sending a file to the user's browser
  res.sendFile(__dirname + '/resilienceaMain.html');
  console.log('got a request');
};

// Get request to / is given to funtion 'responder'
app.get('/', responder);

app.get('/resilienceaMain', (req, res) => {
  res.sendfile(__dirname + '/resilienceaMain.html');
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

app.get('/sign_up', (req, res) => {
  res.sendFile(__dirname + '/sign_up.html');
});


//This section was what Pauca had after class on Wednesday.
app.post('/people', (req, res) => {
  console.log('here is the request');
  var collection = myDB.collection('volunteers');

  collection.save(req.body, (err, result) =>{
    if(err)
      return console.log(err);
    res.redirect('/');
  });
});

function portListener() {
  console.log('Listening to localhost' + port);
}

var port = process.env.PORT || 3000;

//Below is stuff that Pauca showed us on Wednesday after class.
var myDB;
MongoClient.connect('mongodb://ResGroup:patientsock@ds113670.mlab.com:13670/resilience-dbase',
(err, database) => {
  if(err)
    return console.log(err);
  myDB = database;
  http.listen(port, portListener);
});
