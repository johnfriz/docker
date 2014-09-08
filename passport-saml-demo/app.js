var express = require('express')
  , passport = require('passport')
  , ejs = require('ejs')
  , util = require('util')
  , SamlStrategy = require('passport-saml').Strategy
  , fs = require('fs');
  

var users = [
    { id: 1, givenName: 'bob', email: 'bob@example.com' }
  , { id: 2, givenName: 'joe', email: 'joe@example.com' }
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
  //, cert: 'MIICizCCAfQCCQCY8tKaMc0BMjANBgkqhkiG9w0BAQUFADCBiTELMAkGA1UEBhMCTk8xEjAQBgNVBAgTCVRyb25kaGVpbTEQMA4GA1UEChMHVU5JTkVUVDEOMAwGA1UECxMFRmVpZGUxGTAXBgNVBAMTEG9wZW5pZHAuZmVpZGUubm8xKTAnBgkqhkiG9w0BCQEWGmFuZHJlYXMuc29sYmVyZ0B1bmluZXR0Lm5vMB4XDTA4MDUwODA5MjI0OFoXDTM1MDkyMzA5MjI0OFowgYkxCzAJBgNVBAYTAk5PMRIwEAYDVQQIEwlUcm9uZGhlaW0xEDAOBgNVBAoTB1VOSU5FVFQxDjAMBgNVBAsTBUZlaWRlMRkwFwYDVQQDExBvcGVuaWRwLmZlaWRlLm5vMSkwJwYJKoZIhvcNAQkBFhphbmRyZWFzLnNvbGJlcmdAdW5pbmV0dC5ubzCBnzANBgkqhkiG9w0BAQEFAAOBjQAwgYkCgYEAt8jLoqI1VTlxAZ2axiDIThWcAOXdu8KkVUWaN/SooO9O0QQ7KRUjSGKN9JK65AFRDXQkWPAu4HlnO4noYlFSLnYyDxI66LCr71x4lgFJjqLeAvB/GqBqFfIZ3YK/NrhnUqFwZu63nLrZjcUZxNaPjOOSRSDaXpv1kb5k3jOiSGECAwEAATANBgkqhkiG9w0BAQUFAAOBgQBQYj4cAafWaYfjBU2zi1ElwStIaJ5nyp/s/8B8SAPK2T79McMyccP3wSW13LHkmM1jwKe3ACFXBvqGQN0IbcH49hu0FKhYFM/GPDJcIHFBsiyMBXChpye9vBaTNEBCtU3KjjyG0hRT2mAQ9h+bkPmOvlEo/aH0xR68Z9hw4PF13w==',
  //, cert: 'MIIDtTCCAp2gAwIBAgIJAPv1JQgg5J0iMA0GCSqGSIb3DQEBBQUAMEUxCzAJBgNVBAYTAkFVMRMwEQYDVQQIEwpTb21lLVN0YXRlMSEwHwYDVQQKExhJbnRlcm5ldCBXaWRnaXRzIFB0eSBMdGQwHhcNMTQwOTA3MTgwNTAyWhcNMjQwOTA2MTgwNTAyWjBFMQswCQYDVQQGEwJBVTETMBEGA1UECBMKU29tZS1TdGF0ZTEhMB8GA1UEChMYSW50ZXJuZXQgV2lkZ2l0cyBQdHkgTHRkMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA5CRE+hH87stVcaq5xjhSKZ53WTCN31WlwFOtJD2jxcFmEF9Tjc8zyPfqdxnuY8cZEhB6CfCFVZZl1WbfekssqOBPjpWjfHqeLanZ9Qfb0FmmWYCy3LaPT+4oNlEDejHidoGDg8CStPVnRcGC+DUSS5ys5qEcTTkQxZ8QbCH+wYEfV8kfCTqE+HGMc8n1ucY9FTAltYaPIC890Qj/HTTXMHHpYRmNrANKHVsDgFIopckLzpEY2wEdw3kNz8h2sK+Nx3Zo4soy4OWGJGmHOUlYYgUT+iZFg22oqtwpGY6bPIAAYGmNke2qd+gZzWAPu+fr3sy2vMfYYVN8DAZPXErWEwIDAQABo4GnMIGkMB0GA1UdDgQWBBQJiArijQGnDriGxAAI2HXEH+FCATB1BgNVHSMEbjBsgBQJiArijQGnDriGxAAI2HXEH+FCAaFJpEcwRTELMAkGA1UEBhMCQVUxEzARBgNVBAgTClNvbWUtU3RhdGUxITAfBgNVBAoTGEludGVybmV0IFdpZGdpdHMgUHR5IEx0ZIIJAPv1JQgg5J0iMAwGA1UdEwQFMAMBAf8wDQYJKoZIhvcNAQEFBQADggEBAIuGK4Xqo4GkZrSiolis5EmuRxOcYhikrIQyxm7SH8bKgD6ZE2QucW+8tax8npvJMlQzpHPc/tnWmRlqbPvLrJQzxUKNXQwQHai9RrUCL8/jVW3ghZpFw8aMmCMnynwRjtKO0vxMtgadHwtproKWC97E+1UURs+I5MKJUA6++ER8tIjLCXaOQUIr/Fggb13Bv68ZI0nKCDJJPP5eBmT++WUH09St4mRYLZLBxYi2IS9TACCyjJSZgmuRO5nWHvV82nLwGj0uc6kjZyp2L+kDEur/f6/YVOus8nZFypKLrUotwBCRnuvEC704ev9X1tbTBl54ZnxeDhqPLSY/3mWYIeg=='
  //, privateCert: fs.readFileSync('./cert.pem', 'utf-8')*/
  },
  function(profile, done) {
    console.log("Auth with", profile);
    if (!profile.email) {
      return done(new Error("No email found"), null);
    }
    // asynchronous verification, for effect...
    process.nextTick(function () {
      findByEmail(profile.email, function(err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          // "Auto-registration"
          users.push(profile);
          return done(null, profile);
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
  app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'keyboard cat' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(__dirname + '/../../public'));
});


app.get('/', function(req, res){
  res.render('index', { user: req.user });
});

app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
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
    res.redirect('/');
  }
);

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
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
