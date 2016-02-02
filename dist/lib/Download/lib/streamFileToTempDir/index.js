"use strict";

const https = require('https');
const fs = require('fs');

module.exports = function streamFileToTempDir(args) {
  return new Promise(function (resolve, reject) {
    let full_loc = args.temp_dir + '/' + args.file_name;

    let writeStream = fs.createWriteStream(full_loc).on('error', function (err) {
      return reject('Stream error');
    });

    https.get(args.working_url, function (res) {
      res.pipe(writeStream);
      res.on('end', function () {
        return resolve(full_loc);
      });
    }).on('error', function (err) {
      return reject('https.get error');
    });
  });
};