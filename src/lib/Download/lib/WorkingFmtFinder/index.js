"use strict";

const util = require('util');
const EventEmitter = require('events').EventEmitter;
const https = require('https'); 

const ens = require('ens');
const is = require('is');

const WorkingFmtFinder = class WorkingFmtFinder {
  constructor(args) {
    this.args = ens.obj(args);
  }
  validateArguments(args) {
    return new Promise((resolve, reject) => {
      if (!is.object(args))
        reject('!is.object(args)');
      else if (!is.object(args.fmt))
        reject('!is.object(args.fmt)');
      else if (!is.object(args.ytplayer_config))
        reject('!is.object(args.ytplayer_config)');
      else
        resolve(args);
    });
  }
  validateFmt(fmt) {
    return new Promise((resolve, reject) => {
      if (!is.string(fmt.s) && !is.string(fmt.sig) && !is.string(fmt.url))
        reject('No fmt.s || fmt.sig || fmt.url strings present');
      else
        resolve (fmt);
    });
  }
  fmtHasSignature(fmt) {
    return is.string(fmt.s) || is.string(fmt.sig);
  }
  decipherSignature(args) {
    args = ens.obj(args);
    return new Promise((resolve, reject) => {
      new args.SignatureDecipherer({
        ytplayer_config: args.ytplayer_config,
        signature: args.signature
      })
        .on('succes', (deciphered_signature) => resolve(deciphered_signature))
        .on('error', (err) => reject(err))
        .start();
    });
  }
  testUrl(url) {
    return new Promise((resolve, reject) => {
      let test_url = url + '&ratebypass=yes&range=0-1';

      https.get(test_url, res => {
        res.on('data', () => { /*console.log('keke');*/ });
        res.on('end', () => {
          //console.log(res.headers);
          parseInt(res.headers['content-length']) === 2
            ? resolve(url)
            : reject("res.headers['content-length']) === 2 not passed");
        });
      }).on('error', err => reject(err));
    });
  }
};

WorkingFmtFinder.prototype.start = async function start() {
  try {
    let args = await this.validateArguments(this.args);
    let fmt = await this.validateFmt(args.fmt);

    let test_url;
    if (this.fmtHasSignature(fmt)) {
      let deciphered_signature = await this.decipherSignature({
        SignatureDecipherer: this.SignatureDecipherer,
        ytplayer_config: args.ytplayer_config,
        signature: fmt.s || fmt.sig
      });
      test_url = fmt.url + '&signature=' + deciphered_signature
    }
    else if (fmt.url)
      test_url = fmt.url;
    else
      throw 'No fmt.s || fmt.sig && no fmt.url';

    let working_url = await this.testUrl(test_url);
    fmt.working_url = working_url;

    this.emit('succes', fmt);
  }
  catch (err) {
    this.emit('error', err);
  }
};

[
  'SignatureDecipherer'
].forEach(module => 
  WorkingFmtFinder.prototype[module] = require('./lib/' + module)
);

util.inherits(WorkingFmtFinder, EventEmitter);

module.exports = WorkingFmtFinder;