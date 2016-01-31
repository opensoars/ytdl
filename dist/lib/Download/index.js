"use strict";

const util = require('util');
const EventEmitter = require('events').EventEmitter;
const https = require('https');
const fs = require('fs');
const url_lib = require('url');
const querystring = require('querystring');

const ens = require('ens');
const is = require('is');

let Download = class Download {
  constructor(args) {
    this.args = ens.obj(args);
  }
  writeFile(fn, content, silent) {
    if (!silent) console.log('writeFile', fn);
    return new Promise(function (resolve, reject) {
      fs.writeFile(__dirname + '/../../../dump/' + fn, content, function (err) {
        if (err) return reject(err);
        resolve();
      });
    });
  }

  getFmtsFromYtplayerConfig(ytplayer_config) {
    ytplayer_config = ens.obj(ytplayer_config);
    return new Promise(function (resolve, reject) {
      if (!ytplayer_config.args) return reject('!ytplayer_config.args');else if (!is.string(ytplayer_config.args.adaptive_fmts)) return reject('!is.string(ytplayer_config.args.adaptive_fmts)');

      let fmts = [];
      let adaptive_fmts_string = ytplayer_config.args.adaptive_fmts;
      let split_adaptive_fmt_strings = adaptive_fmts_string.split(',');

      split_adaptive_fmt_strings.forEach(function (adaptive_fmt_string) {
        fmts.push(querystring.decode(adaptive_fmt_string));
      });

      resolve(fmts);
    });
  }
  getRankedFmts(fmts) {
    fmts = ens.arr(fmts);
    return new Promise(function (resolve, reject) {
      fmts.sort(function (a, b) {
        let a_i = a.type.indexOf('audio');
        let b_i = b.type.indexOf('audio');
        if (a_i < b_i) return 1;
        if (a_i >= b_i) return -1;
        return 0;
      });
      fmts.sort(function (a, b) {
        let a_i = a.type.indexOf('audio/mp4');
        let b_i = b.type.indexOf('audio/mp4');
        if (a_i < b_i) return 1;
        if (a_i >= b_i) return -1;
        return 0;
      });
      // @TODO sort for best bitrate?
      resolve(fmts);
    });
  }
  getWorkingFmt(fmts, ytplayer_config) {
    return new Promise(function (resolve, reject) {
      let attempt1 = new Download.prototype.WorkingFmtFinder({
        fmts, ytplayer_config, resolve, reject
      });
      attempt1.on('error', function (err) {
        return reject(err);
      });
      attempt1.on('succes', function (working_fmt) {
        return resolve(working_fmt);
      });
      attempt1.start();
    });
  }
  getDecipheredSignatureFromFmt(fmt, ytplayer_config, cb) {
    if (!is.function(cb)) cb('!is.function(cb)');else if (!is.object(fmt)) cb('!is.object(fmt)');else if (!is.object(ytplayer_config)) cb('!is.object(ytplayer_config)');

    https.get('https:' + ytplayer_config.assets.js, function (res) {
      let body = '';
      res.on('data', function (chunk) {
        return body += chunk;
      });
      res.on('end', function () {
        //let r1 = ;
        // @HERE JUST WROTE THE DECIPHER FUNCTION NAME CAPTURE REGEX
        // decipher_function_name
      });
    });

    cb(null, fmt);
  }
};

['start', 'validateArguments', 'getUrlFromArguments', 'validateUrl', 'getSourceFromUrl', 'validateSource', 'getYtPlayerConfigFromSource', 'WorkingFmtFinder'].forEach(function (Download_module) {
  return Download.prototype[Download_module] = require('./lib/' + Download_module);
});

/** Set Download prototype properties */
Download.prototype.regexp = {
  /**
   * Captures the ytplayer object, the pattern used is simple:
   *  <script>.+?ytplayer.config.+?=.+?
   * This matches a script containing a statement which assigns the
   * ytplayer.config property.
   *  (\{.+?\});
   * This matches and captures the object that is getting assigned to the
   * ytplayer its config property. This works because of the fact that the
   * assignment statement is closed by these two characters };
   *  .+?;<\/script>
   * Allow as much character matches as needed till the closing
   * script tag is found
   * Example (everything between the parentheses is capturedO)
   * <script> ... ytplayer.config = ({ ... }); ... ;</script>
   */
  ytplayer_config: /<script>.+?ytplayer.config.+?=.+?(\{.+?\});.+?;<\/script>/,

  /**
   * Example: (the function call expression gets captured, in this case: sr)
   * sig||e.s){var h = e.sig||sr(
   */
  decipher_function_name: /sig\|\|.+?\..+?\)\{var.+?\|\|(.+?)\(/
};

Download.prototype.temp_dir = __dirname + '/../../../temp';

util.inherits(Download, EventEmitter);

module.exports = Download;