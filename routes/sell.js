var express = require('express');
var router = express.Router();
var pg = require('pg').native;
var database =  "postgres://mxoilrnicwhdji:OhBRE_r8LgodxHHZ_ROjGFukd4@ec2-54-163-248-14.compute-1.amazonaws.com:5432/d8dqj27651vg99";
var username = null;
var LocalStorage = require('node-localstorage').LocalStorage,
    localStorage = new LocalStorage('./scratch');
var multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({
  storage: storage,
  dest: './public/images'
});
router.use(upload.single('file'));

/*GET sell page*/
router.post('/',function(req, res) {
  username = localStorage.getItem("username");
  var file = req.body.file;
  console.log(file);
  var LABEL = req.body.label;
  var SIZE = req.body.size;
  var PRICE = req.body.price;
  var DESCRIPTION = req.body.description;
  var SELLERNAME = username;
  var CATEGORY = req.body.category;
  var CONDITION = req.body.condition;
  var GENDER = req.body.genders;
  var client = new pg.Client(database);
  pg.connect(database, function (err, client, done) {
    if (err) {
      return console.error('could not connect to postgres', err);
    }
    console.log('Connected to database');
    var query = ("INSERT INTO Stock (image, label, size, price, description, sellername, category, condition, gender) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)");
    client.query(query, [file, LABEL, SIZE, PRICE, DESCRIPTION, SELLERNAME, CATEGORY, CONDITION, GENDER], function (error, result) {
      console.log(result);
      console.log(error);
      if (error) {
        console.error('Query failed');
        console.error(error);
        return;
      }
      else {
        res.render('profile',{title: 'Profile', username: username});
        return;
      }
    })
  });
});

router.get("/", function(req,res){
  username = localStorage.getItem("username");
  res.render('sell', {title: 'Add A Product', username: username});
});



module.exports = router;