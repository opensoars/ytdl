"use strict";

const util = require('util');
const EventEmitter = require('events').EventEmitter;

const is = require('is');

const WorkingFmtFinder = class WorkingFmtFinder {
  constructor(args) {
    this.args = args;
  }
  validateArguments(args) {
    return new Promise((resolve, reject) => {
      if (!is.object(args))
        reject('!is.object(args)');
      else if (!is.array(args.fmts))
        reject('!is.array(args.fmts)');
      else if (!is.object(args.ytplayer_config))
        reject('!is.object(args.ytplayer_config)');
      else if (!is.function(args.resolve) || !is.function(args.reject))
        reject('!is.function(args.resolve) || !is.function(args.reject)');
      else
        resolve(args);
    });
  }
};

WorkingFmtFinder.prototype.start = async function start() {
  try {
    let args = await this.validateArguments(this.args);
    this.args.resolve(this.args.fmts[0]);
  }
  catch (err) {
    this.emit('error', err);
  }
};

util.inherits(WorkingFmtFinder, EventEmitter);

module.exports = WorkingFmtFinder;