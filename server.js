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
function responder(req, res) {
  // Sending a file to the user's browser
  res.sendFile(__dirname + '/resilienceMain.html');
  console.log('got a request');
};

//This is a function to update the status of the Patient Profile
// <<<<<<< Updated upstream
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
// =======

function review(choice){
  if(choice = 'accept'){
    db.collection.update(
      { _id: patient._id},
      {
        $rename:
        { 'status': 'accepted' }
      }
    )
  }
  if(choice = 'reject'){
    db.collection.update(
      { _id: patient._id}
      {
        $rename:
        { 'status': 'rejected'}
      }
    )
  }
};
// >>>>>>> Stashed changes

// Get request to / is given to funtion 'responder'
app.get('/', responder);

app.get('/resilienceMain', (req, res) => {
  res.sendFile(__dirname + '/resilienceMain.html');
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

app.get('/adminlogin', (req, res) => {
  res.sendFile(__dirname + '/adminlogin.ejs')
});

app.get('designerlogin', (req, res) => {
  res.sendFile(__dirname + '/designerlogin.ejs')
})

//app.get('patientlist', (req, res) => {
//  res.sendFile(__dirname + '/patientlist.ejs')
//});

app.get('/sign_up', (req, res) => {
  res.sendFile(__dirname + '/sign_up.html');
});

app.get('/designer_sign_up', (req, res) => {
  res.sendFile(__dirname + '/designer_sign_up.html');
});

app.get('/sign_up_splash', (req, res) => {
  res.sendFile(__dirname + '/sign_up_splash.html');
});

// Global variables
var unrPat;
var accPat;
var rejPat;
var Pat;

app.post('/Review', (req, res) => {
  Pat = (req.body);
  <<<<<<< Updated upstream
  var PatId = Pat.id;
  =======
  var PatNum = Pat.num;
  if (Pat.status == 'unreviewed') {
    var patUnr = myDB.collection('patients').find({__id: Pat.__id});
    console.log(patUnr);
  }
  else {
    console.log("this executed instead");
    //this can be built once we get unreviewed working
    >>>>>>> Stashed changes

    console.log("patient id is " + PatId);

    var record = myDB.collection('patients').find(ObjectId(PatId));
    record.toArray(function (err, patientRec) {
      if (err)
      return console.log(err);

      console.log("selected patient")
      console.log(patientRec);

      res.render('Review.ejs', {patient: patientRec[0]});
    });
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
  app.get('/designerlogin', function(req, res) {
    var designerLog = myDB.collection('designers').find();
    designerLog.toArray(function (err, designers) {
      if (err)
      return console.log(err);
      console.log(designers)
      res.render('designerlogin.ejs', {list: designers});
    });
  });

  // This will pull from the DB and list the patients
  app.get('/patientlist', function(req, res) {
    var patientsUnr = myDB.collection('patients').find({status: "unreviewed"});
    var patientsAcc = myDB.collection('patients').find({status: "accepted"});
    var patientsRej = myDB.collection('patients').find({status: "rejected"});
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
          res.render('patientlist.ejs', {list: unrPat, list1: patients2, list2: patients3});
        });
      });
    });
  });

  // This will get a list usernames and passwords for the admin login
  app.get('/adminlogin', function(req, res) {
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

  app.post('/P_Review', (req, res) => {

  })

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
        res.redirect('/designerlogin');
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
