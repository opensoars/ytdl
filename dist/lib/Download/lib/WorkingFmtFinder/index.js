"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const util = require('util');
const EventEmitter = require('events').EventEmitter;
const https = require('https');

const is = require('is');

const WorkingFmtFinder = class WorkingFmtFinder {
  constructor(args) {
    this.args = args;
  }
  validateArguments(args) {
    return new Promise(function (resolve, reject) {
      if (!is.object(args)) reject('!is.object(args)');else if (!is.object(args.fmt)) reject('!is.object(args.fmt)');else if (!is.object(args.ytplayer_config)) reject('!is.object(args.ytplayer_config)');else if (!is.function(args.resolve)) reject('!is.function(args.resolve)');else if (!is.function(args.reject)) reject('!is.function(args.reject)');else resolve(args);
    });
  }
  validateFmt(fmt) {
    return new Promise(function (resolve, reject) {
      if (!is.string(fmt.s) && !is.string(fmt.sig) && !is.string(fmt.url)) reject('No fmt.s || fmt.sig || fmt.url strings present');else resolve(fmt);
    });
  }
  fmtHasSignature(fmt) {
    return is.string(fmt.s) || is.string(fmt.sig);
  }
  decipherSignature() {}
  testUrl(url) {
    return new Promise(function (resolve, reject) {
      let test_url = url + '&ratebypass=yes&range=0-1';

      https.get(test_url, function (res) {
        res.on('data', function () {
          console.log('keke');
        });
        res.on('end', function () {
          console.log(res.headers);
          parseInt(res.headers['content-length']) === 2 ? resolve(url) : reject("res.headers['content-length']) === 2 not passed");
        });
      }).on('error', function (err) {
        return reject(err);
      });
    });
  }
};

WorkingFmtFinder.prototype.start = function () {
  var ref = _asyncToGenerator(function* () {
    try {
      let args = yield this.validateArguments(this.args);
      let fmt = yield this.validateFmt(args.fmt);

      // SignatureDecipherer

      if (this.fmtHasSignature(fmt)) {
        let signature_decipherer = new this.SignatureDecipherer({}).on('succes', function () {}).on('error', function () {});
      }
      // Gotta do it with this.decipherSignature

      let t1 = yield this.testUrl(fmt.url);
      console.log(t1);
      args.resolve(fmt);

      //args.resolve(args.fmt[0]);
    } catch (err) {
      this.emit('error', err);
    }
  });

  return function start() {
    return ref.apply(this, arguments);
  };
}();

['SignatureDecipherer'].forEach(function (module) {
  return WorkingFmtFinder.prototype[module] = require('./lib/' + module);
});

util.inherits(WorkingFmtFinder, EventEmitter);

module.exports = WorkingFmtFinder;