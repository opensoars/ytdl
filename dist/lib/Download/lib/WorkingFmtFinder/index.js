"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const util = require('util');
const EventEmitter = require('events').EventEmitter;

const is = require('is');

const WorkingFmtFinder = class WorkingFmtFinder {
  constructor(args) {
    this.args = args;
  }
  validateArguments(args) {
    return new Promise(function (resolve, reject) {
      if (!is.object(args)) reject('!is.object(args)');else if (!is.array(args.fmts)) reject('!is.array(args.fmts)');else if (!is.object(args.ytplayer_config)) reject('!is.object(args.ytplayer_config)');else if (!is.function(args.resolve) || !is.function(args.reject)) reject('!is.function(args.resolve) || !is.function(args.reject)');else resolve(args);
    });
  }
};

WorkingFmtFinder.prototype.start = function () {
  var ref = _asyncToGenerator(function* () {
    try {
      let args = yield this.validateArguments(this.args);
      this.args.resolve(this.args.fmts[0]);
    } catch (err) {
      this.emit('error', err);
    }
  });

  return function start() {
    return ref.apply(this, arguments);
  };
}();

util.inherits(WorkingFmtFinder, EventEmitter);

module.exports = WorkingFmtFinder;