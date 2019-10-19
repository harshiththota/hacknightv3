// import modules
const express = require('express');
const bodyParser = require('body-parser');
const smsService = require('./smsService.js')
const predictionService = require('./predictionService.js');
const path = require('path');

// create express app
const app = express();

// Set the port
const port = process.env.PORT || 3000;

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json());

app.use(express.static('.'));

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});

// define a simple route
app.post('/getUpdate', (req, res) => {
  const data = req.body;
  return predictionService.predict(data)
    .then((result) => {
      console.log('data info : ', data.infoValue);
      if (data.infoValue === 'sms') {
        console.log('inside sms');
        return smsService.sendSMS(data, result)
          .then(() => {
            res.json({ "message": "Operation executed successfully" });
          });
      }

      return smsService.sendCall(data)
        .then(() => {
          res.json({ "message": "Operation executed successfully" });
        });
    });
});

app.get('/temp', (req, res) => {
  return predictionService.predict()
    .then((result) => {
      console.log('result : ', result);
      res.json({ "message": "Operation executed successfully" });
    });
})

// listen for requests
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});