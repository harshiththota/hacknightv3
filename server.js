// import modules
const express = require('express');
const bodyParser = require('body-parser');
const smsService = require('./smsService.js')
const predictionService = require('./predictionService.js');

// create express app
const app = express();

// Set the port
const port = process.env.PORT || 3000;

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// define a simple route
app.post('/getUpdate', (req, res) => {
  const MAX = 100;
  return predictionService.predict()
    .then((result) => {
      console.log('result : ', result);
      if (result >= MAX) {
        return smsService.sendSMS()
          .then(() => {
            res.json({ "message": "Operation executed successfully" });
          })
      }
    });
});

// listen for requests
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});