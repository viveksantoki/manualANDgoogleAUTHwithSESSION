/*

  There are some minor modifications to the default Express setup
  Each is commented and marked with [SH] to make them easy to find

 */
const {google} = require('googleapis');

var url = require('url');
var ls = require('local-storage');
var http = require('http');
var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
// [SH] Require Passport
var passport = require('passport');
const router = express.Router();
// [SH] Bring in the data model
require('./api/models/db');
// [SH] Bring in the Passport config after model is defined
require('./api/config/passport');


// [SH] Bring in the routes for the API (delete the default routes)
var routesApi = require('./api/routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

// [SH] Initialise Passport before using the route middleware
app.use(passport.initialize());

// [SH] Use the API routes when path starts with /api
app.use('/api', routesApi);

app.use(cors({origin:true,credentials: true}));

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({"message" : err.name + ": " + err.message});
  }
});


if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}


app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
var originsWhitelist = [
    'http://localhost:4200',      //this is my front-end url for development
     'http://www.myproductionurl.com'
  ];
  var corsOptions = {
    origin: function(origin, callback){
          var isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
          callback(null, isWhitelisted);
    },
    credentials:true
  }
  app.use(cors(corsOptions));
// router.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
//   });   


//   const googleConfig = {
//     clientId: '499345710096-6r606gu9j7h00dvle2dt1bh40q45helf.apps.googleusercontent.com',//ClientId
//     clientSecret: 'AXz5ypxsE8YJVhYiIEyFzbfC', //ClientSeceretKey
//     redirect: 'http://localhost:1212/registrationform'//redirection link
//   };
//   const oauth2Client = new google.auth.OAuth2(
//     '499345710096-6r606gu9j7h00dvle2dt1bh40q45helf.apps.googleusercontent.com',//ClientId
//     'AXz5ypxsE8YJVhYiIEyFzbfC', //ClientSeceretKe'
//     'http://localhost:1212/registrationform' //redirection link
//   );
//  function createConnection() {
//     return new google.auth.OAuth2(
//       googleConfig.clientId,
//       googleConfig.clientSecret,
//       googleConfig.redirect
//     );
//   } 
//  const defaultScope = [
  
//   'https://www.googleapis.com/auth/gmail.readonly',
  
//   ];

//   function getConnectionUrl(auth) {
//     return auth.generateAuthUrl({
//       access_type: 'offline',
//       prompt: 'consent', // access type and approval prompt will force a new refresh token to be made each time signs in
//       scope: defaultScope
//     });
//   }
// function urlGoogle() {
//     console.log("called google url")
//     const auth = createConnection(); // this is from previous step
//     const url = getConnectionUrl(auth);
//     return url;
//   }
  

// app.get('/registrationform',async function(red,response){
  
   

//     var q = url.parse(red.url, true);
//     const {tokens} = await oauth2Client.getToken(q.query.code);
   

//     oauth2Client.setCredentials(tokens);
//     ls.set('rtoken',tokens);
//    // response.redirect('/contact'); 

//     oauth2Client.setCredentials(ls.get('rtoken'));
//     const  gmail= google.gmail({version:'v1',auth: oauth2Client});
  
//     gmail.users.getProfile({
//       userId : 'me',
//       personFields : 'emailAddress,name'
//     },(err,res)=>{
//       if(err)
//       {
//         console.log(err);
//       }
//       else
//       {
//         console.log(res.data.emailAddress); 
//       }
//     });     
// });

// app.get('/auth',function(red,res){
//     res.redirect(urlGoogle());
//  });


// app.listen(3000,(req,res)=>{
//     console.log("listening")
// });
var httpServer = http.createServer(app);
httpServer.listen(3000, () => console.log(`API running on localhost:3000`));

