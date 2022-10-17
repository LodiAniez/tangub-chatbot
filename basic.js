'use strict';

const request = require('request');
const PAGE_ACCESS_TOKEN = 'EAAQJ6TWZBAnwBAM8YcWlCJh8TMJqlrOkTuaafEprXwDe8RX3ByocdvXCbb3cT0ZCIZBwQIO5o2siEfVKllBdP9nmUdPdZBnMYpJa2JnlSx4QqTzeZAKUEvpZCKm9c3Yb0cEvfVK7yoQt2ZC9oOaIEKUYBC3uVVW5MjtwcZAyGLaN09nRlAQ0we4bYTP4unhEb9ZAxtttPC7cU7AZDZD';

// Imports dependencies and set up http server
const
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express().use(bodyParser.json()); // creates express http server

// Sets server port and logs message on success
app.listen(process.env.PORT || 3153, () => console.log('webhook is listening'));

app.post('/webhook', (req, res) => {  
  console.log('POSTING HERE\n')
  let body = req.body;
  
  // Checks this is an event from a page subscription
  if (body.object === 'page') {
    
    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {

      // Gets the message. entry.messaging is an array, but 
      // will only ever contain one message, so we get index 0
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);

      let sender_psid = webhook_event.sender.id;
      console.log("Sender ID:",webhook_event.sender.id)
      //console.log(webhook_event);
      if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message);        
      }
      /* If you have a referral
      
      else if(webhook_event.referral)
      {
        handleReferral(sender_psid, webhook_event.referral);
      } */
      else if (webhook_event.postback) {
      if(webhook_event.postback.referral)
      {
        handleReferral(sender_psid, webhook_event.postback.referral);
        
      }
      else {
        handlePostback(sender_psid, webhook_event.postback);
      }
      }

    });
    // Returns a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});


function handleMessage(sender_psid, received_message) {
  let initial;
  let response;
  // Check if the message contains text
  if (received_message.text) { 
     // Create the payload for a basic text message
     initial = {"attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",
        "elements": [{
          "title": "Thanks for using my code!",
          "subtitle": "Tell me what you thought of my instructions? Your opinion matters to me❤️",
          "image_url": "https://cdn.dribbble.com/users/291221/screenshots/1425333/helper.gif",
        }]}}
  }
    response = { 
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": [{
            "title": "Great",
            "image_url": "https://s2.r29static.com/bin/entry/719/187x280,85/1932853/image.webp",
            "buttons": [
              {
                "type": "postback",
                "title": "Select",
                "payload": "good",
              }
          ]
          },
          {
            "title": "Whateva",
            "image_url": "https://s3.r29static.com/bin/entry/b7c/233x280,85/2057678/image.webp",
            "buttons": [
               {
                 "type": "postback",
                 "title": "Select",
                 "payload": "whatever",
               }
            ]
           },
           {
            "title": "Bad",
            "image_url": "https://s3.r29static.com/bin/entry/a87/187x280,85/1890078/image.webp",
            "buttons": [
               {
                 "type": "postback",
                 "title": "Select",
                 "payload": "bad",
               }
            ]
           },   
         ]
        }
        }
      }
    }
  callSendAPI(sender_psid, initial);  
  // Sends the response message
  //callSendAPI(sender_psid, "Thank you for visiting our restroom on Terminal C near Gate 23 at Newark Airport😊\nThis chat is powered by Aramark.\n\nHow was your experience today?");
  callSendAPI(sender_psid, response);    
}

function handlePostback(sender_psid, received_postback) {
  let response;
  
  // Get the payload for the postback
  let payload = received_postback.payload;

  // Set the response based on the postback payload
  if (payload === 'good') {
    
    response = { "text": "I'm glad!\nThank you for providing us your feedback😊"}
  
  } else if (payload === 'whatever') {
    
    response = { "text": "Ohh!I'll try to improve!\nThank you for providing us your feedback😊" }
   
  } else if (payload == 'bad'){
    
    response = {"text":"Oh, no! I'm sorry.\nThank you for providing us your feedback😊"}
    
  }
  // Send the message to acknowledge the postback
  callSendAPI(sender_psid, response);
}



function callSendAPI(sender_psid, response) {
  // Construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }
  // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('\nMessage sent!')
    } else {
      console.error("Unable to send message:" + err);
    }
  }); 
}


// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {
  console.log("GETting it working!")
  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = "ambotlangjudnimo"
    
  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
    
  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
  
    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      
      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);      
    }
  }
});