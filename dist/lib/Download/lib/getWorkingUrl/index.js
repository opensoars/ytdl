"use strict";

const ens = require('ens');

const WorkingUrlFinder = require('./lib/WorkingUrlFinder');

module.exports = function getWorkingUrl(args) {
  args = ens.obj(args);
  return new Promise(function (resolve, reject) {
    let ranked_fmts = args.ranked_fmts;
    let ytplayer_config = args.ytplayer_config;

    // If attempt1 fails, loop through other fmts!!
    // Listen events and act accordingly
    let attempt1 = new WorkingUrlFinder({
      fmt: ranked_fmts[0],
      ytplayer_config
    });
    attempt1.on('error', function (err) {
      return reject(err);
    });
    attempt1.on('success', function (working_url) {
      return resolve(working_url);
    });
    attempt1.start();
  });
};