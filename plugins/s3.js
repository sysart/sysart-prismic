var _ = require('lodash');
var AWS = require('aws-sdk');
var mime = require('mime-types');
var multimatch = require('multimatch');

module.exports = function (options) {
  var params = options.params;

  var baseParam = {
    Bucket: options.bucket
  };

  var s3 = new AWS.S3({
    region: options.region
  });

  return function (files, metalsmith, done) {
    var promise = _.reduce(files, (promise, file, filename) => {
      return promise.then(() => {
        return new Promise((resolve, reject) => {
          var param = Object.assign(getParam(filename), baseParam, {
            Key: filename,
            Body: file.contents,
            ContentType: mime.lookup(filename)
          });

          s3.putObject(param, (error, result) => {
            if (error) {
              reject(error);
            } else {
              console.log(`uploaded to s3: ${filename}`);
              file.s3 = result;
              resolve();
            }
          });
        });
      });
    }, Promise.resolve());

    promise.then(() => {
      console.log('Upload successful!');
      done();
    }, (error) => {
      console.error(error);
      throw error;
    });
  };

  function getParam(filename) {
    return Object.assign({}, _.find(options.params, (param, pattern) => {
      return multimatch(filename, pattern).length > 0;
    }) || {});
  }
};
