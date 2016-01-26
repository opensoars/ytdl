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
  getUrlFromArguments(a) {
    return new Promise(function (resolve, reject) {
      if (a.url && typeof a.url === 'string') resolve(a.url);else if (a.v && typeof a.v === 'string') resolve('https://www.youtube.com/watch?v=' + a.v);else reject('!a.url && !a.v');
    });
  }
  validateUrl(url) {
    return new Promise(function (resolve, reject) {
      let is_valid_url = false;

      let re_t1 = /https\:\/\/www\.youtube\.com\/watch\?v\=.+?/;

      if (re_t1.test(url)) is_valid_url = true;

      is_valid_url ? resolve(url) : reject('Invalid url' + url);
    });
  }
  getSource(url) {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        resolve('src code');
      }, 250);
      /*      https.get(url, res => {
              let src = '';
              res.on('data', chunk => src += chunk);
              res.on('end', () => resolve(src));
              res.on('error', err => reject(err));
            });*/
    });
  }
  getVideoInfoFromSource(source) {
    return new Promise(function (resolve, reject) {});
  }
  sanitizeVideoInfo(video_info) {
    return new Promise(function (resolve, reject) {});
  }
  extractMediaUrlsFromVideoInfo(video_info) {
    return new Promise(function (resolve, reject) {
      // Will I be doing the deciphering etc from here?
      // I could use another async function!
      // Which would have its code wrapped in another try catch
      // so we can just use promise resolve and reject api.
    });
  }
};

Download.prototype.start = function () {
  var ref = _asyncToGenerator(function* () {
    try {
      let a = yield this.validateArguments(this.a);
      let unvalidated_url = yield this.getUrlFromArguments(a);
      let url = yield this.validateUrl(unvalidated_url);
      let source = yield this.getSource(url);
      let unsanitized_video_info = yield this.getVideoInfoFromSource(source);
      let video_info = yield this.sanitizeVideoInfo();
      let media_urls = yield this.extractMediaUrlsFromVideoInfo(video_info);

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