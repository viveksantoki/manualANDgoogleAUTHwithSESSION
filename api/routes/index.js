var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var jwt = require('express-jwt');
const {google} = require('googleapis');
var ls = require('local-storage');
var url = require('url');
var User = mongoose.model('User');
var auth = jwt({
  secret: 'MY_SECRET',
  userProperty: 'payload'
});

var ctrlProfile = require('../controllers/profile');
var ctrlAuth = require('../controllers/authentication');

// profile
router.get('/profile', auth, ctrlProfile.profileRead);
//router.get('/auth',crtlProfile.google);
// authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);
router.get('/logingoogle', ctrlAuth.logingoogle)
router.put('/registration',ctrlAuth.putUserData);

router.get('/getuser',ctrlAuth.getUserEmail);
router.delete('/:id',(req,res)=>{
    console.log(req.params.id)
    
    User.findByIdAndRemove(req.params.id,(err,doc)=>{
      if(err){console.log(err)}
      else {console.log("deleted user")}
    })
   res.send({data:"User deleted"});
   

})
//new changes
router.post('/registerviagoogle',(req,res)=>{
  console.log("calling email api")
 // console.log(req.params.email);

 console.log(req.body.email);

//User.findOne({email:req.params.email}).then((currentUser) => {
  
  
  
  // if(currentUser){
  //     // already have this user
  //     console.log('user is: ', currentUser);
  //    // done(null, currentUser);
      
      

      // if not, create user in our db
      // console.log(req.params.email)
      var user = new User();
    
      user.name = "googleUesr";
      user.email = req.params.email;
      user.game = null;
      user.phoneNumber =null;
    
     user.setPassword(req.body.password);
    
      user.save(function(err) {
        var token;
        token = user.generateJwt();
        res.status(200);
        res.json({
          "token" : token
        });
      });
      
  
 //});
 });



module.exports = router;

