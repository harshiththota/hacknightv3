const bufferedSpawn = require('buffered-spawn');

exports.predict = function (data) {
  return bufferedSpawn('python', [`${__dirname}/Samsung_electronics_linear.py`], { cwd: '.' })
    .then((result) => {
      if (result.stderr) {
        return Promise.reject(new Error(`Error occured  ${result.stderr}`));
      }

      let hashKey = result.stdout;
      hashKey = filterHashKey(hashKey);

      return hashKey;
    });
};