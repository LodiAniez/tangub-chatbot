var app = require('express')();
var crypto = require('crypto');
var express = require('express');
var path = require('path');
var https = require('https');//.Server(app);
var fs = require('fs');
var axios = require("axios");
var validator = require('express-validator');
const request = require('request');

const options = {
  key: fs.readFileSync('cert.key'),
  cert: fs.readFileSync('cert.pem'),
};
  
// import controller
var AuthController = require('./controllers/AuthController');

// import Router file
var pageRouter = require('./routers/route');

var FB_ACCESS_TOKEN = 'EAAQJ6TWZBAnwBAMMPauQ4pdx9CZBwUZCRFOxHZAGmhmQBU7C5oDnC8ES8nSlQd0iIyzfQVrOvP8UUlB2TZB57JHjtEE1nlxDT4Uj1FhBzvzgQfusJCXrcwJHzbQZCUsZCJITZAcgqCi0I1wFMKcWwZASUX9ZCt6RFqQArfTUcZCvg7VIdhyloYrx8lAqWEfGAxMtCk96QJ4KSJpggZDZD';
var FB_VERIFY_TOKEN = 'ambotlangjudnimo';
var FB_APP_SECRET = '4f2d2035df9dd79dbc7c649a6f342509';


var session = require('express-session');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var i18n = require("i18n-express");
app.use(bodyParser.json());
//var urlencodeParser = bodyParser.urlencoded({ extended: true });
app.use(bodyParser.urlencoded({extended:true}))


app.use(session({
  key: 'studentotp',
  secret: 'somerandonstuffs',
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 1200000
  }
}));

app.use(session({ resave: false, saveUninitialized: true, secret: 'nodedemo' }));
app.use(flash());
app.use(i18n({
  translationsPath: path.join(__dirname, 'i18n'), // <--- use here. Specify translations files path.
  siteLangs: ["en"],
  textsVarName: 'translation'
}));

app.use('/public', express.static('public'));


// Check Facebook Signature
app.use(bodyParser.json({
  verify: check_fb_signature
}));

  

function setupGetStartedButton(res) {
    var messageData = {
        get_started: {
            payload: "GET_STARTED"
        }
    };
    // Start the request
    request({
            url: "https://graph.facebook.com/v2.6/me/messenger_profile?access_token=" + FB_ACCESS_TOKEN,
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            form: messageData
        },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                // Print out the response body
                //res.send(body);

                var x1 = JSON.parse(JSON.stringify(body));
                console.log(x1);
            } else {
                // TODO: Handle errors
                //res.send(body);
               // console.log(response);
            }
        });
}


function menuButton(res) {
    var messageData = {
        "persistent_menu": [
            {
                "locale": "default",
                "composer_input_disabled": false,
                "call_to_actions": [
                    {
                        "type": "postback",
                        "title": "Forgot Password",
                        "payload": "ForgotPasswd"
                    },
                    {
                        "type": "postback",
                        "title": "Forgot Student ID No",
                        "payload": "ForgotStudIdNo"
                    },
                    {
                        "type": "postback",
                        "title": "Download Prospectus Copy",
                        "payload": "DLProspectus"
                    },
                    {
                        "type": "postback",
                        "title": "Other Inquiry",
                        "payload": "OtherInquiry"
                    }

                ]
            }
        ]
    };

    // Start the request
    request({
            url: "https://graph.facebook.com/v2.6/me/messenger_profile?access_token=" + FB_ACCESS_TOKEN,
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            form: messageData
        },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                // Print out the response body
                //  response.send(body);
               // res.send(body);
                var x1 = JSON.parse(JSON.stringify(body));
                console.log(x1);
            } else {
                // TODO: Handle errors
                // response.send(body);
                //console.log(response);
               // res.send(body);
            }
        });

}
setTimeout(setupGetStartedButton, 1500);
setTimeout(menuButton, 1500);

function check_fb_signature(req, res, buf) {
  console.log('Check facebook signature step.')
  var fb_signature = req.headers["x-hub-signature"];
  if (!fb_signature) {
    throw new Error('Signature ver failed.');
  } else {
    var sign_splits = fb_signature.split('=');
    var method = sign_splits[0];
    var sign_hash = sign_splits[1];

    var real_hash = crypto.createHmac('sha1', FB_APP_SECRET)
        .update(buf)
        .digest('hex');

    if (sign_hash != real_hash) {
      throw new Error('Signature ver failed.');
    }
  }
}

app.get('/layouts/', function (req, res) {
  res.render('view');
});

// apply controller
AuthController(app);

//For set layouts of html view
var expressLayouts = require('express-ejs-layouts');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);

// Define All Route 
pageRouter(app);

app.get('/', function (req, res) {
  res.redirect('/');
});



const sslserver =https.createServer(options,app)
  
sslserver.listen(3153, function () {
  console.log('listening on *:3153');
  

});
