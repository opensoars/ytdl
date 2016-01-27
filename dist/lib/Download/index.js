"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const util = require('util');
const EventEmitter = require('events').EventEmitter;
const https = require('https');
const fs = require('fs');

const ens = require('ens');
const is = require('is');

let Download = class Download {
  constructor(a) {
    this.a = ens.obj(a);
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
  getValidatedArguments(a) {
    return new Promise(function (resolve, reject) {
      if (!a) reject('!a');else if (!a.v && !a.url) reject('!a.v && !a.url');else if (!is.string(a.v) && !is.string(a.url)) reject('!is.string(a.v) && !is.string(a.url)');else resolve(a);
    });
  }
  getUrlFromArguments(a) {
    return new Promise(function (resolve, reject) {
      if (is.string(a.url)) resolve(a.url);else if (is.string(a.v)) resolve('https://www.youtube.com/watch?v=' + a.v);else reject('!a.url && !a.v');
    });
  }
  getValidatedUrl(url) {
    return new Promise(function (resolve, reject) {
      let is_valid_url = false;

      let re_t1 = /https\:\/\/www\.youtube\.com\/watch\?v\=.+?/;

      if (re_t1.test(url)) is_valid_url = true;

      is_valid_url ? resolve(url) : reject('Invalid url' + url);
    });
  }
  getSourceFromUrl(url) {
    return new Promise(function (resolve, reject) {
      //setTimeout(() => resolve('src code'), 250);
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
  getValidatedSource(source) {
    return new Promise(function (resolve, reject) {
      resolve(source);
    });
  }
  getYtPlayerConfigFromSource(source, regexp_ytplayer_config) {
    return new Promise(function (resolve, reject) {
      if (!is.string(source)) return reject('!is.string(source)');else if (!is.regexp(regexp_ytplayer_config)) return reject('!is.regexp(regexp_ytplayer_config)');

      let ytplayer_config_matches = regexp_ytplayer_config.exec(source);

      if (is.array(ytplayer_config_matches) && ytplayer_config_matches[1]) resolve(JSON.parse(ytplayer_config_matches[1]));else reject('!ytplayer_config_matches');
    });
  }
  getSanizitedYtPlayerConfig(ytplayer_config) {
    return new Promise(function (resolve, reject) {
      resolve(ytplayer_config);
    });
  }
  extractMediaUrlsFromVideoInfo(ytplayer_config) {
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
    var _this = this;

    try {
      let a = yield this.getValidatedArguments(this.a);
      let unvalidated_url = yield this.getUrlFromArguments(a);
      let url = yield this.getValidatedUrl(unvalidated_url);
      let unvalidated_source = yield this.getSourceFromUrl(url);
      let source = yield this.getValidatedSource(unvalidated_source);
      let ytplayer_config = yield this.getYtPlayerConfigFromSource(unvalidated_source, this.regexp.ytplayer_config);
      let adaptive_fmts = ytplayer_config.args.adaptive_fmts;

      this.writeFile('adaptive_fmts', adaptive_fmts.split(',').join('\n\n'));

      adaptive_fmts.split(',').forEach(function (adaptive_fmt) {
        if (adaptive_fmt.indexOf('audio') !== -1) _this.writeFile('adaptive_fmt', adaptive_fmt.replace(/=/g, ':').replace(/&/g, ',').split(',').join('\n'));
      });
      /*
      let adaptive_fmts = ytplayer_config.args.adaptive_fmts;
      let r1 = /url=.+?[\&\,]/g;
      let fmt_stream_map = adaptive_fmts.match(r1);
       fmt_stream_map.forEach((stream, i) => {
        stream = stream
          .replace(/url=/g, '')
          .replace(/&/g, '')
          .replace(/%3A/g, ':')
          .replace(/%2F/g, '/')
          .replace(/%3F/g, '?')
          .replace(/%3D/g, '=')
          .replace(/%26/g, '&')
          .replace(/%252/g, ',')
          if (stream.indexOf('signature') === -1 && stream.indexOf('audio') !== -1) {
          this.writeFile('stream', stream);
        }
      });*/

      /*    await this.writeFile('source', source);
          await this.writeFile(
            'ytplayer_config.json',
            JSON.stringify(ytplayer_config, '', 2)
          );
      */
      this.emit('succes', { result: 'result' });
    } catch (err) {
      this.emit('error', err);
    }
  });

  return function start() {
    return ref.apply(this, arguments);
  };
}();

Download.prototype.regexp = {
  /**
   * Captures the ytplayer object, the pattern used is simple:
   *  <script>.+?ytplayer.config.+?=.+?
   * This matches a script containing a statement which assigns the
   * ytplayer.config property.
   *  (\{.+?\});
   * This matches and captures the object that is assigned to the
   * ytplayer.config property. This works because of the fact that the
   * assignment statement is closed by these two characters };
   *  .+?;<\/script>
   * Allow as much character matches as needed till the closing
   * script tag is found
   */
  ytplayer_config: /<script>.+?ytplayer.config.+?=.+?(\{.+?\});.+?;<\/script>/
};

// Inherit node event emitter
util.inherits(Download, EventEmitter);

module.exports = Download;