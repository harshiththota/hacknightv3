const bufferedSpawn = require('buffered-spawn');
const moment = require('moment');
const _ = require('lodash');

exports.getPredictorData = function (file) {
  var fs = require('fs');
  return new Promise(function(resolve, reject) {
    fs.readFile(file, 'utf8', function (err, contents) {
      resolve(contents);
    });
  });
};

exports.preparePredictions = function () {
  const result = {};

  return exports.getPredictorData('High_list.json')
    .then((highList) => {
      result.highList = JSON.parse(highList);

      return exports.getPredictorData('Low_list.json')
        .then((lowList) => {
          result.lowList = JSON.parse(lowList);

          return result;
        });
    });
};

exports.predict = function (data) {
  return bufferedSpawn('python', ['-W', 'ignore', `${__dirname}/Samsung_electronics_linear.py`], { cwd: '.' })
    .then((result) => {
      if (result.stderr) {
        return Promise.reject(new Error(`Error occured  ${result.stderr}`));
      }

      return exports.preparePredictions()
        .then((result) => {
          const final_result = {};
          const high_list = {};
          _.forEach(result.highList, (value, index) => {
            if (value > data.stockmaxprice) {
              high_list[moment().add(index + 1, 'days').format('DD MM YYYY').toString()] = _.floor(value, 2);
            }
          });

          const low_list = {};
          _.forEach(result.lowList, (value, index) => {
            if (value < data.stockminprice) {
              low_list[moment().add(index + 1, 'days').format('DD MM YYYY').toString()] = _.floor(value, 2);
            }
          });

          final_result.highList = high_list
          final_result.lowList = low_list;

          return final_result;
        });
    });
};