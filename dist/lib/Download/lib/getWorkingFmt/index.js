"use strict";

const ens = require('ens');

module.exports = function getWorkingFmt(args) {
  args = ens.obj(args);
  return new Promise(function (resolve, reject) {
    let ranked_fmts = args.ranked_fmts;
    let ytplayer_config = args.ytplayer_config;

    let attempt1 = new args.WorkingFmtFinder({
      fmt: ranked_fmts[0],
      ytplayer_config,
      resolve,
      reject
    });
    attempt1.on('error', function (err) {
      return reject(err);
    });
    attempt1.on('succes', function (working_fmt) {
      return resolve(working_fmt);
    });
    attempt1.start();

    /*    ranked_fmts.forEach(fmt => {
    
        });
    */
  });
};