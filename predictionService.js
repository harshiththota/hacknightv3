const bufferedSpawn = require('buffered-spawn');
const moment = require('moment');
const _ = require('lodash');

exports.getPredictorData = function () {
  var fs = require('fs');
  return new Promise(function(resolve, reject) {
    fs.readFile('predict_result.json', 'utf8', function (err, contents) {
      resolve(contents);
    });
  });
};

exports.predict = function (data) {
  return bufferedSpawn('python', [`${__dirname}/Samsung_electronics_linear.py`], { cwd: '.' })
    .then((result) => {
      if (result.stderr) {
        return Promise.reject(new Error(`Error occured  ${result.stderr}`));
      }

      return exports.getPredictorData()
        .then((result) => {
          const final_result = {};
          result = JSON.parse(result);
          _.forEach(result, (value, index) => {
            if (value < data.stockminprice || value > data.stockmxnprice) {
              final_result[moment().add(index + 1, 'days').format('DD MM YYYY').toString()] = _.floor(value, 2);
            }
          });

          return final_result;
        });
    });
};