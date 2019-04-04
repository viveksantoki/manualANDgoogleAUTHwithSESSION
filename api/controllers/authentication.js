var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
const {google} = require('googleapis');
//var url = require('url');

var express=require('express');

var ls = require('local-storage');

var request = require('request');


var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.register = function(req, res) {

  // if(!req.body.name || !req.body.email || !req.body.password) {
  //   sendJSONresponse(res, 400, {
  //     "message": "All fields required"
  //   });
  //   return;
  // }
    console.log("calling registration")
    console.log(req.body.email);
  User.findOne({email:req.body.email}).then((currentUser) => {
    
    
    
    if(currentUser){
        // already have this user
        console.log('user is: ', currentUser);
       // done(null, currentUser);
        
        
    } else {
        // if not, create user in our db
      
        var user = new User();
      
        user.name = req.body.name;
        user.email = req.body.email;
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
        
    }
});
  // console.log(req.body.email)
  // var user = new User();

  // user.name = req.body.name;
  // user.email = req.body.email;
  // user.game = null;
  // user.phoneNumber =null;

  // user.setPassword(req.body.password);

  // user.save(function(err) {
  //   var token;
  //   token = user.generateJwt();
  //   res.status(200);
  //   res.json({
  //     "token" : token
  //   });
  // });
  
};

module.exports.login = function(req, res) {

  // if(!req.body.email || !req.body.password) {
  //   sendJSONresponse(res, 400, {
  //     "message": "All fields required"
  //   });
  //   return;
  // }
  
  passport.authenticate('local', function(err, user, info){
    var token;

    // If Passport throws/catches an error
    if (err) {
      res.status(404).json(err);
      return;
    }

    // If a user is found
    if(user){
      token = user.generateJwt();
      res.status(200);
      res.json({
        "token" : token
      });
    } else {
      // If user is not found
      res.status(401).json(info);
    }
  })(req, res);

};


module.exports.putUserData = function(req,res){
    
    console.log(req.body.email)
    
    var query = {'email':req.body.email}; 
    //User.findOneAndUpdate(req.body.email,{game:req.body.game,phoneNumber:req.body.phonenumber})
    User.findOneAndUpdate(query,{game:req.body.game,phoneNumber:req.body.phonenumber},function(err,data){
      
     if(err)  {console.log(err)
      return res.send(err)} 
      res.send({data:req.body.email});
  });
  

    
  
}
// const config={
//   CLIENT_ID:"499345710096-6r606gu9j7h00dvle2dt1bh40q45helf.apps.googleusercontent.com",
//   CLIENT_SECRET:"AXz5ypxsE8YJVhYiIEyFzbfC",
//   REDIRECT_URL:"http://localhost:3000/api/getuser"}
//   const scopes = [
//     'https://www.googleapis.com/auth/gmail.readonly',
//     ];
// const currentmail = '';
// const oauth2Client = new google.auth.OAuth2(config.CLIENT_ID,config.CLIENT_SECRET,config.REDIRECT_URL);
// const url = oauth2Client.generateAuthUrl({
//   access_type: 'offline',
//   scope: scopes,
//   prompt:"consent"

// }); 
const config={
  CLIENT_ID:"499345710096-6r606gu9j7h00dvle2dt1bh40q45helf.apps.googleusercontent.com",
  CLIENT_SECRET:"AXz5ypxsE8YJVhYiIEyFzbfC",
  REDIRECT_URL:"http://localhost:3000/api/getuser"
}
  const scopes = [
    'https://www.googleapis.com/auth/gmail.readonly',
 ];

const oauth2Client = new google.auth.OAuth2(config.CLIENT_ID,config.CLIENT_SECRET,config.REDIRECT_URL);
const url = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
  prompt:"consent"
});
module.exports.logingoogle = function(req, res,next) { 
  console.log("calling logingoogle")
  res.status(200).send({url:url});
 
};
email= null;
module.exports.getUserEmail = async function(req,result,next){
  console.log("caling getuseremail")
 
      const code=req.query.code;
     
    try{
    const {tokens} = await oauth2Client.getToken(code);
   

    oauth2Client.setCredentials(tokens);
    ls.set('rtoken',tokens);
   // response.redirect('/contact'); 

    oauth2Client.setCredentials(ls.get('rtoken'));
    const  gmail= google.gmail({version:'v1',auth: oauth2Client});
  
    gmail.users.getProfile({
      userId : 'me',
      personFields : 'emailAddress,name'
    },(err,res)=>{
      if(err){}
      console.log(res.data.emailAddress)
     
       this.email = res.data.emailAddress
      
       console.log(this.email)
          console.log("record has been inserted!");
          result.status(200).redirect('http://localhost:4200/fake?mail='+this.email);
           });
      


  
  
  }catch(error){
    console.log(error);
  }
  
  
}