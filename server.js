// loading necessary modules
var express       = require('express');
var httpModule    = require('http');
var bodyParser    = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;

var patientTable = "patients";
// create an express app
var app = express();

var http = httpModule.Server(app);

// Tells app that pictures, etc are located in folder 'assets'
app.use(express.static('assets'));
app.use(bodyParser.urlencoded({extended: true}));
//bypass folders and allow to access files directly in the directory
app.use('/', express.static(__dirname));
function responder(req, res) {
  // Sending a file to the user's browser
  res.sendFile(__dirname + '/resilienceMain.html');
  console.log('got a request');
};

//This is a function to update the status of the Patient Profile
// //function review(choice){
//   if(choice = 'accept'){
//     db.collection.update(
//       {_id: patient._id});
//       {
//         $rename:
//           { 'status' : 'accepted' }
//       }
//     }
//   if(choice = 'reject'){
//     db.collection.update(
//       {_id: patient._id})
//       {
//         $rename:
//           { 'status' : 'rejected'}
//         }
//     }
// };

// Get request to / is given to funtion 'responder'
app.get('/', responder);

app.get('/resilienceMain', (req, res) => {
  res.sendFile(__dirname + '/resilienceMain.html');
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

app.get('adminLogin', (req, res) => {
  res.sendFile(__dirname + '/adminLogin.ejs');
});

app.get('designerLogin', (req, res) => {
  res.sendFile(__dirname + '/designerLogin.ejs');
})

app.get('Review', (req, res) => {
  res.sendFile(__dirname + '/Review.ejs')
});

app.get('/sign_up_designer', (req, res) => {
  res.sendFile(__dirname + '/sign_up_designer.html');
})

app.get('/sign_up', (req, res) => {
  res.sendFile(__dirname + '/sign_up.html');
});

app.get('/sign_up_splash', (req, res) => {
  res.sendFile(__dirname + '/sign_up_splash.html');
});

// Global variables
var unrPat;
var accPat;
var rejPat;
var Pat;
var PatId;

app.post('/Review', (req, res) => {
  Pat = (req.body);
  console.log(Pat);
  //<<<<<<< Updated upstream
  PatId = Pat.id;

  var record = myDB.collection('patients').find(ObjectId(PatId));
  record.toArray(function (err, patientRec) {
    if (err)
    return console.log(err);
    console.log("selected patient");
    console.log(patientRec);
    res.render('Review.ejs', {patient: patientRec[0]});
  });
});

app.post('/approve', (req, res) => {
  myDB.collection('patients').update({_id:ObjectId(PatId)},{$set:{'status':'accepted'}});
  console.log("worked");
});

app.get('/patient_page_post-login', (req, res) => {
  res.sendFile(__dirname + '/patient_page_post-login.html');
})

app.get('/about', (req, res) => {
  res.sendFile(__dirname + '/about.html');
})

app.get('/Resilience.CreatePP', (req, res) => {
  res.sendFile(__dirname + '/Resilience.CreatePP.html');
})

app.get('/patientLogin', (req, res) => {
  res.sendFile(__dirname + '/patientLogin.ejs');
})

// This will get a list usernames and passwords for the designer login
app.get('/designerLogin', function(req, res) {
  var designerLog = myDB.collection('designers').find();
  designerLog.toArray(function (err, designers) {
    if (err)
    return console.log(err);
    console.log(designers);
    res.render('designerLogin.ejs', {list: designers});
  });
});

// This will pull from the DB and list the patients
app.get('/patientlist', function(req, res) {
  var patientsUnr = myDB.collection('patients').find({status: "unreviewed"});
  var patientsAcc = myDB.collection('patients').find({status: "accepted"});
  var patientsRej = myDB.collection('patients').find({status: "rejected"});

  var designersUnr = myDB.collection('designers').find({status: "unreviewed"});
  var designersAcc = myDB.collection('designers').find({status: "accepted"});
  var designersRej = myDB.collection('designers').find({status: "rejected"});

  patientsUnr.toArray(function (err, patients1) {
    if (err)
    return console.log(err);

    // save unreviewed patient list
    unrPat = patients1;

    patientsAcc.toArray(function (err, patients2) {
      if (err)
      return console.log(err);

      acceptedPatients = patients2;

      patientsRej.toArray(function (err, patients3) {
        if (err)
        return console.log(err);

        rejectedPatients = patients3;

        designersUnr.toArray(function (err, designers1) {
          if (err)
          return console.log(err);

          unrDesigners = designers1;

          designersAcc.toArray(function (err, designers2) {
            if (err)
            return console.log(err);

            acceptedDesigners = designers2;

            designersRej.toArray(function (err, designers3) {
              if (err)
              return console.log(err);

              rejectedDesigners = designers3;

              res.render('patientlist.ejs', {list: unrPat, list1: patients2, list2: patients3,
                    list3: unrDesigners, list4: acceptedDesigners, list5: rejectedDesigners});
            });
          });
        });
      });
    });
  });
});

// This will get a list usernames and passwords for the admin login
app.get('/adminLogin', function(req, res) {
  var adminLog = myDB.collection('admin').find();
  adminLog.toArray(function (err, admin) {
    if (err)
    return console.log(err);
    console.log(admin)
    res.render('adminLogin.ejs', {list: admin});
  });
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/sign_up.html');
});

//Respond to POST request for target '/signup'
app.post('/signup', (req, res) => {
  console.log('got Post /signup request');
  console.log(req.body);
  myDB.collection('patients').save(req.body, (err, result) => {
    if (err)
    return console.log(err);
    console.log('saved to database');
    res.redirect('/');
  });
});

app.post('/designersignup', (req, res) => {
  console.log('got Post /designersignup request');
  console.log(req.body);
  myDB.collection('designers').save(req.body, (err, result) => {
    if (err)
    return console.log(err);
    console.log('saved to database');
    res.redirect('/');
  });
});

//authenicates the admin user by getting the user name and password from the req
//and checking the data with the database
app.post('/authAdmin', (req, res) => {
  console.log(req.body);

  var adminLog = myDB.collection('admin').findOne(req.body, function(err, doc){
    if(doc != null){
      res.redirect('/patientlist');
    }
    else{
      res.redirect('/adminlogin');
    }
  });
});

//authenicates the designer user by getting the user name and password from the req
//and checking the data with the database
app.post('/authDesigner', (req, res) => {
  console.log(req.body);

  var designerLog = myDB.collection('designers').findOne(req.body, function(err, doc){
    if(doc != null){
      res.redirect('/patientlist');
    }
    else{
      res.redirect('/designerLogin');
    }
  });
});

//Respond to GET request for target '/login'
app.get('/login', (req, res) => {
  //Obtain data from patient list into cursor object
  var cursor = myDB.collection('patients').find();
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
