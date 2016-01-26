"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const util = require('util');
const EventEmitter = require('events').EventEmitter;
const https = require('https');

const ens = require('ens');

let Download = class Download {
  constructor(a) {
    this.a = ens.obj(a);
  }
  validateArguments(a) {
    return new Promise(function (resolve, reject) {
      if (!a) reject('!a');else if (!a.v && !a.url) reject('!a.v && !a.url');else if (typeof a.v !== 'string' && typeof a.url !== 'string') reject("typeof a.v !== 'string' && typeof a.url !== 'string'");else resolve(a);
    });
  }
  makeUrl(a) {
    return new Promise(function (resolve, reject) {
      if (a.url && typeof a.url === 'string') resolve(a.url);else if (a.v && typeof a.v === 'string') resolve('https://www.youtube.com/watch?v=' + a.v);else reject('!a.url && !a.v');
    });
  }
  getSource(url) {
    return new Promise(function (resolve, reject) {
      https.get(url, function (res) {
        let src = '';
        res.on('data', function (chunk) {
          return src += chunk;
        });
        res.on('end', function () {
          return resolve(src);
        });
        res.on('error', function (err) {
          return reject(err);
        });
      });
    });
  }
};

Download.prototype.start = function () {
  var ref = _asyncToGenerator(function* () {
    try {
      let a = yield this.validateArguments(this.a);
      let url = yield this.makeUrl(a);

      let source = yield this.getSource(url);

      this.emit('succes', { result: 'object' });
    } catch (err) {
      this.emit('error', err);
    }
  });

  return function start() {
    return ref.apply(this, arguments);
  };
}();

// Inherit node event emitter
util.inherits(Download, EventEmitter);

module.exports = Download;