// loading necessary modules
var express       = require('express');
var httpModule    = require('http');
var bodyParser    = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

var patientTable = "patients";
// create an express app
var app = express();

var http = httpModule.Server(app);

// Tells app that pictures, etc are located in folder 'assets'
app.use(express.static('assets'));
app.use(bodyParser.urlencoded({extended: true}));
function responder(req, res) {
  // Sending a file to the user's browser
  res.sendFile(__dirname + '/resilienceMain.html');
  console.log('got a request');
};

// Get request to / is given to funtion 'responder'
app.get('/', responder);

app.get('/resilienceMain', (req, res) => {
  res.sendFile(__dirname + '/resilienceMain.html');
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

app.get('/sign_up', (req, res) => {
  res.sendFile(__dirname + '/sign_up.html');
});

app.get('/P_Review', (req, res) => {
  res.sendFile(__dirname + '/P_Review.html');
});

// This will pull from the DB and list the patients
app.get('/patientlist', function(req, res) {
    var patientsUnr = myDB.collection('patients').find({status: "unreviewed"});
    var patientsAcc = myDB.collection('patients').find({status: "accepted"});
    var patientsRej = myDB.collection('patients').find({status: "rejected"});
  patientsUnr.toArray(function (err, patients1) {
    if (err)
    return console.log(err);

    res.render('patientlist.ejs', {list: patients1});
  });
  patientsAcc.toArray(function (err, patients2) {
    if (err)
    return console.log(err);

    res.render('patientlist.ejs', {list1: patients2});
  });
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/sign_up.html');
});

//Respond to POST request for target '/signup'
app.post('/signup', (req, res) => {
  console.log('got Post /signup request');
  console.log(req.body);
  myDB.collection(patientTable).save(req.body, (err, result) => {
    if (err)
    return console.log(err);
    console.log('saved to database');
    res.redirect('/');
  });
});

//Respond to GET request for target '/login'
app.get('/login', (req, res) => {
  //Obtain data from patient list into cursor object
  var cursor = myDB.collection(patients).find();
  //Convert to an array to extract the patient data.
  cursor.toArray(function (err, results) {
    if (err)
    return console.log(err);

    //Render login.ejs
    res.render('patientlist.ejs', {patientTable: results});
  });
});

function portListener() {
  console.log('Listening to localhost' + port);
}

var port = process.env.PORT || 3000;

//Connect to MongoDB (mlab.com)
var myDB;
MongoClient.connect('mongodb://ResGroup:patientsock@ds113630.mlab.com:13630/resiliencedb',
(err, database) => {
  if(err)
    return console.log(err);
  myDB = database;
  http.listen(port, portListener);
});
