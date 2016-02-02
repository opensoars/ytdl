"use strict";

const https = require('https');
const fs = require('fs');

module.exports = function streamFileToTempDir(args) {
  return new Promise((resolve, reject) => {
    let full_loc = args.temp_dir + '/' + args.file_name;

    let writeStream = fs.createWriteStream(full_loc)
      .on('error', (err) => reject('Stream error'));

    https.get(args.working_url, res => {
      res.pipe(writeStream);
      res.on('end', () => resolve(full_loc));
    }).on('error', (err) => reject('https.get error'));
  });
};