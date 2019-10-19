// import modules
const express = require('express');
const bodyParser = require('body-parser');

// create express app
const app = express();

// Set the port
const port = process.env.PORT || 3000;

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// define a simple route
app.get('/getUpdate', (req, res) => {
  res.json({ "message": "Called route" });
});

// listen for requests
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});