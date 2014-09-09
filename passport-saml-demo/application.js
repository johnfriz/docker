var express = require('express')
  , passport = require('passport')
  , ejs = require('ejs')
  , util = require('util')
  , SamlStrategy = require('passport-saml').Strategy
  , fs = require('fs')
  , parseString = require('xml2js').parseString
  , async = require('async');

var users = [
    { id: 1, givenName: 'bob', email: 'bob@example.com' }
  , { id: 2, givenName: 'joe', email: 'joe@example.com' }
  , { id: 3, givenName: 'John Friz', email: 'john.frizelle@feedhenry.com' }
];

function findByEmail(email, fn) {
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    if (user.email === email) {
      return fn(null, user);
    }
  }
  return fn(null, null);
}


// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser(function(user, done) {
  done(null, user.email);
});

passport.deserializeUser(function(id, done) {
  findByEmail(id, function (err, user) {
    done(err, user);
  });
});

passport.use(new SamlStrategy(
  {
    path: '/login/callback'
  , entryPoint: 'http://saml-idp.jfrizelle.ofoghlu.net/simplesaml/saml2/idp/SSOService.php'
  , issuer: 'passport-saml'
  , protocol: 'http://'
  },
  function(profile, done) {
    console.log("Auth with", profile);
    var email = profile.email || profile['urn:oid:1.2.840.113549.1.9.1'];
    var givenName = profile.givenName || profile['urn:oid:2.5.4.42'];
    if (!email) {
      return done(new Error("No email found"), null);
    }
    // asynchronous verification, for effect...
    process.nextTick(function () {
      findByEmail(email, function(err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          // "Auto-registration
          var user = {
            givenName : givenName,
            email : email,
            profile : profile
          }
          users.push(user);
          return done(null, profile);
        }
        else {
          user.profile = profile;
        }
        return done(null, user);
      })
    });
  }
));

var app = express();

// configure Express
app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.engine('ejs', require('ejs-locals'));
  app.use(express.static(__dirname + '/public'));
  app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'keyboard cat' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
});


app.get('/', function(req, res){
  res.render('index', { user: req.user, page: req.path});
});

app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user, page: req.path});
});

app.get('/login',
  passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }),
  function(req, res) {
    res.redirect('/');
  }
);

app.post('/login/callback',
  passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }),
  function(req, res) {
    console.log('req.user = ', req.user);
    //console.log('res = ', res);
    //console.log('req.body = ', req.body);
    //console.log('res.body = ', res.body);

    var resStr = req.body;
    var resJSON = req.body; //JSON.parse(resStr);
    var SAMLResponseB64 = resJSON.SAMLResponse;

    var buf = new Buffer(SAMLResponseB64, 'base64');

    var SAMLResposeXML = buf.toString();
    var SAMLAttributes = [];

    parseString(SAMLResposeXML, function (err, result) {
      if( result['samlp:Response'] ) {
        var SAMLResposeJSON = result['samlp:Response'];
        if(SAMLResposeJSON['saml:Assertion'] ) {
          var SAMLAssertions = SAMLResposeJSON['saml:Assertion'];
          if( SAMLAssertions.length > 0 ) {
            var SAMLAssertion = SAMLResposeJSON['saml:Assertion'][0];
            if(SAMLAssertion['saml:AttributeStatement'] ) {
              var SAMLAttributeStatements = SAMLAssertion['saml:AttributeStatement'][0]['saml:Attribute'];
              for(var i=0; i<SAMLAttributeStatements.length; i++) {
                var SAMLAttributeStatement = SAMLAttributeStatements[i];
                var SAMLAttributeValue = SAMLAttributeStatement['saml:AttributeValue'];
                SAMLAttributes.push(SAMLAttributeValue[0]['_']);
              }
            }
          }
        }
      }
    });
    req.user.SAMLResposeXML = SAMLResposeXML;
    req.user.SAMLAttributes = SAMLAttributes;
    res.redirect('/');
  }
);

app.get('/logout', function(req, res){
  req.logout();
  req.session.destroy(function(err) {
    res.redirect('/');
  });
});

app.listen(3000, function () {
  console.log("Server listening in http://localhost:3000");
});

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}
