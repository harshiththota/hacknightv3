const request = require('request');
const _ = require('lodash');

const API_KEY = 'A91862b9c45ff3872032bb46332b1be86';
const SENDER = 'HACKAT';
const METHOD = 'sms';

exports.createContent = function (result) {
  let message = '';

  _.forEach(result, (value, key) => {
    message += key;
    message += '  :  ',
    message += value;
    message += '\n';
  });

  return message;
};

exports.sendSMS = function (inputData, result) {
  const data = {
    method: METHOD,
    message: exports.createContent(result),
    to: inputData.phone,
    sender: SENDER,
  };

  const url = `https://alerts.solutionsinfini.com/api/v4/index.php?method=${data.method}&message=${data.message}&sender=${SENDER}&api_key=${API_KEY}&unicode=1&to=${data.to}`;
  return new Promise(function (resolve, reject) {
    return request.get(url, function (err, res, body) {
      if (err) {
        reject(err);
      }
      resolve(body);
    });
  });
};

exports.sendCall = function (inputData) {
  const data = {
    caller: inputData.phone,
  };

  const url = `https://voice.solutionsinfini.com/api/v1/?method=dial.click2call&format=xml&caller=${data.caller}&receiver=ivr:57342&api_key=Ad9b6d364b7d3fa47d382ec64efc043fd`;

  return new Promise(function (resolve, reject) {
    return request.get(url, function (err, res, body) {
      if (err) {
        reject(err);
      }
      resolve(body);
    });
  });
};
