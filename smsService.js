const request = require('request');

const API_KEY = 'A91862b9c45ff3872032bb46332b1be86';
const SENDER = 'HACKAT';

exports.sendSMS = function () {
  const data = {
    method: 'sms',
    message: 'hello',
    to: '8099553855',
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
