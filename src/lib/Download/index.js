"use strict";

const util = require('util');
const EventEmitter = require('events').EventEmitter;
const https = require('https');

const ens = require('ens');

let Download = class Download {
  constructor(a) {
    this.a = ens.obj(a);
  }
  validateArguments(a) {
    return new Promise((resolve, reject) => {
      if (!a)
        reject('!a');
      else if (!a.v && !a.url)  
        reject('!a.v && !a.url');
      else if (typeof a.v !== 'string' && typeof a.url !== 'string')
        reject("typeof a.v !== 'string' && typeof a.url !== 'string'");
      else
        resolve(a);
    });
  }
  makeUrl(a) {
    return new Promise((resolve, reject) => {
      if (a.url && typeof a.url === 'string')
        resolve(a.url);
      else if (a.v && typeof a.v === 'string')
        resolve('https://www.youtube.com/watch?v=' + a.v);
      else
        reject('!a.url && !a.v');
    });
  }
  getSource(url) {
    return new Promise((resolve, reject) => {
      https.get(url, res => {
        let src = '';
        res.on('data', chunk => src += chunk);
        res.on('end', () => resolve(src));
        res.on('error', err => reject(err));
      });
    });
  }
}

Download.prototype.start = async function start() {
  try {
    let a = await this.validateArguments(this.a);
    let url = await this.makeUrl(a);

    let source = await this.getSource(url);


    this.emit('succes', { result: 'object' });
  }
  catch (err) {
    this.emit('error', err);
  }
};

// Inherit node event emitter
util.inherits(Download, EventEmitter);


module.exports = Download;