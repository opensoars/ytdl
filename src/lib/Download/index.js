"use strict";

const util = require('util');
const https = require('https');
const fs = require('fs');
const url_lib = require('url');
const querystring = require('querystring');
const EventEmitter = require('events').EventEmitter;
const ens = require('ens');
const is = require('is');



let Download = class Download {
  constructor(args) {
    this.args = ens.obj(args);
  }
  writeFile(fn, content, silent) {
    if (!silent) console.log('writeFile', fn);
    return new Promise((resolve, reject) => {
      fs.writeFile(__dirname + '/../../../dump/' + fn, content, err => {
        if (err) return reject(err);
        resolve();
      });
    });
  }
  getDecipheredSignatureFromFmt(fmt, ytplayer_config, cb) {
    if (!is.function(cb))
      cb('!is.function(cb)');
    else if (!is.object(fmt))
      cb('!is.object(fmt)');
    else if (!is.object(ytplayer_config))
      cb('!is.object(ytplayer_config)');

    https.get('https:' + ytplayer_config.assets.js, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        //let r1 = ;
        // @HERE JUST WROTE THE DECIPHER FUNCTION NAME CAPTURE REGEX
        // decipher_function_name
      });
    });

    cb(null, fmt)
  }
};


[
  'start',
  'validateArguments',
  'getUrlFromArguments',
  'validateUrl',
  'getSourceFromUrl',
  'validateSource',
  'getYtPlayerConfigFromSource',
  'getFmtsFromYtplayerConfig',
  'getRankedFmts',
  'getWorkingFmt',

  'WorkingFmtFinder'
].forEach(module => 
  Download.prototype[module] = require('./lib/' + module)
);

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